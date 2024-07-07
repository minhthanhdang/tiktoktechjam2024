import { getSelf } from "@/lib/auth-service";
import { getStreamByUserId } from "@/lib/stream-service";

import { currentUser } from "@clerk/nextjs/server";
import { getUserByUsername } from "@/lib/user-service";

import { StreamPlayer } from "@/components/stream-player";
import { getColors } from "@/lib/color-service";
import { getGiftTypes } from "@/lib/gift-service";

interface CreatorPageProps {
  params: {
    username: string;
  }
}

const CreatorPage = async ({
  params,
}: CreatorPageProps) => {

  const externalUser = await currentUser();

  const user = await getUserByUsername(params.username);

  if (!user || user.externalUserId !== externalUser?.id || !user.stream) {
    throw new Error("Unauthorized")
  }

  const self = await getSelf();
  const stream = await getStreamByUserId(self.id);

  if (!stream) {
    throw new Error("Stream not found");
  }

  const colors = await getColors();
  const giftTypes = await getGiftTypes();

  return (
    <>
      <div className="relative h-[90%] aspect-[9/16]">
        <StreamPlayer 
          user={user}
          stream={user.stream}
          isFollowing={true}
          colors={colors}
          giftTypes={giftTypes}
        />
      </div>

      
    </>
  )
}

export default CreatorPage;