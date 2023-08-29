import { useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder-2";
import Header from "../components/Header";
import RecorderUI from "../components/RecorderUI";

const Recording = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [showPreviewScreen, setShowPreviewScreen] = useState(false);

  return (
    <div className="bg-slate-200 min-h-screen min-w-screen">
      <Header />
      <div className="p-4 flex flex-wrap justify-between gap-8">
        <div className="my-4">
          <h3 className="text-lg font-medium">Webcam</h3>
          <ReactMediaRecorder
            video
            audio
            onStart={() => setShowPreview(true)}
            onStop={() => setShowPreview(false)}
            render={({
              status,
              startRecording,
              stopRecording,
              mediaBlobUrl,
              previewStream,
            }) => (
              <RecorderUI
                status={status}
                startRecording={startRecording}
                stopRecording={stopRecording}
                mediaBlobUrl={mediaBlobUrl}
                previewStream={previewStream}
                showPreview={showPreview}
                isWebcam={true}
              />
            )}
          />
        </div>
        <div className="my-4">
          <h3 className="text-lg font-medium">Screen</h3>
          <ReactMediaRecorder
            screen
            audio
            onStart={() => setShowPreviewScreen(true)}
            onStop={() => setShowPreviewScreen(false)}
            render={({
              status,
              startRecording,
              stopRecording,
              mediaBlobUrl,
              previewStream,
            }) => (
              <RecorderUI
                status={status}
                startRecording={startRecording}
                stopRecording={stopRecording}
                mediaBlobUrl={mediaBlobUrl}
                previewStream={previewStream}
                showPreview={showPreviewScreen}
                isWebcam={false}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Recording;
