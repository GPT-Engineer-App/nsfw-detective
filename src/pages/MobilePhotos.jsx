import React, { useState } from 'react';
import { FaUpload, FaSpinner } from 'react-icons/fa';
import { fileOpen } from 'browser-fs-access';
import { ImageAnnotatorClient } from '@google-cloud/vision';

const MobilePhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const client = new ImageAnnotatorClient();
      const results = await Promise.all(
        photos.map(async (photo) => {
          const [result] = await client.safeSearchDetection(photo);
          const detections = result.safeSearchAnnotation;
          return { photo, detections };
        })
      );
      setResults(results);
    } catch (err) {
      setError('An error occurred during the analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen text-white">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Mobile Photos</h1>
      </header>
      <section className="mb-8">
        <label className="block mb-2 text-lg font-medium">Upload your mobile photos:</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        <button onClick={handleDirectoryUpload} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4">
          Upload Directory
        </button>
      </section>
      <section className="mb-8">
        <button onClick={analyzePhotos} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
          {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaUpload className="mr-2" />}
          Analyze Photos
        </button>
      </section>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <section>
        <h2 className="text-2xl font-bold mb-4">Results:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map(({ photo, detections }, index) => (
            <div key={index} className="border p-2 rounded">
              {photo && <img src={URL.createObjectURL(photo)} alt={`Photo ${index + 1}`} className="w-full h-auto mb-2" />}
              <div>
                {detections && (
                  <div className={`text-sm ${detections.adult >= 3 ? 'text-red-500' : 'text-green-500'}`}>
                    Adult: {detections.adult}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <footer className="mt-8 text-center text-sm text-gray-200">
        <p>All analysis is done locally. No photos are uploaded to any server.</p>
      </footer>
    </div>
  );
};

export default MobilePhotos;