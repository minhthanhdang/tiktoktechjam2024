import { WifiOff } from "lucide-react";


interface OfflineVideoProps {
  username: string
}

export const OfflineVideo = ({
  username
}: OfflineVideoProps) => {
  return (
    <div className="h-full flex flex-col space-y-4 justify-center items-center rounded-[48px] border-[3px] border-black">
      <WifiOff className="h-10 w-10 text-muted-foreground" />
      <p className="text-muted-foreground">
        {username} is offline
      </p>
    </div>
  )
}