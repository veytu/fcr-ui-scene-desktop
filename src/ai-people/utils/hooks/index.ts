import { useState, useEffect } from "react";
import { normalizeFrequencies } from "../utils";
import { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng"

export const useMultibandTrackVolume = (
    track?: IMicrophoneAudioTrack | MediaStreamTrack,
    bands = 5,
    loPass = 100,
    hiPass = 600
  ) => {
    const [frequencyBands, setFrequencyBands] = useState<Float32Array[]>([]);
  
    useEffect(() => {
      if (!track) {
        return setFrequencyBands(new Array(bands).fill(new Float32Array(0)))
      }
  
      const ctx = new AudioContext();
      const finTrack = track instanceof MediaStreamTrack ? track : track.getMediaStreamTrack()
      const mediaStream = new MediaStream([finTrack]);
      const source = ctx.createMediaStreamSource(mediaStream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048
  
      source.connect(analyser);
  
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);
  
      const updateVolume = () => {
        analyser.getFloatFrequencyData(dataArray);
        let frequencies: Float32Array = new Float32Array(dataArray.length);
        for (let i = 0; i < dataArray.length; i++) {
          frequencies[i] = dataArray[i];
        }
        frequencies = frequencies.slice(loPass, hiPass);
  
        const normalizedFrequencies = normalizeFrequencies(frequencies);
        const chunkSize = Math.ceil(normalizedFrequencies.length / bands);
        const chunks: Float32Array[] = [];
        for (let i = 0; i < bands; i++) {
          chunks.push(
            normalizedFrequencies.slice(i * chunkSize, (i + 1) * chunkSize)
          );
        }
  
        setFrequencyBands(chunks);
      };
  
      const interval = setInterval(updateVolume, 10);
  
      return () => {
        source.disconnect();
        clearInterval(interval);
      };
    }, [track, loPass, hiPass, bands]);
  
    return frequencyBands;
  };
  
  export const useAutoScroll = (ref: React.RefObject<HTMLElement | null>) => {
  
    const callback: MutationCallback = (mutationList) => {
      mutationList.forEach((mutation) => {
        switch (mutation.type) {
          case "childList":
            if (!ref.current) {
              return
            }
            ref.current.scrollTop = ref.current.scrollHeight;
            break;
        }
      })
    }
  
    useEffect(() => {
      if (!ref.current) {
        return;
      }
      const observer = new MutationObserver(callback);
      observer.observe(ref.current, {
        childList: true,
        subtree: true
      });
  
      return () => {
        observer.disconnect();
      };
    }, [ref]);
  }
  