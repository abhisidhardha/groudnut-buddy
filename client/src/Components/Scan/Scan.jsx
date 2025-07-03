import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import './Scan.css';

const tips = [
  'Take close-up photos of affected areas (leaves, stems, fruits).',
  'Ensure good lighting to capture accurate colors and details.',
  'Include both healthy and diseased parts for comparison.',
  'Hold the camera steady to avoid blurry images.',
];

const videoConstraints = {
  width: 400,
  height: 300,
  facingMode: 'environment',
};

const Scan = () => {
  const { isLoggedIn } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [tab, setTab] = useState('camera');
  const [image, setImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  // Check if user is logged in

  if (!isLoggedIn) {
    return null;
  }

  // Always clear image when switching tabs
  const handleTabChange = newTab => {
    setTab(newTab);
    setImage(null); // <-- This clears the image on tab switch
  };

  // Webcam capture
  const capture = useCallback(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    const imageSrc = webcamRef.current.getScreenshot({
      mimeType: 'image/jpeg', // Force JPEG instead of PNG
    });
    setImage(imageSrc);
  }, [isLoggedIn, navigate]);

  const handleFile = file => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = e => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyse = async (e) => {
    e.stopPropagation();
    if (image && !isAnalyzing) {
      setIsAnalyzing(true);
      try {
        // Add actual API call here if needed
        navigate('/predictions', {
          state: {
            capturedImage: image,
            analysisType: 'plant_disease',
          },
        });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="scan-container">
      {/* ...title, description... */}
      <div className="scan-card">
        <div className="scan-tabs">
          <button
            className={`scan-tab${tab === 'camera' ? ' active' : ''}`}
            onClick={() => handleTabChange('camera')}
          >
            {/* Camera icon */} Camera
          </button>
          <button
            className={`scan-tab${tab === 'upload' ? ' active' : ''}`}
            onClick={() => handleTabChange('upload')}
          >
            {/* Upload icon */} Upload
          </button>
        </div>

        <div className="scan-content">
          {tab === 'camera' ? (
            <div className="camera-view styled-zone">
              {!image ? (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="video-preview"
                  />
                  <button className="capture-btn modern-btn" onClick={capture}>
                    {/* Camera icon */} Capture
                  </button>
                </>
              ) : (
                <div className="upload-preview">
                  <img src={image} alt="Captured" />
                  <div className="preview-btns">
                    <button
                      className="analyse-btn"
                      onClick={handleAnalyse}
                      disabled={!image || isAnalyzing}
                    >
                      <svg
                        width="22"
                        height="22"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ marginRight: 8 }}
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                      {isAnalyzing ? 'Analyzing...' : 'Analyse'}
                    </button>
                    <button className="clear-btn" onClick={() => setImage(null)}>
                      Retake
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`upload-view styled-zone${dragActive ? ' drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={e => {
                if (!image) fileInputRef.current.click();
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={e => handleFile(e.target.files[0])}
                hidden
              />
              {!image ? (
                <div className="upload-prompt">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                  <p>Click to browse or drag & drop</p>
                  <p className="supported-formats">Supported formats: JPEG, PNG</p>
                </div>
              ) : (
                <div className="upload-preview">
                  <img src={image} alt="Preview" />
                  <div className="preview-btns">
                    <button
                      className="analyse-btn"
                      onClick={handleAnalyse}
                      disabled={!image || isAnalyzing}
                    >
                      <svg
                        width="22"
                        height="22"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ marginRight: 8 }}
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                      {isAnalyzing ? 'Analyzing...' : 'Analyse'}
                    </button>
                    <button className="clear-btn" onClick={() => setImage(null)}>
                      Re-Upload
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="scan-tips">
        <h6>Tips for best results:</h6>
        <ul>
          {tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Scan;
