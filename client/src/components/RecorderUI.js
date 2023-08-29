import { useState } from "react";
import VideoPreview from "./VideoPreview";
import api from "./api";

const RecorderUI = ({
  status,
  startRecording,
  stopRecording,
  mediaBlobUrl,
  previewStream,
  showPreview,
  isWebcam,
}) => {
  const [webcamId, setWebcamId] = useState("");
  const [screenId, setScreenId] = useState("");
  // const blobToBase64 = (blob) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(blob);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });
  const beginRecording = async (isWebcam) => {
    try {
      let apiData = {
        webcam: isWebcam,
        screen: !isWebcam,
        startTime: Date.now(),
      };
      const { data } = await api.post(
        "http://localhost:3001/api/recordings/startRecording",
        apiData
      );
      console.log(data);
      isWebcam ? setWebcamId(data.data._id) : setScreenId(data.data._id);
    } catch (err) {
      console.log(err);
    }
  };
  const finishRecording = async (isWebcam) => {
    try {
      // const response = await fetch(mediaBlobUrl);
      // const blob = await response.blob();
      // const base64Blob = await blobToBase64(blob);
      const { data } = await api.patch(
        "http://localhost:3001/api/recordings/stopRecording",
        {
          id: isWebcam ? webcamId : screenId,
          endTime: Date.now(),
        }
      );
      console.log(data);
      isWebcam ? setWebcamId("") : setScreenId("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {showPreview ? (
        <VideoPreview stream={previewStream} />
      ) : (
        <video src={mediaBlobUrl} width={500} height={500} controls autoPlay />
      )}
      <p>Status : {status}</p>
      <div className="flex gap-4">
        <button
          className="btn btn-primary"
          onClick={() => {
            startRecording();
            beginRecording(isWebcam);
          }}
          disabled={showPreview}
        >
          Start Recording
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            stopRecording();
            finishRecording(isWebcam);
          }}
          disabled={!showPreview}
        >
          Stop Recording
        </button>
        <a
          className="btn btn-primary cursor-pointer"
          href={mediaBlobUrl}
          download={isWebcam ? "cam" : "screen" + Date.now()}
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default RecorderUI;
