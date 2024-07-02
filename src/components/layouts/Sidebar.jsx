import React from 'react';
import { FaPhotoVideo } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = ({ children }) => {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white min-h-screen">
        <div className="p-4 flex items-center">
          <FaPhotoVideo className="text-3xl mr-2" />
          <span className="text-2xl font-bold">Photo Analyzer</span>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-4 hover:bg-gray-700">
              <Link to="/">Home</Link>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <Link to="/google-photos">Google Photos</Link>
            </li>
            {/* Add more navigation items here if needed */}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;