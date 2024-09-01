import cv2
import io
import os 

def Video(video_path, path):

    vid = cv2.VideoCapture(video_path)

    fps = int(vid.get(cv2.CAP_PROP_FPS))
    width = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))

    output_path = os.path.join(path, "processed.mp4")
    output_codec = cv2.VideoWriter_fourcc('M', 'P', '4', 'V')
    output_fps = fps

    out = cv2.VideoWriter(output_path, output_codec, output_fps, (width, height))

    # print(fps)
    while vid.isOpened():
        ret, frame = vid.read()

        if not ret:
            break

        g_img = frame
        face_cascade = cv2.CascadeClassifier('/Users/shashank/python/FaceBlur/Server/haarcascade_frontalface_default.xml')

        # cv2.imwrite('grey_image.jpg',g_img)
        faces = face_cascade.detectMultiScale(g_img, scaleFactor=1.5, minNeighbors=5, minSize=(10, 10))
        for (x, y, w, h) in faces:
            roi = g_img[y:y+h, x:x+w]
            blurred_roi = cv2.GaussianBlur(roi, (89, 89), 10)
            g_img[y:y+h, x:x+w] = blurred_roi
        
        out.write((g_img))
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        
    vid.release()
    out.release()
    print(output_path)
    return output_path
