/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
/* eslint-disable react/no-unescaped-entities */
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MicIcon, LucideMic, PlayCircle } from "lucide-react";
import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar";

const VoiceRecorderDialog = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isRecording) {
      drawOscillations();
    }
  }, [isRecording]);

  useEffect(() => {
    if (audioURL && audioElementRef.current) {
      audioElementRef.current.play(); // Lecture automatique après enregistrement
      setupAudioAnalyser();
    }
  }, [audioURL]);

  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        analyser.fftSize = 2048;
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/wav",
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioURL(audioUrl);
          audioChunks.current = [];
        };

        mediaRecorder.start();
        setIsRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing microphone", error);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handlePublish = () => {
    console.log("Audio publié");
  };

  const setupAudioAnalyser = () => {
    if (!audioURL || !audioElementRef.current) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(
      audioElementRef.current!
    );
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 2048;

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    drawOscillations();
  };

  const drawOscillations = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext("2d");
    const analyser = analyserRef.current;
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);

      canvasContext!.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext!.lineWidth = 2;
      canvasContext!.strokeStyle = "#FA86BCFF";

      canvasContext!.beginPath();
      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasContext!.moveTo(x, y);
        } else {
          canvasContext!.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasContext!.lineTo(canvas.width, canvas.height / 2);
      canvasContext!.stroke();

      if (isRecording || audioURL) {
        requestAnimationFrame(draw);
      }
    };

    draw();
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  useEffect(() => {
    const audioElement = audioElementRef.current;
    if (audioElement) {
      const updateProgress = () => {
        if (audioElement.duration) {
          setAudioProgress(
            (audioElement.currentTime / audioElement.duration) * 100
          );
        }
      };
      const handleDurationChange = () => {
        if (audioElement.duration) {
          setAudioDuration(audioElement.duration);
        }
      };
      audioElement.addEventListener("timeupdate", updateProgress);
      audioElement.addEventListener("loadedmetadata", handleDurationChange);
      return () => {
        audioElement.removeEventListener("timeupdate", updateProgress);
        audioElement.removeEventListener(
          "loadedmetadata",
          handleDurationChange
        );
      };
    }
  }, [audioURL]);

  const togglePlay = () => {
    const audioElement = audioElementRef.current;
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <MicIcon
        className="w-6 h-6 text-pink-500 cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrement vocal</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center">
            <canvas ref={canvasRef} width={300} height={100} className="mt-4" />

            {/*<button
              onClick={handleMicClick}
              className="p-4 bg-pink-500 text-white rounded-full mt-4"
            >
              {isRecording ? 'Arrêter' : 'Commencer'}
            </button>*/}
            <LucideMic
              onClick={handleMicClick}
              className="cursor-pointer text-pink-600"
            >
              {isRecording ? "Arrêter" : "Commencer"}
            </LucideMic>

            {audioURL && !isRecording && (
              <>
                <div className="audio-player mt-4">
                  <audio ref={audioElementRef} src={audioURL} />
                  <div className="flex items-center justify-center">
                    {/*<button
                      onClick={togglePlay}
                      className="text-white bg-gray-800 p-2 rounded-lg"
                    >
                      {isPlaying ? "Pause" : "Play"}
                    </button>*/}
                    <PlayCircle onClick={togglePlay} className="cursor-pointer text-blue-500">
                      {isPlaying ? "Pause" : "Play"}
                    </PlayCircle>
                  </div>
                  <div className="flex justify-center mt-2">
                    <AnimatedCircularProgressBar
                      max={100}
                      min={0}
                      value={audioProgress}
                      gaugePrimaryColor="#FF91F9FF"
                      gaugeSecondaryColor=""
                    />
                  </div>
                </div>
                <button
                  onClick={handlePublish}
                  className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
                >
                  Publier
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoiceRecorderDialog;
