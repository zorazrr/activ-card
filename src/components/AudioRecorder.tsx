import { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";

const AudioRecorder = ({
    textCallBack,
}: {
    textCallBack: (text: string) => void;
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
        }
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

    const blobToBase64 = (blob: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise(resolve => {
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    };

    const stopRecording = () => {
        console.log("Stop recording");
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
        console.log("Recording stopped");
    };

    useEffect(() => {
        if (audioDataUrl !== "") {
            speechToText.mutate({ audioUrl: audioDataUrl });
        }
    }, [audioDataUrl]);


    return <div className="flex flex-col">
        {
            recordingStatus === "inactive" ? <button
                onClick={() => startRecording()}
                className="bg-mediumBlue text-white h-fit rounded-lg px-6 py-1 w-fit text-sm">Speak</button> :
                <button
                    onClick={() => stopRecording()}
                    className="bg-mediumBlue text-white h-fit rounded-lg px-6 py-1 w-fit text-sm"
                >Stop</button>
        }
        <button onClick={() => getMicrophonePermission()} className="text-xs">Grant Permission</button>
        {audio ? (
            <div>
                <audio src={audio} controls></audio>
            </div>
        ) : null}
    </div>;
}

export default AudioRecorder;