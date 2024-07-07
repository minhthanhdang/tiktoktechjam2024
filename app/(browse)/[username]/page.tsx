import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";
import { notFound } from "next/navigation";
import { Actions } from "./_components/actions";
import { StreamPlayer } from "@/components/stream-player";
import { Gifts } from "./_components/gifts";
import { GuestStreamPlayer } from "@/components/drawing-canvas/guest-stream-player";
import { getGiftTypes } from "@/lib/gift-service";

interface UserPageProps {
  params: {
    username: string;
  }
}

const UserPage = async ({
  params
}: UserPageProps) => { 
  const user = await getUserByUsername(params.username);

  if (!user || !user.stream) {
    notFound();
  }

  const isFollowing = await isFollowingUser(user.id);

  const giftTypes = await getGiftTypes();


  return (
    <div className="relative h-[80%] aspect-[9/16] rounded-md">
      <GuestStreamPlayer 
        user={user}
        stream={user.stream}
        isFollowing={isFollowing}
        giftTypes={giftTypes}
      />
      
      
    </div>
  )
}

export default UserPage;