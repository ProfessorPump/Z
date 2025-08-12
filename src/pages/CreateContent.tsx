import React, { useState, useRef, useEffect } from 'react';
import { Camera, Square, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const CreateContent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: true
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const startRecording = () => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });
    
    mediaRecorderRef.current = mediaRecorder;
    setRecordedChunks([]);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `recipe-video-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Video Saved",
        description: "Your recipe video has been downloaded successfully!",
      });
    };

    mediaRecorder.start();
    setIsRecording(true);
    setIsPaused(false);
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-6">Create Recipe Content</h1>
        
        <Card className="relative overflow-hidden bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-video object-cover"
          />
          
          {/* Camera Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
            <div className="absolute top-4 right-4">
              <Button
                variant="secondary"
                size="icon"
                onClick={switchCamera}
                className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
              >
                <RotateCcw size={20} />
              </Button>
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full h-16 w-16"
                  >
                    <Camera size={24} />
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={pauseRecording}
                      variant="secondary"
                      size="icon"
                      className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
                    >
                      {isPaused ? <Play size={20} /> : <Pause size={20} />}
                    </Button>
                    
                    <Button
                      onClick={stopRecording}
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full h-16 w-16"
                    >
                      <Square size={24} />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {isRecording && (
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    {isPaused ? 'PAUSED' : 'RECORDING'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
        
        <div className="mt-6 space-y-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">Recording Tips</h2>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Hold your device steady for the best results</li>
              <li>• Ensure good lighting when filming your cooking process</li>
              <li>• Speak clearly when explaining recipe steps</li>
              <li>• Use the pause feature to take breaks between steps</li>
              <li>• Switch between front and back camera as needed</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateContent;