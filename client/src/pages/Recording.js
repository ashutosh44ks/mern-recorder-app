import { useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder-2";
import api from "../components/api";
import VideoPreview from "../components/VideoPreview";
import Header from "../components/Header";

const Recording = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [showPreviewScreen, setShowPreviewScreen] = useState(false);

  const [webcamTime, setWebcamTime] = useState("");
  const [screenTime, setScreenTime] = useState("");
  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const saveRecording = async (isWebcam, mediaBlobUrl) => {
    try {
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      const base64Blob = await blobToBase64(blob);
      let apiData;
      if (isWebcam)
        apiData = {
          webcam: true,
          screen: false,
          startTime: webcamTime,
          endTime: Date.now(),
          base64Blob: base64Blob,
        };
      else
        apiData = {
          webcam: false,
          screen: true,
          startTime: screenTime,
          endTime: Date.now(),
          base64Blob: base64Blob,
        };
      const { data } = await api.post(
        "http://localhost:3001/api/recordings/",
        apiData
      );
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen min-w-screen">
      <Header />
      <div className="p-4 flex flex-wrap justify-between gap-8">
        <div className="my-4">
          <h3 className="text-lg font-medium">Webcam</h3>
          <ReactMediaRecorder
            video
            audio
            onStart={() => {
              setShowPreview(true);
            }}
            onStop={() => {
              setShowPreview(false);
            }}
            render={({
              status,
              startRecording,
              stopRecording,
              mediaBlobUrl,
              previewStream,
            }) => (
              <div>
                {showPreview ? (
                  <VideoPreview stream={previewStream} />
                ) : (
                  <video
                    src={mediaBlobUrl}
                    width={500}
                    height={500}
                    controls
                    autoPlay
                  />
                )}
                <p>Status : {status}</p>
                <div className="flex gap-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      startRecording();
                      setWebcamTime(Date.now());
                    }}
                    disabled={showPreview}
                  >
                    Start Recording
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      stopRecording();
                      saveRecording(true, mediaBlobUrl);
                    }}
                    disabled={!showPreview}
                  >
                    Stop Recording
                  </button>
                  <a
                    className="btn btn-primary cursor-pointer"
                    href={mediaBlobUrl}
                    download={"cam" + Date.now()}
                  >
                    Download
                  </a>
                </div>
              </div>
            )}
          />
        </div>
        <div className="my-4">
          <h3 className="text-lg font-medium">Screen</h3>
          <ReactMediaRecorder
            screen
            audio
            onStart={() => setShowPreviewScreen(true)}
            onStop={() => {
              setShowPreviewScreen(false);
            }}
            render={({
              status,
              startRecording,
              stopRecording,
              mediaBlobUrl,
              previewStream,
            }) => (
              <div>
                {showPreviewScreen ? (
                  <VideoPreview stream={previewStream} />
                ) : (
                  <video
                    src={mediaBlobUrl}
                    width={500}
                    height={500}
                    controls
                    autoPlay
                  />
                )}
                <p>Status : {status}</p>
                <div className="flex gap-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      startRecording();
                      setScreenTime(Date.now());
                    }}
                    disabled={showPreviewScreen}
                  >
                    Start Recording
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      stopRecording();
                      saveRecording(false, mediaBlobUrl);
                    }}
                    disabled={!showPreviewScreen}
                  >
                    Stop Recording
                  </button>
                  <a
                    className="btn btn-primary cursor-pointer"
                    href={mediaBlobUrl}
                    download={"screen" + Date.now()}
                  >
                    Download
                  </a>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Recording;
