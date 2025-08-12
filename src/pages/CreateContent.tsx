import React, { useState, useRef, useEffect } from 'react';
import { Camera, Square, Play, Pause, RotateCcw, Clock, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Timestamp {
  id: string;
  time: number;
  step: string;
  description: string;
}

const CreateContent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [recordingStartTime, setRecordingStartTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [timestamps, setTimestamps] = useState<Timestamp[]>([]);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDescription, setNewStepDescription] = useState('');
  const [showAddStep, setShowAddStep] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [facingMode]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentTime(Date.now() - recordingStartTime);
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused, recordingStartTime]);

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
      
      // Create download link with timestamps
      const a = document.createElement('a');
      a.href = url;
      a.download = `recipe-video-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Also save timestamps as JSON
      const timestampData = {
        video: `recipe-video-${Date.now()}.webm`,
        timestamps: timestamps
      };
      const timestampBlob = new Blob([JSON.stringify(timestampData, null, 2)], { type: 'application/json' });
      const timestampUrl = URL.createObjectURL(timestampBlob);
      const timestampLink = document.createElement('a');
      timestampLink.href = timestampUrl;
      timestampLink.download = `recipe-timestamps-${Date.now()}.json`;
      document.body.appendChild(timestampLink);
      timestampLink.click();
      document.body.removeChild(timestampLink);
      
      toast({
        title: "Video & Timestamps Saved",
        description: "Your recipe video and timestamps have been downloaded!",
      });
    };

    mediaRecorder.start();
    setIsRecording(true);
    setIsPaused(false);
    setRecordingStartTime(Date.now());
    setCurrentTime(0);
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
      setCurrentTime(0);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const addPreRecordingStep = () => {
    if (newStepTitle.trim()) {
      const newTimestamp: Timestamp = {
        id: Date.now().toString(),
        time: 0,
        step: newStepTitle.trim(),
        description: newStepDescription.trim()
      };
      setTimestamps(prev => [...prev, newTimestamp]);
      setNewStepTitle('');
      setNewStepDescription('');
      setShowAddStep(false);
      
      toast({
        title: "Step Added",
        description: "Recipe step added to timeline",
      });
    }
  };

  const addTimestamp = () => {
    if (isRecording) {
      const step = `Step ${timestamps.length + 1}`;
      const newTimestamp: Timestamp = {
        id: Date.now().toString(),
        time: currentTime,
        step: step,
        description: `Cooking step at ${formatTime(currentTime)}`
      };
      setTimestamps(prev => [...prev, newTimestamp]);
      
      toast({
        title: "Timestamp Added",
        description: `${step} marked at ${formatTime(currentTime)}`,
      });
    }
  };

  const removeTimestamp = (id: string) => {
    setTimestamps(prev => prev.filter(t => t.id !== id));
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
            
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  {isPaused ? 'PAUSED' : formatTime(currentTime)}
                </span>
              </div>
            </div>
            
            {isRecording && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <Button
                  onClick={addTimestamp}
                  variant="secondary"
                  size="sm"
                  className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
                >
                  <Clock size={16} className="mr-1" />
                  Mark Step
                </Button>
              </div>
            )}
          </div>
        </Card>
        
        <div className="mt-6 space-y-4">
          {/* Pre-recording step planning */}
          {!isRecording && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recipe Steps</h2>
                <Button
                  onClick={() => setShowAddStep(!showAddStep)}
                  variant="outline"
                  size="sm"
                >
                  <Plus size={16} className="mr-1" />
                  Add Step
                </Button>
              </div>
              
              {showAddStep && (
                <div className="mb-4 p-4 border rounded-lg bg-muted/50">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="stepTitle">Step Title</Label>
                      <Input
                        id="stepTitle"
                        value={newStepTitle}
                        onChange={(e) => setNewStepTitle(e.target.value)}
                        placeholder="e.g., Prepare ingredients"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stepDescription">Description (optional)</Label>
                      <Input
                        id="stepDescription"
                        value={newStepDescription}
                        onChange={(e) => setNewStepDescription(e.target.value)}
                        placeholder="e.g., Dice onions and mince garlic"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addPreRecordingStep} size="sm">
                        Add Step
                      </Button>
                      <Button 
                        onClick={() => setShowAddStep(false)} 
                        variant="outline" 
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {timestamps.length > 0 && (
                <div className="space-y-2">
                  {timestamps.map((timestamp, index) => (
                    <div key={timestamp.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-primary">
                            {isRecording ? formatTime(timestamp.time) : `Step ${index + 1}`}
                          </span>
                          <span className="text-sm font-semibold">{timestamp.step}</span>
                        </div>
                        {timestamp.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {timestamp.description}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => removeTimestamp(timestamp.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
          
          {/* Recording timestamps display */}
          {isRecording && timestamps.length > 0 && (
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-3">Recording Timeline</h2>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {timestamps.map((timestamp) => (
                  <div key={timestamp.id} className="flex items-center gap-2 text-sm">
                    <span className="text-primary font-mono">
                      {formatTime(timestamp.time)}
                    </span>
                    <span>{timestamp.step}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">Recording Tips</h2>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Plan your recipe steps before recording</li>
              <li>• Use "Mark Step" during recording to create timestamps</li>
              <li>• Pause recording between steps if needed</li>
              <li>• Hold your device steady for the best results</li>
              <li>• Ensure good lighting when filming your cooking process</li>
              <li>• Speak clearly when explaining recipe steps</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateContent;