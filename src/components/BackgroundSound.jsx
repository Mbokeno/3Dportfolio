import React, { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';

export function BackgroundAudio({ fileName, volume = 0.3 }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    console.log("BackgroundAudio component mounted");
    console.log("Attempting to load audio file:", fileName);

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);
    gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);

    fetch(fileName)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Audio file fetched successfully");
        return response.arrayBuffer();
      })
      .then(arrayBuffer => {
        console.log("Audio data received, decoding...");
        return audioContextRef.current.decodeAudioData(arrayBuffer);
      })
      .then(decodedData => {
        console.log("Audio decoded successfully");
        audioBufferRef.current = decodedData;
      })
      .catch(error => {
        console.error("Error loading audio:", error);
      });

    return () => {
      console.log("Cleaning up audio resources");
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [fileName, volume]);

  const playAudio = () => {
    if (audioContextRef.current && audioBufferRef.current) {
      sourceNodeRef.current = audioContextRef.current.createBufferSource();
      sourceNodeRef.current.buffer = audioBufferRef.current;
      sourceNodeRef.current.connect(gainNodeRef.current);
      sourceNodeRef.current.loop = true;
      sourceNodeRef.current.start();
      setIsPlaying(true);
      console.log("Audio playing");
    }
  };

  const pauseAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
      setIsPlaying(false);
      console.log("Audio paused");
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 'm') {
        if (isPlaying) {
          pauseAudio();
        } else {
          playAudio();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying]);

  return null;
}