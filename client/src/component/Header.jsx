import React from 'react';

const Header = () => {
  return (
    <header className="backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-huddle-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-huddle-text-light">Huddle</h1>
          </div>

          {/* Right Side: Post Button and User Profile */}
          <div className="flex items-center space-x-4">
            {/* "Post a Huddle" Button */}
            <button className="bg-huddle-orange text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-200 flex items-center space-x-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Post a Huddle</span>
            </button>
            
            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-huddle-dark-2 cursor-pointer">
              <img className="h-8 w-8 rounded-full object-cover" src="https://placehold.co/100x100/111827/FF7A59?text=G" alt="User Profile" />
              <span className="hidden md:block font-semibold text-gray-800">Gamer123</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
