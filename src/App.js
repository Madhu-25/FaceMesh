
import './App.css';
import "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam  from 'react-webcam';
import React, {useRef} from 'react';
import { drawMesh } from './util';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runFacemesh = async () => {
    const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    setInterval(() => {
      detect(net)
    }, 100)
  };

  const detect = async (net) => {
    if(typeof webcamRef.current !== 'undefined' && webcamRef.current !== null && webcamRef.current.video.readyState ===4)
    {
      //get video properties
      const video = webcamRef.current.video ;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      
      //set video properties

      // webcamRef.current.video.videoWidth = videoWidth;
      // webcamRef.current.video.videoHeight = videoHeight;

      //set canvas properties
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      //make detections
      const face = await net.estimateFaces({input : video});
      console.log(face);

      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx);

    }
  }
  runFacemesh();
  return (
    <div className="App"><header className="App-header">
      <Webcam ref={webcamRef} style = {
        {
          position : "absolute",
          marginLeft : "auto",
          marginRight : "auto",
          left : 0,
          right : 0,
          textAlign : "center",
          zIndex : 9,
          width : 640,
          height : 480
        }
      } />
      <canvas ref={canvasRef} style = {
        {
          position : "absolute",
          marginLeft : "auto",
          marginRight : "auto",
          left : 0,
          right : 0,
          textAlign : "center",
          zIndex : 9,
          width : 640,
          height : 480,
          border : "1px solid black"
        }
      } /></header>
    </div>
  );
}

export default App;
