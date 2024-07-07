"use client"


import { ConnectionState, Track } from "livekit-client";
import { useConnectionState, useRemoteParticipant, useTracks } from "@livekit/components-react";
import { useEffect, useState } from "react";
import { OfflineVideo } from "./offline-video";
import { LoadingVideo } from "./loading-video";
import { LiveVideo } from "./live-video";
import { DrawingCanvas } from "../drawing-canvas";
import { Button } from "../ui/button";

import { updateParticipantMetadata } from "@/actions/ingress";

import { cn } from "@/lib/utils";
import { GiftType, Stream } from "@prisma/client";
import { ColorPick } from "../drawing-canvas/color-pick";
import { Color as dbColor } from "@prisma/client";
import { ActionPick } from "../drawing-canvas/action-pick";

interface ContentProps {
  hostName: string,
  hostIdentity: string,
  stream: Stream,
  colors: dbColor[],
  giftTypes: GiftType[]
}

export const Content = ({
  hostName,
  hostIdentity,
  stream,
  colors,
  giftTypes
}: ContentProps) => {

  const [ color, setColor ] = useState<dbColor>(colors[0])
  const [ isDrawing, setIsDrawing] = useState(false)
  const [ action, setAction ] = useState<GiftType | null>(null)
  const [ isSubScreen, setIsSubScreen ] = useState(false)

  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);
  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.Microphone,
    Track.Source.ScreenShare
  ]).filter((track) => track.participant.identity === hostIdentity);


  let videoContent;
  let gameplayContent;
  let buttonContent;

  if (!participant && connectionState === ConnectionState.Connected) {
    videoContent = <OfflineVideo username={hostName}/>
    if (isDrawing) {
      setIsDrawing(false)
    }
  } else if (!participant || tracks.length === 0) {
    videoContent = <LoadingVideo label={connectionState}/>
    
  } else {
    videoContent = <LiveVideo participant={participant} isSubScreen={isSubScreen} />

    if (isDrawing) {
      if (!isSubScreen) {
        setIsSubScreen(true)
      }
      gameplayContent = (
        <div className="relative h-full w-full aspect-[9/16]">
          <DrawingCanvas 
            color={color.name}
            action={action}
          />
          <div className="absolute left-[-5.5rem] top-0 h-full w-[64px]">
            <ColorPick 
              colors={colors}
              changeColor={(c)=>{setColor(c)}}
            />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[88px]">
            <ActionPick 
              giftTypes={giftTypes}
              setGiftType={(a)=>setAction(a)}
            />
          </div>
        </div>
      )
      buttonContent= (
        <Button 
          onClick={() => {updateParticipantMetadata("notDrawing"); setIsDrawing(false)}}
          className=" font-bold"
        >
          Finish Draw
        </Button>
      )
    } else {
      if (isSubScreen) {
        setIsSubScreen(false)
      }
      buttonContent= (
        <Button 
          onClick={() => {updateParticipantMetadata("isDrawing"); setIsDrawing(true)}}
          className=" font-bold"
        >
          Start Draw
        </Button>
      )
    }
  }


  return (
    <div className="aspect-[9/16] h-full relative">
      <div className={cn(
        `aspect-[9/16]`,
        isDrawing ? "absolute top-6 right-9  aspect-[9/16] w-[100px] z-20" : "absolute w-full h-full")}>
        {videoContent}
      </div>

      <div className={cn(
        `aspect-[9/16]`,
        isDrawing ? "absolute w-full h-full" : "absolute top-6 right-9 aspect-[9/16] w-[100px] z-20")}>
        {gameplayContent}
      </div>

      <div className="absolute bottom-[10rem] right-[-8rem]">
        {buttonContent}
      </div>
    </div>
  )
}