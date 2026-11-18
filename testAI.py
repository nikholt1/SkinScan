
from flask import Flask, request, jsonify
import random

app = Flask(__name__)

@app.route('/cnn/return', methods=['POST'])
def return_verdict():

    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image = request.files['image']

    # TODO: Pass image to CNN model
    verdict = round(random.random(), 4)

    return jsonify(verdict)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
