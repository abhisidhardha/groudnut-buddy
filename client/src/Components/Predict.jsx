import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Predict.css';
const diseaseInfo = {
  'Early Leaf Spot': {
    name: 'Early Leaf Spot Disease',
    description:
      'Fungal disease caused by Cercospora arachidicola affecting groundnut leaves with characteristic brown spots and yellow halos',
    symptoms: [
      'Small circular brown spots (1-3mm) with prominent yellow halos on upper leaf surface',
      'Lesions appear first on lower leaves and progress upward',
      'Brown to reddish-brown coloration with distinct yellow margins',
      'Spots may coalesce forming larger necrotic areas',
      'Premature defoliation starting from older leaves',
      'Reduced photosynthetic area leading to stunted growth',
    ],
    management: {
      cultural: [
        'Use certified disease-free seeds from resistant varieties',
        'Implement 3-4 year crop rotation with non-host crops',
        'Maintain proper plant spacing (30x10cm) for air circulation',
        'Remove and destroy infected crop residues after harvest',
        'Avoid overhead irrigation during flowering stage',
        'Practice deep plowing to bury infected debris',
      ],
      chemical: [
        {
          name: 'Chlorothalonil 75% WP',
          dose: '2g/L water (300-400g/acre)',
          schedule: 'First spray at symptom appearance, repeat every 10-14 days',
        },
        {
          name: 'Mancozeb 75% WP',
          dose: '2.5g/L water (400g/acre)',
          schedule: 'Preventive spray at 30 DAS, repeat every 15 days',
        },
        {
          name: 'Tebuconazole 25% EC',
          dose: '0.5ml/L water',
          schedule: '3 applications at 15-day intervals starting at 45 DAS',
        },
      ],
      biological: [
        'Trichoderma viride seed treatment (8-10g/kg seed)',
        'Pseudomonas fluorescens foliar spray (0.2%)',
        'Neem oil application (3-5ml/L) at weekly intervals',
      ],
    },
    fertilizers: [
      'Balanced NPK application: 20-40-40 kg/ha',
      'Potassium sulfate (60kg/ha) for disease resistance',
      'Foliar spray of micronutrients (Zn, Mn, Fe) at 0.5%',
      'Avoid excess nitrogen which increases disease susceptibility',
    ],
    environmental_factors:
      'Favored by 24-28°C temperature, high humidity (>80%), and frequent rainfall',
    impact: 'Can cause 20-50% yield loss if left uncontrolled, affects both pod and fodder quality',
  },
  'Early Rust': {
    name: 'Early Stage Rust Disease',
    description: 'Initial manifestation of Puccinia arachidis infection showing early symptoms before full pustule development',
    symptoms: [
      'Small whitish flecks appearing first on lower leaf surfaces',
      'Tiny yellow spots (0.2-0.5mm) that gradually enlarge',
      'Initial pustules are pale yellow before turning orange',
      'Spots primarily on abaxial (underside) surface of leaves',
      'Minimal leaf yellowing in early stages',
      'Pustules have not yet ruptured to expose spore masses'
    ],
    management: {
      cultural: [
        'Immediate removal of affected leaves if infection is localized',
        'Increase air circulation by adjusting plant spacing',
        'Avoid overhead irrigation to reduce leaf wetness',
        'Monitor weather conditions for disease-favorable periods',
        'Implement preventive cultural practices before full outbreak'
      ],
      chemical: [
        {
          name: 'Chlorothalonil 75% WP',
          dose: '2g/L water',
          schedule: 'Immediate application upon first symptom detection, repeat every 10 days'
        },
        {
          name: 'Mancozeb 75% WP',
          dose: '2.5g/L water',
          schedule: 'Preventive spray every 10-14 days during favorable conditions'
        },
        {
          name: 'Propiconazole 25% EC',
          dose: '1ml/L water',
          schedule: 'Early intervention spray, repeat after 15 days if needed'
        }
      ],
      biological: [
        'Immediate application of Trichoderma viride (0.2% solution)',
        'Preventive neem oil spray (0.3-0.5%) weekly',
        'Bacillus subtilis foliar application for disease suppression'
      ]
    },
    fertilizers: [
      'Immediate potassium boost: foliar spray of 1% KCl',
      'Reduce nitrogen inputs to prevent lush growth',
      'Apply phosphorus fertilizer (60-75kg/ha) to slow disease development',
      'Micronutrient spray containing silicon for cell wall strengthening'
    ],
    environmental_factors: 'Early infection occurs at 21-26°C with high humidity and leaf wetness periods of 6+ hours',
    critical_period: 'Most critical intervention window - immediate action can prevent disease establishment',
    impact: 'Early detection and treatment can prevent 40-60% potential yield losses',
    urgency: 'Requires immediate attention - disease spreads rapidly once established'
  },
  'Healthy': {
    name: 'Healthy Groundnut Plant',
    description:
      'Optimal plant health with vigorous growth, proper leaf development, and no visible disease symptoms',
    maintenance: [
      'Maintain soil pH between 6.0-6.8 for optimal nutrient uptake',
      'Ensure adequate drainage to prevent waterlogging',
      'Provide 500-750mm well-distributed rainfall or irrigation',
      'Maintain recommended plant population (3.33 lakh plants/ha)',
      'Regular monitoring for early detection of pest and disease symptoms',
    ],
    fertilizers: [
      'Basal application: 20kg N + 40kg P₂O₅ + 40kg K₂O per hectare',
      'Gypsum application: 400-500kg/ha at flowering stage (35-40 DAS)',
      'Rhizobium inoculation: 500g/ha for enhanced nitrogen fixation',
      'PSB (Phosphate Solubilizing Bacteria) for improved phosphorus availability',
      'Foliar spray of NPK 19:19:19 @ 0.5% at critical growth stages',
    ],
    monitoring: [
      'Weekly visual inspection for disease and pest symptoms',
      'Soil moisture monitoring during critical growth periods',
      'Regular assessment of nodulation status at 30-45 DAS',
      'Monitor for aphid populations (rosette disease vectors)',
      'Check plant vigor and leaf color for nutrient deficiency signs',
    ],
    message:
      '🌱 Excellent! Your groundnut crop is healthy. Continue current management practices for optimal yield!',
  },

  'Late Leaf spot': {
    name: 'Late Leaf Spot Disease',
    description:
      'Fungal disease caused by Nothopassalora personata (formerly Cercosporidium personatum) producing dark spots without yellow halos',
    symptoms: [
      'Small, dark brown to black circular spots on both leaf surfaces',
      'Spots typically lack the yellow halos seen in early leaf spot',
      'Lesions are smaller and darker compared to early leaf spot',
      'Velvety dark sporulation visible on leaf undersides',
      'Spots may coalesce causing "shot-hole" appearance',
      'Severe defoliation progressing from lower to upper leaves',
    ],
    management: {
      cultural: [
        'Plant resistant varieties like TAG-24, ICGV 91114',
        'Intercropping with tall crops (maize/sorghum) for microclimate modification',
        'Deep plowing of infected crop residues',
        'Avoid late planting to escape peak disease pressure',
        'Maintain optimal plant density for better air circulation',
      ],
      chemical: [
        {
          name: 'Propiconazole 25% EC',
          dose: '1ml/L water (200ml/acre)',
          schedule: 'Spray at first symptom appearance, repeat every 15 days',
        },
        {
          name: 'Tebuconazole 50% + Trifloxystrobin 25% WG',
          dose: '0.4g/L water',
          schedule: '3 applications at 15-day intervals',
        },
        {
          name: 'Carbendazim 12% + Mancozeb 63% WP',
          dose: '2g/L water',
          schedule: 'Preventive spray at 45 DAS, repeat every 14 days',
        },
      ],
      biological: [
        'Bacillus subtilis foliar application (0.2%)',
        'Trichoderma harzianum soil application (2.5kg/ha)',
        'Neem seed kernel extract (5%) spray',
      ],
    },
    fertilizers: [
      'High potassium application: 60-80kg K₂O/ha for disease tolerance',
      'Foliar application of 1% KNO₃ during disease stress',
      'Calcium and sulfur through gypsum (500kg/ha)',
      'Micronutrient mixture for plant immunity enhancement',
    ],
    environmental_factors:
      'Develops later in season, favored by 25-30°C temperature and high humidity',
    impact: 'Can cause 30-70% yield reduction, particularly severe in late-planted crops',
  },

  'Nutrient deficiency': {
    name: 'Nutritional Deficiency Complex',
    description:
      'Multiple nutrient imbalances affecting plant growth, leaf coloration, and overall crop productivity',
    subtypes: {
      nitrogen: {
        symptoms:
          'Uniform yellowing of older leaves, stunted growth, poor nodulation, reduced vigor',
        solution: 'Apply 15-20kg N/ha as starter dose + Rhizobium inoculation (500g/ha)',
      },
      phosphorus: {
        symptoms:
          'Purple/reddish leaf margins, delayed flowering, poor root development, dark green leaves',
        solution: 'Apply 40-60kg P₂O₅/ha + PSB inoculation for enhanced uptake',
      },
      potassium: {
        symptoms:
          'Marginal leaf scorch, yellowing between veins, poor pod filling, reduced oil content',
        solution: 'Apply 60-80kg K₂O/ha in split doses, foliar spray of 1% KCl',
      },
      calcium: {
        symptoms: 'Pod abortion, hollow kernels, poor shell development, blackened pegs',
        solution: 'Gypsum application 400-500kg/ha at pegging stage (35-40 DAS)',
      },
      magnesium: {
        symptoms: 'Interveinal chlorosis in older leaves, purple leaf margins, reduced chlorophyll',
        solution: 'Foliar spray of 2% MgSO₄ at 30, 45, and 60 DAS',
      },
      sulfur: {
        symptoms: 'Uniform chlorosis in young leaves, reduced protein and oil content',
        solution: 'Apply 25-30kg S/ha through gypsum or elemental sulfur',
      },
    },
    fertilizers: [
      'Soil test-based NPK application: 20-40-60 kg/ha',
      'Micronutrient mixture: Zn (5kg), Fe (10kg), Mn (5kg), B (1kg) per hectare',
      'Organic matter incorporation: 8-10 tonnes FYM/ha',
      'Foliar nutrition: Multi-micronutrient spray at flowering and pod development',
    ],
    diagnostic: 'Conduct leaf tissue analysis at 45-50 DAS for precise nutrient status assessment',
    management: [
      'Regular soil testing for nutrient monitoring',
      'Balanced fertilization based on soil test recommendations',
      'Foliar application of deficient nutrients for quick correction',
      'Organic matter addition for improved nutrient availability',
    ],
  },

  'Rust': {
    name: 'Groundnut Rust Disease',
    description:
      'Fungal disease caused by Puccinia arachidis producing characteristic orange-red pustules on leaf surfaces',
    symptoms: [
      'Small orange-red pustules (uredinia) on both leaf surfaces',
      'Pustules are 0.5-1mm in diameter with powdery appearance',
      'Epidermis ruptures exposing orange spore masses',
      'Pustules may appear on stems and petioles in severe cases',
      'Corresponding small brown spots on upper leaf surface',
      'Premature leaf senescence and defoliation',
    ],
    management: {
      cultural: [
        'Use moderately resistant varieties: ICGV 91114, Sedi',
        'Remove volunteer groundnut plants from previous crops',
        'Maintain proper plant spacing for air circulation',
        'Avoid water stress during critical growth periods',
        'Destroy crop residues immediately after harvest',
      ],
      chemical: [
        {
          name: 'Triadimefon 25% WP',
          dose: '1g/L water (500g/acre)',
          schedule: '3 sprays at 15-day intervals starting at symptom appearance',
        },
        {
          name: 'Propiconazole 25% EC',
          dose: '1ml/L water',
          schedule: 'First spray at 30 DAS, repeat every 15 days',
        },
        {
          name: 'Mancozeb 75% WP',
          dose: '2.5g/L water',
          schedule: '4 applications at 10-day intervals',
        },
      ],
      biological: [
        'Trichoderma viride foliar spray (0.2%)',
        'Pseudomonas fluorescens application',
        'Neem oil spray (0.5%) for disease suppression',
      ],
    },
    fertilizers: [
      'Reduce nitrogen application to prevent lush growth',
      'Increase potassium: 60-80kg K₂O/ha for disease resistance',
      'Silicon application (1g/L) for cell wall strengthening',
      'Balanced micronutrient application for plant immunity',
    ],
    environmental_factors: 'Favored by temperatures 21-26°C, leaf wetness >6 hours, humidity >85%',
    risk_factors:
      'High humidity, frequent dew formation, and moderate temperatures promote disease development',
    impact:
      'Can cause 25-60% yield loss due to reduced photosynthetic area and premature defoliation',
  },
};



const Predict = () => {
  const { state } = useLocation();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const analyzeImage = async () => {
      try {
        if (!state?.capturedImage) {
          throw new Error('No image provided for analysis');
        }

        const formData = new FormData();
        const response = await fetch(state.capturedImage);
        const blob = await response.blob();
        formData.append('image', blob, 'analysis.jpg');

        const { data } = await axios.post('http://localhost:5001/api/predict', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(data);
        setPrediction({
          ...data,
          confidence: data.confidence * 100,
        });
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Analysis failed');
      } finally {
        setLoading(false);
      }
    };

    analyzeImage();
  }, [state]);

  const getSeverity = confidence => {
    if (confidence < 60) return 'low';
    if (confidence < 80) return 'medium';
    return 'high';
  };

  const handleScanAgain = () => {
    navigate('/scan'); // Navigate to scan page
  };

  const handleGoHome = () => {
    navigate('/'); // Navigate to home page
  };

  const adjustDosage = (dose, severity) => {
    const multipliers = { low: 0.8, medium: 1, high: 1.2 };
    return dose
      .split('-')
      .map(d => {
        const num = parseFloat(d.replace(/[^\d.]/g, ''));
        return isNaN(num) ? d : (num * multipliers[severity]).toFixed(2);
      })
      .join('-');
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
        <p>Analyzing leaf structure...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>⚠️ Analysis Error</h3>
        <p>{error}</p>
        <button onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }

  if (!prediction) return null;

  // Get disease data using prediction result
  const diseaseData = diseaseInfo[prediction.prediction];
  console.log(diseaseData)
  if (!diseaseData) {
    console.error('Unknown disease class:', prediction.prediction);
    console.log('Available classes:', Object.keys(diseaseInfo));
    return (
      <div className="error-container">
        <h3>⚠️ Unknown Disease Classification</h3>
        <p>Received: {prediction.prediction}</p>
        <p>Available: {Object.keys(diseaseInfo).join(', ')}</p>
      </div>
    );
  }

  const severity = getSeverity(prediction.confidence);

  return (
    <div className="health-report">
      <div className="report-header">
        <h1>Crop Health Diagnosis</h1>
        <div className="confidence-indicator">
          <div
            className={`progress-bar ${severity}`}
            style={{ width: `${prediction.confidence.toFixed(1)}%` }}
          >
            <span>{prediction.confidence.toFixed(1)}% Confidence</span>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="image-preview">
          <h2>Analyzed Sample</h2>
          <img src={state.capturedImage} alt="Plant analysis" />
        </div>

        <div className="diagnosis-info">
          <h2>Diagnosis Result</h2>
          <div className={`diagnosis-tag ${severity}`}>{diseaseData.name}</div>
          <p className="disease-description">{diseaseData.description}</p>
          <div className="bottom-actions">
            <button className="btn-scan-large" onClick={handleScanAgain}>
              📸 Scan Another Plant
            </button>
            <button className="btn-home-large" onClick={handleGoHome}>
              🏠 Back to Home
            </button>
          </div>
        </div>

        {prediction.prediction === 'Healthy' ? (
          <div className="healthy-result">
            <div className="celebration-emoji">🌱</div>
            <h3>Healthy Plant!</h3>
            <p>{diseaseData.message}</p>
            <div className="prevention-tips">
              <h4>Maintenance Tips:</h4>
              <ul>
                {diseaseData.maintenance?.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
            <div className="monitoring-tips">
              <h4>Monitoring Schedule:</h4>
              <ul>
                {diseaseData.monitoring?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <>
            {/* Symptoms Section */}
            <div className="symptoms-section">
              <h3>Disease Symptoms</h3>
              <ul className="symptoms-list">
                {diseaseData.symptoms?.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>

            {/* Treatment Plan */}
            <div className="treatment-plan">
              <h3>Recommended Treatment</h3>
              <div className="treatment-columns">
                {/* Cultural Practices */}
                <div className="cultural-practices">
                  <h4>Cultural Methods</h4>
                  <ul>
                    {diseaseData.management?.cultural?.map((remedy, index) => (
                      <li key={index}>{remedy}</li>
                    ))}
                  </ul>
                </div>

                {/* Chemical Control */}
                <div className="chemical-control">
                  <h4>Chemical Treatments</h4>
                  {diseaseData.management?.chemical?.map((pesticide, index) => (
                    <div key={index} className="pesticide-card">
                      <div className="chemical-header">
                        <span className="chemical-name">{pesticide.name}</span>
                        <span className="dosage">{adjustDosage(pesticide.dose, severity)}</span>
                      </div>
                      <div className="application-info">{pesticide.schedule}</div>
                    </div>
                  ))}
                </div>

                {/* Biological Control */}
                {diseaseData.management?.biological && (
                  <div className="biological-control">
                    <h4>Biological Methods</h4>
                    <ul>
                      {diseaseData.management.biological.map((method, index) => (
                        <li key={index}>{method}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Fertilizer Recommendations */}
            {diseaseData.fertilizers && (
              <div className="nutrition-recommendations">
                <h3>Nutrition Management</h3>
                <div className="fertilizer-grid">
                  {diseaseData.fertilizers.map((fertilizer, index) => (
                    <div key={index} className="fertilizer-card">
                      <div className="fertilizer-icon">🌾</div>
                      <div className="fertilizer-info">{fertilizer}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            {diseaseData.impact && (
              <div className="impact-warning">
                <h4>⚠️ Economic Impact</h4>
                <p>{diseaseData.impact}</p>
              </div>
            )}

            {diseaseData.warning && (
              <div className="urgent-warning">
                <h4>🚨 Urgent Action Required</h4>
                <p>{diseaseData.warning}</p>
              </div>
            )}
          </>
        )}

        {/* All Prediction Scores */}
        <div className="all-scores">
          <h3>Detection Confidence</h3>
          <div className="scores-grid">
            {prediction.all_scores &&
              Object.entries(prediction.all_scores).map(([disease, score]) => (
                <div key={disease} className="score-item">
                  <span className="disease-name">{disease}</span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{ width: `${(score * 100).toFixed(1)}%` }}
                    ></div>
                    <span className="score-text">{(score * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Predict;
