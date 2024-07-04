import React, { useState } from 'react';
import { FaUpload, FaSpinner } from 'react-icons/fa';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { fileOpen } from 'browser-fs-access';
import * as nsfwjs from 'nsfwjs';

const Index = () => {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleFileChange = (event) => {
    setPhotos(Array.from(event.target.files));
  };

  const handleVideoChange = (event) => {
    setVideos(Array.from(event.target.files));
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

  const analyzeVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder for video analysis logic
      setResults([]);
    } catch (err) {
      setError('An error occurred during the video analysis.');
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
        mode: 'no-cors',
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
      <div className="container mx-auto p-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen text-white">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">Modern NSFW Detection Tool</h1>
        </header>
        <section className="mb-8">
          {!isLoggedIn ? (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onFailure={handleLoginFailure}
              flow="auth-code"
              scope="https://www.googleapis.com/auth/photoslibrary.readonly"
              redirect_uri="http://localhost:5173/oauth2callback"
            />
          ) : (
            <>
              <label className="block mb-2 text-lg font-medium">Upload your Google Photos library:</label>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <div className="relative group">
                <button onClick={handleDirectoryUpload} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4 transition duration-300 ease-in-out transform hover:scale-105">
                  Upload Directory
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                  Upload a directory of photos
                </div>
              </div>
              <label className="block mb-2 text-lg font-medium mt-4">Upload your Google Videos library:</label>
              <input type="file" multiple accept="video/*" onChange={handleVideoChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </>
          )}
        </section>
        <section className="mb-8">
          <div className="relative group">
            <button onClick={analyzePhotos} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center transition duration-300 ease-in-out transform hover:scale-105">
              {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaUpload className="mr-2" />}
              Analyze Photos
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
              Analyze uploaded photos
            </div>
          </div>
          <div className="relative group ml-4">
            <button onClick={analyzeVideos} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center transition duration-300 ease-in-out transform hover:scale-105">
              {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaUpload className="mr-2" />}
              Analyze Videos
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
              Analyze uploaded videos
            </div>
          </div>
        </section>
        {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}
        <section>
          <h2 className="text-2xl font-bold mb-4">Results:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(({ photo, predictions }, index) => (
              <div key={index} className="border p-2 rounded">
                {photo && <img src={URL.createObjectURL(photo)} alt={`Photo ${index + 1}`} className="w-full h-auto mb-2" />}
                <div>
                  {predictions && predictions.map((prediction, i) => (
                    <div key={i} className={`text-sm ${prediction.className === 'Porn' ? 'text-red-500' : 'text-green-500'}`}>
                      {prediction.className}: {Math.round(prediction.probability * 100)}%
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <footer className="mt-8 text-center text-sm text-gray-200">
          <p>All analysis is done locally. No photos or videos are uploaded to any server.</p>
        </footer>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Index;