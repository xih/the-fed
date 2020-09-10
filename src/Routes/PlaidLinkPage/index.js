import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios'
import { usePlaidLink } from 'react-plaid-link';

const PlaidLinkPage = () => {

  let [linkToken, setLinkToken] = useState('') 

  useEffect(() => {
    async function getLinkToken() {
      try {
        const response = await axios.post(
          'http://localhost:5001/flames-4cfe9/us-central1/createPlaidLinkToken', { // hardcoding firebase functions link
          data: {
            uid: '123456'
          }
        })
        setLinkToken(response.data?.result?.link_token || '')
        console.log(response)
      } catch (e) {
        console.log(e)
      }
    }
    getLinkToken()
  }, [])

  const onSuccess = useCallback(
    (token, metadata) => console.log('onSuccess', token, metadata),
    []
  );

  const onEvent = useCallback(
    (eventName, metadata) => console.log('onEvent', eventName, metadata),
    []
  );

  const onExit = useCallback(
    (err, metadata) => console.log('onExit', err, metadata),
    []
  );

  const config = {
    token: linkToken,
    onSuccess,
    onEvent,
    onExit,
    // –– optional parameters
    // receivedRedirectUri: props.receivedRedirectUri || null,
    // ...
  };

  const { open, ready, error } = usePlaidLink(config);

  return (
    <div>
      <button
        type="button"
        className="button"
        onClick={() => open()}
        disabled={!ready || error}
      >
        Open Plaid Link
      </button>
    </div>
  );
};

export default PlaidLinkPage;