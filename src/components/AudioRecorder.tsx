import { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";

const AudioRecorder = ({
  textCallBack,
  shouldDisplayAnswer,
}: {
  textCallBack: (text: string) => void;
  shouldDisplayAnswer: boolean;
}) => {
  const mimeType = "audio/mp3";
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string>("");
  const [audioDataUrl, setAudioDataUrl] = useState<string>("");

  const speechToText = api.gpt.speechToText.useMutation({
    onSuccess: (data) => {
      textCallBack(data.text);
    },
  });

  const getMicrophonePermission = async () => {
    try {
      console.log("Requesting permission...");
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      console.log("Permission granted");
      setPermission(true);
      setStream(streamData);
      return streamData;
    } catch (error) {
      console.error(error);
    }
  };

  const startRecording = async () => {
    if (permission) {
      if (stream) {
        setRecordingStatus("recording");
        const media = new MediaRecorder(stream);
        mediaRecorder.current = media;
        media.start();
        const localAudioChunks: Blob[] = [];
        media.ondataavailable = (event) => {
          if (typeof event.data === "undefined") return;
          if (event.data.size === 0) return;
          localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
      } else {
        const streamData = await getMicrophonePermission();
        if (streamData) {
          setRecordingStatus("recording");
          const media = new MediaRecorder(streamData);
          mediaRecorder.current = media;
          media.start();
          const localAudioChunks: Blob[] = [];
          media.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
          };
          setAudioChunks(localAudioChunks);
        }
      }
    } else {
      const streamData = await getMicrophonePermission();
      if (streamData) {
        setRecordingStatus("recording");
        const media = new MediaRecorder(streamData);
        mediaRecorder.current = media;
        media.start();
        const localAudioChunks: Blob[] = [];
        media.ondataavailable = (event) => {
          if (typeof event.data === "undefined") return;
          if (event.data.size === 0) return;
          localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
      }
    }
  };

  const blobToBase64 = (blob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    mediaRecorder.current!.stop();
    mediaRecorder.current!.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioDataUrl = blobToBase64(audioBlob);
      void audioDataUrl.then((data) => {
        setAudioDataUrl(data as string);
      });
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  useEffect(() => {
    if (audioDataUrl !== "") {
      speechToText.mutate({ audioUrl: audioDataUrl });
    }
  }, [audioDataUrl]);

  return (
    <div className="flex flex-col">
      {recordingStatus === "inactive" ? (
        <button
          onClick={() => startRecording()}
          className="h-fit w-fit rounded-lg bg-mediumBlue px-6 py-1 text-sm text-white"
          disabled={shouldDisplayAnswer}
        >
          Speak
        </button>
      ) : (
        <button
          onClick={() => stopRecording()}
          className="h-fit w-fit rounded-lg bg-mediumBlue px-6 py-1 text-sm text-white"
        >
          Stop
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;
