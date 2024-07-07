"use client"

import {  GiftType } from "@prisma/client"

import { useChat } from "@livekit/components-react"

interface GiftsProps {
  giftTypes: GiftType[]
}

export const Gifts = ({
  giftTypes
}: GiftsProps) => {

  const {chatMessages, send} = useChat()

  const onClick = (giftType: GiftType) => {
    send(JSON.stringify({
      type: "gift", content: giftType.name 
    }))
    console.log('sent gift')
  }

  return (
    <div className="w-full h-[48px] flex gap-4 items-center justify-center rounded-3xl bg-[rgba(235,235,235,0.5)] py-10">
      {
        giftTypes.map((gift) => (
          <div 
            className="text-[24px] w-[64px] h-[64px] bg-white hover:bg-gray-200 flex items-center justify-center rounded-full"
            onClick={() => onClick(gift)}
          >
            <img className="relative w-[80%] h-[80%]" src={gift.imageUrl} />
          </div>
        ))
      }
    </div>
  )
}