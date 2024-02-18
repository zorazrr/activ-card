import { useRef, useState } from "react";

const AudioRecorder = () => {

    const mimeType = "audio/webm";
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState<MediaStream>();
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [audio, setAudio] = useState<string>("");

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
        } catch (error) {
            console.error(error);
        }
    }

    const startRecording = async () => {
        console.log("Start recording")
        if (stream) {
            setRecordingStatus("recording");
            const media = new MediaRecorder(stream);
            mediaRecorder.current = media;
            console.log(media.state);
            media.start();
            console.log(media.state);
            const localAudioChunks: Blob[] = [];
            media.ondataavailable = (event) => {
                if (typeof event.data === "undefined") return;
                if (event.data.size === 0) return;
                localAudioChunks.push(event.data);
            };
            setAudioChunks(localAudioChunks);
            console.log("Recording started");
        }
    };

    const stopRecording = () => {
        console.log("Stop recording");
        setRecordingStatus("inactive");
        mediaRecorder.current!.stop();
        mediaRecorder.current!.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudio(audioUrl);
            setAudioChunks([]);
        };
        console.log("Recording stopped");
    };
    console.log(audio);

    return <div>
        <button onClick={() => getMicrophonePermission()}>Permission</button>
        <button onClick={() => startRecording()}>Start</button>
        <button onClick={() => stopRecording()}>Stop</button>
        {audio ? (
            <div>
                <audio src={audio} controls></audio>
                <a download href={audio}>
                    Download Recording
                </a>
            </div>
        ) : null}
    </div>;
}

export default AudioRecorder;