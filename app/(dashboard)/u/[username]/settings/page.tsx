import { Button } from "@/components/ui/button";

import { UrlCard } from "./_components/url-card";
import { KeyCard } from "./_components/key-card";
import { ConnectModal } from "./_components/connect-modal";
import { getSelf } from "@/lib/auth-service";
import { getStreamByUserId } from "@/lib/stream-service";

const SettingsPage = async () => {

  const self = await getSelf();
  const stream = await getStreamByUserId(self.id);

  if (!stream) {
    throw new Error("Stream not found");
  }
  
  return (
    <div className="p-8 w-[60%]">
      <div className="text-2xl font-bold">
        Settings
      </div>
      <div className="w-full flex justify-end p-4">
        <ConnectModal />
      </div>
      <div className="border border-black rounded-md bg-[#fdfdfd]">
        <UrlCard value={stream.serverUrl} />
        <KeyCard value={stream.streamKey} />
      </div>
      
    </div>
  )
}

export default SettingsPage;