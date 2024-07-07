"use client";

import { GiftType, Stream, User } from "@prisma/client";
import { useViewerToken } from "@/hooks/use-viewer-token";

import { LiveKitRoom, useRemoteParticipant } from "@livekit/components-react";

import { ViewerContent } from "./viewer-content";

interface GuestStreamPlayerProps {
  user: User & { stream: Stream | null},
  stream: Stream,
  isFollowing: boolean,
  giftTypes: GiftType[]
}

export const GuestStreamPlayer = ({ 
  user, 
  stream,
  isFollowing,
  giftTypes
}: GuestStreamPlayerProps) => {

  const { token, name, identity } = useViewerToken(user.id);

  if (!token || !name || !identity) {
    return (
      <div>
      </div>
    )
  }

  return (
    <>
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
        className="relative w-full h-full"
      >
        <ViewerContent 
          hostName={user.username}
          hostIdentity={user.id}
          giftTypes={giftTypes}
        />
        
      </LiveKitRoom>

    
    </>
  )
}