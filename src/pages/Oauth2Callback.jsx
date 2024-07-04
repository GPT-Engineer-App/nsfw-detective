import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const exchangeAuthorizationCode = async (code) => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: '329036519915-nhnl3ujtpp584uhmsvuqifu20076sqsa.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: 'http://localhost:5173/oauth2callback',
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error exchanging authorization code:', errorData);
      throw new Error('Failed to exchange authorization code');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in exchangeAuthorizationCode:', error);
    throw error;
  }
};

const Oauth2Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          const tokens = await exchangeAuthorizationCode(code);
          console.log('Tokens:', tokens);
          // Store tokens in local storage or context
          navigate('/');
        } catch (error) {
          console.error('Error exchanging authorization code:', error);
        }
      } else {
        console.error('Authorization code not found in URL parameters');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">OAuth2 Callback</h1>
      </header>
      <section>
        <p>Processing login...</p>
      </section>
    </div>
  );
};

export default Oauth2Callback;