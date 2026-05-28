import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-koin">KoinX</span>
          <span className="logo-dot">®</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
