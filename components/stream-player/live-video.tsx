"use client";

import { Participant, Track } from "livekit-client";
import { useRef } from "react";

import { useTracks } from "@livekit/components-react";
import { cn } from "@/lib/utils";


interface LiveVideoProps {
  participant: Participant;
  isSubScreen: boolean;
}

export const LiveVideo = ({
  participant,
  isSubScreen
}: LiveVideoProps) => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone])
    .filter((track) => track.participant.identity === participant.identity)
    .forEach((track) => {
      if (videoRef.current) {
        track.publication.track?.attach(videoRef.current);
      }
    })

  return (
    <div 
      ref={wrapperRef} 
      className={cn(
        "relative h-full flex items-center justify-center bg-black ",
        isSubScreen ? "rounded-xl" : "rounded-[48px]"
      )}>
      <video ref={videoRef} width="100%" 
        className={cn(
          isSubScreen ? "rounded-xl" : "rounded-[48px]"
        )}/>
    </div>
  )
}