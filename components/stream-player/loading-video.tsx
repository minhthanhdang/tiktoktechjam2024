import { Loader } from "lucide-react";

interface LoadingVideoProps {
  label: string
}

export const LoadingVideo = ({
  label
}: LoadingVideoProps) => {
  return (
    <div className="h-full flex flex-col space-y-4 justify-center items-center border-black border-[3px] rounded-[48px]">
      <Loader className="h-10 w-10 text-muted-foreground animate-spin" />
      <p className="text-muted-foreground">
        {label}
      </p>
    </div>
  )
}