
from flask import Flask, request, jsonify
import random
import tkinter as tk
from PIL import Image, ImageTk
from io import BytesIO
from threading import Thread
from queue import Queue

app = Flask(__name__)

# Queue for transferring images from Flask to Tkinter
image_queue = Queue()


@app.route('/cnn/return', methods=['POST'])
def return_verdict():

    image = request.get_data()

    if not image:
        return jsonify({'error': 'No image received'}), 400

    print(f"Received image: {len(image)} bytes")

    # Send image to Tkinter
    image_queue.put(image)

    # Simulate CNN prediction
    verdict = round(random.random(), 4)

    return jsonify(verdict)


# Tkinter window
def start_gui():

    root = tk.Tk()
    root.title("CNN Image Scanner")
    root.geometry("330x450")

    image_label = tk.Label(root)
    image_label.pack(expand=True)

    def update_image():

        if not image_queue.empty():

            image_bytes = image_queue.get()

            # Convert bytes into an image
            pil_image = Image.open(BytesIO(image_bytes))

            # Resize for display
            pil_image.thumbnail((550, 450))

            # Convert to Tkinter format
            photo = ImageTk.PhotoImage(pil_image)

            image_label.config(image=photo)

            # Keep reference to prevent garbage collection
            image_label.image = photo

            print("Image displayed!")

        root.after(100, update_image)

    update_image()
    root.mainloop()


if __name__ == '__main__':

    # Run Flask in a separate thread
    server = Thread(
        target=lambda: app.run(
            host='0.0.0.0',
            port=5000,
            debug=False,
            use_reloader=False
        ),
        daemon=True
    )

    server.start()

    # Run Tkinter on the main thread
    start_gui()

