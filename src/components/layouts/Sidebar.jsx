import React from 'react';
import { FaCameraRetro } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = ({ children }) => {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-900 text-white min-h-screen">
        <div className="p-4 flex items-center">
          <FaCameraRetro className="text-3xl mr-2" />
          <span className="text-2xl font-bold">Modern NSFW Detection Tool</span>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-4 hover:bg-gray-700">
              <Link to="/">Home</Link>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <Link to="/google-photos">Google Photos</Link>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <Link to="/google-drive">Google Drive Library</Link>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <Link to="/mobile-photos">Mobile Photos</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gradient-to-r from-gray-50 to-gray-200">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;