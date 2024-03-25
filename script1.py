from scipy.spatial import distance as dist
from imutils.video import VideoStream
from imutils import face_utils
from threading import Thread
import numpy as np
import imutils
import time
import dlib
import cv2
import argparse

def eye_aspect_ratio(eye):
  # Vertical
  A = dist.euclidean(eye[1], eye[5])
  B = dist.euclidean(eye[2], eye[4])
  
  # Horizontal
  C = dist.euclidean(eye[0], eye[3])
  
  ear = (A + B) / (2.0 * C)
  
  return ear


if __name__ == "__main__":
  ap = argparse.ArgumentParser()
  ap.add_argument("-p", "--shape-predictor", required=True, help="path to facial landmark predictor")
  ap.add_argument("-w", "--webcam", type=int, default=0, help="index of webcam on system")
  args = vars(ap.parse_args())
  
  EYE_AR_THRESH = 0.3
  EYE_AR_CONSEC_FRAMES = 24
  
  COUNTER = 0
  ALARM_ON = False
  
  print("[INFO] loading facial landmark predictor...")
  detector = dlib.get_frontal_face_detector()
  predictor = dlib.shape_predictor(args["shape_predictor"])
  
  (lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
  (rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]
  
  print("[INFO] starting video stream thread...")
  vs = VideoStream(src=args["webcam"]).start()
  time.sleep(1.0)
  
  while True:
    frame = vs.read()
    frame = imutils.resize(frame, width=800)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    rects = detector(gray, 0)
    
    
    for rect in rects:
      shape = predictor(gray, rect)
      shape = face_utils.shape_to_np(shape)
      
      leftEye = shape[lStart:lEnd]
      rightEye = shape[rStart:rEnd]
      leftEAR = eye_aspect_ratio(leftEye)
      rightEAR = eye_aspect_ratio(rightEye)
      
      ear = (leftEAR + rightEAR) / 2.0
      
      leftEyeHull = cv2.convexHull(leftEye)
      rightEyeHull = cv2.convexHull(rightEye)
      cv2.drawContours(frame, [leftEyeHull], -1, (0, 255, 0), 1)
      cv2.drawContours(frame, [rightEyeHull], -1, (0, 255, 0), 1)
      
      if ear < EYE_AR_THRESH:
        COUNTER += 1
        
        if COUNTER >= EYE_AR_CONSEC_FRAMES:
          if not ALARM_ON:
            ALARM_ON = True
            
          cv2.putText(frame, "ACORDA!!!!", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
      else:
        COUNTER = 0
        ALARM_ON = False
        
      cv2.putText(frame, f"EAR: {ear:.2f}", (300, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    
    cv2.imshow("Frame", frame)
    key = cv2.waitKey(1)
    
    if(key == ord("q")):
      break
    
cv2.destroyAllWindows()

vs.stop()
  