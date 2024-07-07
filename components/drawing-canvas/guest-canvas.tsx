"use client"
import { use, useEffect, useRef, useState } from "react"

import { useChat } from "@livekit/components-react"
import { useDrawPath } from "@/hooks/use-draw";
import { drawLine, drawSplash } from "@/lib/draw-utils";
import { useGuestDrawLine } from "@/hooks/use-guest-draw";

interface GuestCanvasProps {
  hostIdentity: string
}

export const GuestCanvas = ({
  hostIdentity
}: GuestCanvasProps
) => {
  
  let color = 'red';
  const { canvasRef, penDown, clear } = useGuestDrawLine(guestDrawLine)
  

  const { chatMessages: messages, send } = useChat();
  const ctx = canvasRef.current?.getContext('2d')!

  const initCanvas = (metadata: string) => {

    const img = new Image();
    img.src = metadata
    img.onload = () => {
      ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      ctx?.drawImage(img, 0, 0)
    }
  }


  useEffect(() => {
    if (!messages) return
    
    if (!messages[messages.length-1]) return

    if (!messages[messages.length-1].message) return
    let message = JSON.parse(messages[messages.length-1].message)

    console.log(messages[messages.length-1].from?.identity, "host-"+hostIdentity)
    if (messages[messages.length-1].from?.identity == "host-"+hostIdentity) {
      if (message.type == "line") {
        drawLine({ start: message.content.start, end: message.content.end, ctx, color: message.content.color })
      } else if (message.type == "image") {
        initCanvas(message.content)
      } else if (message.type == "splash") {
        drawSplash({ start: message.content.start, end: message.content.end, ctx, color: message.content.color })
      }
    }
    

    
  }, [messages])


  function guestDrawLine({ ctx, currentPoint, prevPoint}: Draw) {
    
    if (!prevPoint) return;
   
    send(JSON.stringify({ type: "draw", content: {start: prevPoint, end: currentPoint, color }}))

  }



  return (
    <div className="relative aspect-[9:16] h-full bg-white border-0">
      <canvas
        ref={canvasRef}
        onMouseDown={penDown}
        height={1600}
        width={900}
        className="rounded-[64px] border-2 border-black"
        style={{ width: '100%', aspectRatio: "9/16"}}
      />
    </div>
  )
}