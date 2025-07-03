import React, { useState } from 'react';
import './Main.css';
import FeaturesSection from './Home/FeaturesSection';

const Main = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <>
      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={handleSidebarClose}
      ></div>
      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <button className="close-btn" onClick={handleSidebarClose} aria-label="Close menu">
          &times;
        </button>
        <div className="sidebar-brand">
          <a href="/" onClick={handleSidebarClose}>
            Home
          </a>
          <a href="/scan" onClick={handleSidebarClose}>
            Scan
          </a>
          <a href="/login" onClick={handleSidebarClose}>
            Login/Signup
          </a>
        </div>
      </aside>

      <div className="hero-container">
        <div className="hero-content">
          <div className="text-content">
            <h1 className="main-heading">Diagnose Plant Diseases Instantly</h1>
            <h2 className="subheading">
              <i>
                Use AI-powered technology to identify plant diseases and get treatment
                recommendations in seconds.
              </i>
            </h2>
            <a href="/scan" className="cta-button">
              Get Started
            </a>
          </div>
          <div className="icon-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="180"
              height="180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4CAF50"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="leaf-icon"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
        </div>
      </div>
      <FeaturesSection />
    </>
  );
};

export default Main;
