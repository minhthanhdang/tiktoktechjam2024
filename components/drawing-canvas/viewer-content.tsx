"use client"

import { ConnectionState, Track } from "livekit-client";
import { useConnectionState, useRemoteParticipant, useTracks } from "@livekit/components-react";
import { useEffect, useState } from "react";

import { OfflineVideo } from "../stream-player/offline-video";
import { LoadingVideo } from "../stream-player/loading-video";
import { LiveVideo } from "../stream-player/live-video";

import { cn } from "@/lib/utils";
import { GuestCanvas } from "./guest-canvas";
import { Gifts } from "@/app/(browse)/[username]/_components/gifts";
import { GiftType } from "@prisma/client";

interface ViewerContentProps {
  hostName: string,
  hostIdentity: string,
  giftTypes: GiftType[]
}

export const ViewerContent = ({
  hostName,
  hostIdentity,
  giftTypes
}: ViewerContentProps) => {

  const [ isDrawing, setIsDrawing] = useState(false)

  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);
  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.Microphone,
  ]).filter((track) => track.participant.identity === hostIdentity);

  if (!participant?.metadata) {
    
  } else {
    if (participant!.metadata != 'notDrawing' && !isDrawing) {
      setIsDrawing(true)
    }
    if (participant!.metadata == 'notDrawing' && isDrawing) {
      setIsDrawing(false)
    }
  }
  
  let videoContent;
  let gameplayContent;
  let giftContent;

  if (!participant && connectionState === ConnectionState.Connected) {
    videoContent = <OfflineVideo username={hostName}/>
    if (isDrawing) {
      setIsDrawing(false)
    }
   
  } else if (!participant || tracks.length === 0) {
    videoContent = <LoadingVideo label={connectionState}/>
    
    
  } else {
    videoContent = <LiveVideo participant={participant} isSubScreen={isDrawing}/>

    if (isDrawing) {
      gameplayContent = <GuestCanvas hostIdentity={hostIdentity} />
      giftContent=
      <Gifts 
        giftTypes={giftTypes}
      />
    }
  }


  return (
    <div className="aspect-[9/16] h-full border-b relative">
      <div className={cn(
        `aspect-[9/16]`,
        isDrawing ? "absolute top-6 right-9 aspect-[9/16] w-[100px] z-20" : "absolute w-full h-full")}>
        {videoContent}
      </div>

      <div className={cn(
        `aspect-[9/16]`,
        isDrawing ? "absolute w-full h-full" : "absolute top-6 right-9 aspect-[9/16] w-[100px] z-20")}>
        {gameplayContent}
      </div>
      <div className="absolute bottom-2 left-0 w-full">
        {giftContent}    
      </div>
    </div>
  )
}