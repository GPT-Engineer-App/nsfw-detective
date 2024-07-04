import React from 'react';
import { FaCameraRetro } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

const Sidebar = ({ children }) => {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-900 text-white min-h-screen">
        <div className="p-4 flex items-center">
          <FaCameraRetro className="text-3xl mr-2" />
          <span className="text-2xl font-bold">Photo & Video Analyzer</span>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-4 hover:bg-gray-700 transition duration-300 ease-in-out">
              <Link to="/" data-tip="Home">Home</Link>
            </li>
            <li className="p-4 hover:bg-gray-700 transition duration-300 ease-in-out">
              <Link to="/google-photos" data-tip="Google Photos">Google Photos</Link>
            </li>
            <li className="p-4 hover:bg-gray-700 transition duration-300 ease-in-out">
              <Link to="/google-drive" data-tip="Google Drive Library">Google Drive Library</Link>
            </li>
            <li className="p-4 hover:bg-gray-700 transition duration-300 ease-in-out">
              <Link to="/mobile-photos" data-tip="Mobile Photos">Mobile Photos</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gradient-to-r from-gray-50 to-gray-200 transition duration-300 ease-in-out">
        {children}
      </main>
      <Tooltip place="right" type="dark" effect="solid" />
    </div>
  );
};

export default Sidebar;