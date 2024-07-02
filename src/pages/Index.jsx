import React, { useState } from 'react';
import { FaUpload, FaSpinner } from 'react-icons/fa';
import * as nsfwjs from 'nsfwjs';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { fileOpen } from 'browser-fs-access';

const Index = () => {
  const [photos, setPhotos] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleFileChange = (event) => {
    setPhotos(Array.from(event.target.files));
  };

  const handleDirectoryUpload = async () => {
    try {
      const files = await fileOpen({
        multiple: true,
        mimeTypes: ['image/*'],
        mode: 'read',
        recursive: true,
      });
      setPhotos(files);
    } catch (err) {
      setError('An error occurred while uploading the directory.');
    }
  };

  const analyzePhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const model = await nsfwjs.load();
      const results = await Promise.all(
        photos.map(async (photo) => {
          const img = new Image();
          img.src = URL.createObjectURL(photo);
          await img.decode();
          const predictions = await model.classify(img);
          return { photo, predictions };
        })
      );
      setResults(results);
    } catch (err) {
      setError('An error occurred during the analysis.');
    } finally {
      setLoading(false);
    }
  };

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

      return response.json();
    } catch (error) {
      console.error('Error in exchangeAuthorizationCode:', error);
      throw error;
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
          <h1 className="text-4xl font-bold">NSFW Detection Tool</h1>
        </header>
        <section className="mb-8">
          {!isLoggedIn ? (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onFailure={handleLoginFailure}
              flow="auth-code"
              scope="https://www.googleapis.com/auth/photoslibrary.readonly"
              redirect_uri="http://localhost:8000/oauth2callback"
            />
          ) : (
            <>
              <label className="block mb-2 text-lg font-medium">Upload your Google Photos library:</label>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <button onClick={handleDirectoryUpload} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4">
                Upload Directory
              </button>
            </>
          )}
        </section>
        <section className="mb-8">
          <button onClick={analyzePhotos} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
            {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaUpload className="mr-2" />}
            Analyze
          </button>
        </section>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <section>
          <h2 className="text-2xl font-bold mb-4">Results:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(({ photo, predictions }, index) => (
              <div key={index} className="border p-2 rounded">
                <img src={URL.createObjectURL(photo)} alt={`Photo ${index + 1}`} className="w-full h-auto mb-2" />
                <div>
                  {predictions.map((prediction, i) => (
                    <div key={i} className={`text-sm ${prediction.className === 'NSFW' ? 'text-red-500' : 'text-green-500'}`}>
                      {prediction.className}: {(prediction.probability * 100).toFixed(2)}%
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>All analysis is done locally. No photos are uploaded to any server.</p>
        </footer>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Index;