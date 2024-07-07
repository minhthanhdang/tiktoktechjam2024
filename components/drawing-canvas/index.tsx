"use client";

import { useState, useRef, useEffect, use } from "react";
import { useDrawPath } from "@/hooks/use-draw";

import { drawSplash, drawLine } from "@/lib/draw-utils";

import { Button } from "../ui/button";

import { useChat } from "@livekit/components-react";

import { ReceivedChatMessage } from "@livekit/components-react";
import { GiftType } from "@prisma/client";

interface DrawingCanvasProps {
  color: string,
  action: GiftType | null
}

export const DrawingCanvas = ({
  color,
  action
}: DrawingCanvasProps) => {

  const {canvasRef, penDown, clear } = useDrawPath(hostDrawLine)
  
  const { chatMessages: messages, send } = useChat();

  const ctx = canvasRef.current?.getContext('2d');

  const [ queue, setQueue ] = useState<ReceivedChatMessage[]>([])


  function hostDrawLine ({ ctx, currentPoint, prevPoint }: Draw) {
    if (!prevPoint) return;

    if (!action) {
      drawLine({ start: prevPoint, end: currentPoint, ctx, color })
    
      send(JSON.stringify({ type: "line", content: {start: prevPoint, end: currentPoint, color }}))
    } else {
      if (action.name == "Brush") {
        drawLine({ start: prevPoint, end: currentPoint, ctx, color })
    
        send(JSON.stringify({ type: "line", content: {start: prevPoint, end: currentPoint, color }}))
      } else if (action.name == "GiftBox") {
        drawSplash({ start: prevPoint, end: currentPoint, ctx, color })
        send(JSON.stringify({ type: "splash", content: {start: prevPoint, end: currentPoint, color }}))
      }
    }
    
    
    
  }

  useEffect(() => {
    if (!messages) return

    const message = messages[messages.length-1]
    if (!message) return

    const data = JSON.parse(message.message)

    if (data.type == "gift") {

      console.log("received gift")
      setQueue([...queue, message])

    } else if (data.type == "draw") {

      const sender = message.from?.identity
      if (!sender) return

      if (queue.length==0) return
      const nextGuest = queue[0]
      if (!nextGuest.from) return

      if (sender != nextGuest!.from?.identity) return
      
      else {
        const drawType = JSON.parse(nextGuest.message).content
        
        
        clientDraw(data, drawType)

        setQueue(queue => queue.slice(1))
      }
    }
  }, [messages])


  const loadImage = () => {
    
    const image = new Image()
    
    image.src = "/bird.png"
    image.onload = () => {
      ctx?.drawImage(image, 0, 0)
    }

    send(JSON.stringify({ type: "image", content: image.src}))
  }

  
  

  function clientDraw (content: any, drawType: string) {

    if (!ctx) return
    if (content.type == "draw") {
      if (!content.content.start) return;

      if (drawType == "Brush") {
        drawLine({ start: content.content.start, end: content.content.end, ctx, color: color })
        send(JSON.stringify({ type: "line", content: {start: content.content.start, end: content.content.end, color }}))
      } else if (drawType == "GiftBox") {
        drawSplash({ start: content.content.start, end: content.content.end, ctx, color: color })
        send(JSON.stringify({ type: "splash", content: {start: content.content.start, end: content.content.end, color }}))
      }

      

      
    } else {
      console.log('really')
      /*const image = new Image()
      image.src = content.content
      image.onload = () => {
        ctx?.drawImage(image, 0, 0)
      }

      send(JSON.stringify({ type: "image", content: content.content}))*/
    }
  }


  return (
    <div className="relative aspect-[9:16] h-full bg-white border-0">
      <canvas
        ref={canvasRef}
        onMouseDown={penDown}
        height={1600}
        width={900}
        className="rounded-[64px] border-2 border-black"
        style={{ height: '100%', aspectRatio: "9/16"}}
      />
      <Button
        onClick={loadImage}
        className="absolute right-[-8rem] bottom-[7rem]"
      >
        Init Image
      </Button>
    </div>
  )
} 

