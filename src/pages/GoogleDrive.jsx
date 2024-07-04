import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FaSpinner } from 'react-icons/fa';

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
        redirect_uri: 'http://localhost:8080/oauth2callback',  // Ensuring port 8080 is used
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

const GoogleDrive = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchDriveFiles = async (accessToken) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setFiles(data.files);
    } catch (err) {
      setError('An error occurred while fetching files from Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (response) => {
  console.log('Login Success:', response);
  try {
    if (!response.code) {
      throw new Error('Authorization code not found in response');
    }
    const tokens = await exchangeAuthorizationCode(response.code);
    console.log('Tokens:', tokens);
    setIsLoggedIn(true);
    fetchDriveFiles(tokens.access_token);
  } catch (error) {
    console.error('Error exchanging authorization code:', error);
    setError('Failed to exchange authorization code.');
  }
};

  const handleLoginFailure = (response) => {
    console.log('Login Failed:', response);
    setError('Google login failed.');
  };

  return (
    <GoogleOAuthProvider clientId="329036519915-nhnl3ujtpp584uhmsvuqifu20076sqsa.apps.googleusercontent.com">
      <div className="container mx-auto p-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">Google Drive Library</h1>
        </header>
        <section className="mb-8">
          {!isLoggedIn ? (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onFailure={handleLoginFailure}
              flow="auth-code"
              scope="https://www.googleapis.com/auth/drive.readonly"
              redirect_uri="http://localhost:8080/oauth2callback"  // Ensuring port 8080 is used
            />
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4">Files:</h2>
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <ul>
                  {files.map((file) => (
                    <li key={file.id}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
        {error && <div className="text-red-500 mb-4">{error}</div>}
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleDrive;