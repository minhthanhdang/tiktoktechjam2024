"use client";

import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { on } from "events";
import { useTransition } from "react";

interface ActionsProps {
  isFollowing: boolean;
  userId: string;
}

export const Actions = ({
  isFollowing,
  userId
}: ActionsProps) => {

  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId);
    })
  }

  const handleUnfollow = () => {
    startTransition(() => {
      onUnfollow(userId);
    })
  }

  const onClick = () => {
    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    } 
  }

  return (
    <Button 
      disabled={isPending} 
      onClick={onClick} 
      variant="primary"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  )
}