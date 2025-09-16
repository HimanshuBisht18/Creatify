import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { RiSettings3Fill } from 'react-icons/ri';

const themes = ['light', 'dark', 'blue', 'green'];

const Navbar = () => {
  const [theme, setTheme] = useState('light');

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved && themes.includes(saved)) setTheme(saved);
  }, []);

  // Apply theme class to html
  useEffect(() => {
    document.documentElement.className = theme; // set theme as class
    localStorage.setItem('theme', theme);
  }, [theme]);

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <div className="nav flex items-center justify-between px-6 sm:px-10 md:px-20 lg:px-24 h-[70px] sm:h-[80px] md:h-[90px] border-b border-gray-800">
      {/* Logo */}
      <div className="logo">
        <h3 className="text-xl sm:text-2xl md:text-[25px] font-bold sp-text">
          CREATIFY
        </h3>
      </div>

      {/* Icons */}
      <div className="icons flex items-center gap-4 sm:gap-6">
        <div onClick={cycleTheme} className="icon cursor-pointer text-lg sm:text-xl">
          {theme === 'light' && '🌞'}
          {theme === 'dark' && '🌙'}
          {theme === 'blue' && '💧'}
          {theme === 'green' && '🌿'}
        </div>
        {/* <div className="icon text-lg sm:text-xl"><FaUser /></div>
        <div className="icon text-lg sm:text-xl"><RiSettings3Fill /></div> */}
      </div>
    </div>
  );
};

export default Navbar;
