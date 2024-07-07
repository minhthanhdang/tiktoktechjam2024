"use client";

import { useState, useEffect } from "react";
import { Color, GiftType, Stream, User } from "@prisma/client";
import { useViewerToken } from "@/hooks/use-viewer-token";

import { LiveKitRoom, useRemoteParticipant } from "@livekit/components-react";
import { DrawingCanvas } from "../drawing-canvas";


import { Button } from "../ui/button";
import { Content } from "./content";
import { Color as dbColor } from "@prisma/client";

interface StreamPlayerProps {
  user: User & { stream: Stream | null},
  stream: Stream,
  isFollowing: boolean,
  colors: dbColor[],
  giftTypes: GiftType[]
}

export const StreamPlayer = ({ 
  user, 
  stream,
  isFollowing,
  colors,
  giftTypes
}: StreamPlayerProps) => {

  const { token, name, identity } = useViewerToken(user.id);

  if (!token || !name || !identity) {
    return (
      <div>
        Not allowed
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
        className="relative w-full h-full"
      >
        <Content 
          hostName={user.username}
          hostIdentity={user.id}
          stream={stream}
          colors={colors}
          giftTypes={giftTypes}
        />
      </LiveKitRoom>
      
    </div>
  )
}