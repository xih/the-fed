const functions = require('firebase-functions');
const plaid = require('plaid');
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: functions.config().service_account.project_id,
    clientEmail: functions.config().service_account.client_email,
    privateKey: functions.config().service_account.private_key,
  }),
  databaseURL: 'https://flames-4cfe9.firebaseio.com',
})
const firestore = admin.firestore();

const PLAID_PUBLIC_KEY = "fdf53c20671b04c633e7d60c27c82e"

const plaidClient = new plaid.Client({
  clientID: functions.config().plaid.clientid,
  secret: functions.config().plaid.secret,
  PLAID_PUBLIC_KEY,
  env: plaid.environments.sandbox
});

exports.createPlaidLinkToken = functions.https.onCall(async (data, context) => {
  const { uid } = data
  try {
    let response = await plaidClient.createLinkToken({
      user: {
        client_user_id: String(uid),
      },
      client_name: 'flames',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    })
    const { expiration, link_token, request_id, status_code } = response
    return {
      expiration,
      link_token
    }
  } catch (e) {
    console.log('error', e)
  }
})


exports.exchangePublicToken = functions.https.onCall(async (data, context) => {
  const { publicToken, userId } = data
  console.log('data', data)
  try {
    let response = await plaidClient.exchangePublicToken(publicToken)
    const {access_token, item_id, request_id, status_code} = response

    // user document would have an array of itemIds and accessTokens
    const newFinancialInstitutionPayload = {
      item_id: {
        accessToken: access_token,
      }
    }

    const userDoc = firestore.collection('USERS').doc(String(userId))
    const res = await userDoc.update({
      financialInstitutions: admin.firestore.FieldValue.arrayUnion(newFinancialInstitutionPayload)
    })

    // itemId is the id for the financialInstitution
    return {
      itemId: item_id
    }
  } catch(e) {
    console.log('error', e)
  }
})

exports.addFinancialAccounts = functions.https.onCall(async (data, context) => {
  const { userId } = data

  try {
    const userRef = firestore.collection('USERS').doc(String(userId))
    const userDoc = await userRef.get()
    const userData = userDoc.data()

    const accessToken = userData.financialInstitutions[0].access_token // this will break in the future
    // either use this that's stored on the database or use it from the accountResponse
    const financialInstitutionId = userData.financialInstitutions[0].item_id // this will break in the future

    let accountResponse = await plaidClient.getAccounts(accessToken)

    const { accounts, item } = accountResponse
    const financialInstitutionId2 = item.item_id


    // put all the accounts in a ACCOUNTS collection referenced by userID
    const batch = firestore.batch()
    const financialAccountsRef = firestore.collection('FINANCIAL_ACCOUNTS')

    accounts.forEach(account => {
      const accountData = {
        ...account,
        userId,
        financialInstitutionId2,
      }

      const newDoc = financialAccountsRef.doc()
      batch.set(newDoc, accountData)
    })

    batch.commit()
    console.log('added all accounts complete!')

    return {
      accounts: 'hi'
    }
  } catch (e) {
    console.log('error', e)
  }
})
