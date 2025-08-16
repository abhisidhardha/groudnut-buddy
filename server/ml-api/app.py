from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io

app = Flask(__name__)
print(tf.__version__)

# Configure CORS for frontend
CORS(app,origins="http://localhost:5173",
        allow_headers=["Content-Type"],
        expose_headers=["Access-Control-Allow-Origin"],
        supports_credentials=True,
        methods=["POST", "OPTIONS"],
        max_age=3600)

# Model configuration
IMAGE_SIZE = 128  # Match your model's input size
CHANNELS = 3
CLASS_NAMES = [
    'Early Leaf Spot',
    'Early Rust',
    'Healthy',
    'Late Leaf spot',
    'Nutrient deficiency',
    'Rust'
]

# Load trained model
model = load_model('../models/model.h5')  # Ensure correct model path
print(f"Model loaded. Input shape: {model.input_shape}")

def preprocess_image(image_bytes):
    """Process uploaded image to match model requirements"""
    try:
        img = Image.open(io.BytesIO(image_bytes))

        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Resize and normalize
        img = img.resize((IMAGE_SIZE, IMAGE_SIZE))
        img_array = np.array(img) / 255.0

        # Add batch dimension
        return np.expand_dims(img_array, axis=0)

    except Exception as e:
        raise RuntimeError(f"Image processing failed: {str(e)}")

@app.route('/api/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        # Validate request
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400

        # Process image
        img_bytes = file.read()
        processed_img = preprocess_image(img_bytes)

        # Make prediction
        predictions = model.predict(processed_img)

        print(f"Raw predictions shape: {predictions.shape}")
        print(f"Raw predictions: {predictions[0]}")

        class_id = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))

        # Format response
        return jsonify({
            "prediction": CLASS_NAMES[class_id],
            "confidence": round(confidence, 4),
            "all_classes": {cls: float(score) for cls, score in zip(CLASS_NAMES, predictions[0])}
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "Failed to process image"
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)