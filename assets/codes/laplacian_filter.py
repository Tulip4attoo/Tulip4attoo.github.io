import cv2
import numpy as np
from PIL import Image

image = cv2.imread("output.jpg")
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

laplacian0 = np.array(([0, 1, 0],
                      [1, -4, 1],
                      [0, 1, 0]), dtype="int")
laplacian1 = np.array(([1, 1, 1],
                       [1, -8, 1],
                       [1, 1, 1]), dtype="int")
laplacian2 = np.array(([1, 2, 1],
                      [2, -12, 2],
                      [1, 2, 1]), dtype="int")
laplacian3 = np.array(([1, 0, 1],
                      [4, -12, 4],
                      [1, 0, 1]), dtype="int")
laplacian4 = np.array(([1, 4, 1],
                      [0, -12, 0],
                      [1, 4, 1]), dtype="int")

kernelBank = (("laplacian0", laplacian0),
              ("laplacian1", laplacian1),
              ("laplacian2", laplacian2),
              ("laplacian3", laplacian3),
              ("laplacian4", laplacian4))

Image.fromarray(gray).show()

for (kernelName, kernel) in kernelBank:
    opencvOutput = cv2.filter2D(gray, -1, kernel)
    cv2.putText(opencvOutput, 
            kernelName,
            (30,30), 
            cv2.FONT_HERSHEY_SIMPLEX, 
            1,
            (255,0,255))
    Image.fromarray(opencvOutput).show()
