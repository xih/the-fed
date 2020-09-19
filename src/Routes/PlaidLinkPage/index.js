import React, { useCallback, useEffect, useState } from "react"
import { connect } from 'react-redux'
import { usePlaidLink } from "react-plaid-link"
import { PlaidAsyncActions, PlaidAsyncTypes } from '../../Stores/Plaid/Actions'
import { Button } from 'react-bootstrap'
// import { getUserId } from '../../Stores/User/Selectors'
import { getLinkToken } from '../../Stores/Plaid/Selectors'

const PlaidLinkPage = ({ createPlaidLinkToken, userId, linkToken, exchangePublicToken, addFinancialInstitution }) => {

  console.log('linkToken', linkToken)

  const onSuccess = useCallback(
    (token, metadata) => {
      console.log("onSuccess", token, metadata)
      exchangePublicToken(token, metadata)
      addFinancialInstitution()
    }, [addFinancialInstitution, exchangePublicToken]
  )

  const onEvent = useCallback(
    (eventName, metadata) => console.log("onEvent", eventName, metadata),
    []
  )

  const onExit = useCallback(
    (err, metadata) => console.log("onExit", err, metadata),
    []
  )

  const config = {
    token: linkToken,
    onSuccess,
    onEvent,
    onExit,
    // –– optional parameters
    // receivedRedirectUri: props.receivedRedirectUri || null,
  }

  const { open, ready, error } = usePlaidLink(config)

  return (
    <div>
      {
        ready? open() : null
      }

      <Button
        onClick={() => createPlaidLinkToken(userId)}>
          Create Plaid Link Token TEST
      </Button>
      <Button
        disabled={!ready || error}
        onClick={() => open()}>
        Open plaid link
      </Button>
    </div>
  )
}

const mapStateToProps = state => ({
  errorMsg: state.plaid.errors[PlaidAsyncTypes.CREATE_PLAID_LINK_TOKEN],
  linkToken: getLinkToken(state)
})

const mapDispatchToProps = (dispatch) => ({
  createPlaidLinkToken: (userId) => dispatch(PlaidAsyncActions.createPlaidLinkToken({ userId })),
  exchangePublicToken: (token, metadata) => dispatch(PlaidAsyncActions.exchangePublicToken({ token, metadata })),
  addFinancialInstitution: () => dispatch(PlaidAsyncActions.addFinancialInstitution())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaidLinkPage)
