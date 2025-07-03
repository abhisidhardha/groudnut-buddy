import React from 'react';
import './FeaturesSection.css';

const steps = [
  {
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
        <circle cx="12" cy="13" r="3"></circle>
      </svg>
    ),
    title: 'Take a Photo',
    desc: 'Use your camera or upload an image of the affected plant.',
  },
  {
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
    ),
    title: 'AI Analysis',
    desc: 'Our AI analyzes the image to identify the plant disease.',
  },
  {
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
      </svg>
    ),
    title: 'Get Results',
    desc: 'Receive diagnosis and treatment recommendations instantly.',
  },
];

const features = [
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 18h8"></path>
        <path d="M3 22h18"></path>
        <path d="M14 22a7 7 0 1 0 0-14h-1"></path>
        <path d="M9 14h2"></path>
        <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path>
        <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path>
      </svg>
    ),
    title: 'Accurate Detection',
    desc: 'Identifies 50+ plant diseases with high accuracy.',
  },
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
        <path d="m8.5 8.5 7 7"></path>
      </svg>
    ),
    title: 'Treatment Guide',
    desc: 'Get detailed treatment recommendations for each disease.',
  },
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
      </svg>
    ),
    title: 'Share Results',
    desc: 'Share diagnosis results via SMS with friends or experts.',
  },
  {
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
        <path d="M12 18h.01"></path>
      </svg>
    ),
    title: 'Mobile Friendly',
    desc: 'Works on any device with a responsive design.',
  },
];

const FeaturesSection = () => (
  <div className="features-section">
    <section className="how-it-works">
      <h2 className="section-title">How It Works</h2>
      <div className="steps-row">
        {steps.map((item, i) => (
          <div className="step-card" key={i}>
            <div className="step-icon">{item.icon}</div>
            <h6 className="step-title">{item.title}</h6>
            <p className="step-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
    <section className="features-grid">
      <h2 className="section-title">Features</h2>
      <div className="grid-row">
        {features.map((item, i) => (
          <div className="feature-card" key={i}>
            <div className="feature-icon">{item.icon}</div>
            <h6 className="feature-title">{item.title}</h6>
            <p className="feature-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default FeaturesSection;
