const functions = require('firebase-functions');
const plaid = require('plaid');

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
