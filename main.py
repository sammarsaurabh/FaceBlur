from flask import Flask, jsonify, request, send_file
from flask_cors import CORS, cross_origin
import video
import numpy as np
import io
import os
import tempfile

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/upload', methods=['POST'])
def post_data():
    video_file = request.files.get('file')

    temp_dir = tempfile.TemporaryDirectory()

    print(type(video_file))
    print(video_file)

    path_to_video = os.path.join(temp_dir.name, video_file.filename)
    video_file.save(path_to_video)

    print(path_to_video)

    processed_video_path = video.Video(path_to_video, temp_dir.name)
    print(processed_video_path)
    return send_file(processed_video_path)


if __name__ == "__main__":
    app.run(host='localhost', port=8000, debug=True)
