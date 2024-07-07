import { GiftType } from "@prisma/client"

interface ActionPickProps {
  giftTypes: GiftType[],
  setGiftType: (giftType: GiftType) => void
}

export const ActionPick = ({
  giftTypes,
  setGiftType
}: ActionPickProps) => {

  return (
    <div className="w-full h-[64px] flex items-center justify-center z-20">
      <div className="w-[75%] h-[64px] bg-gray-200 flex items-center justify-center rounded-full gap-4">
        {giftTypes.map((gift) => (
          <div 
            className="text-[24px] w-[56px] h-[56px] bg-white hover:scale-[120%] flex items-center justify-center rounded-full"
            onClick={() => setGiftType(gift)}
            key={gift.id}
          >
            <img className="relative w-[80%] h-[80%]" src={gift.imageUrl} />
          </div>
        ))}
      </div>
    </div>
  )
}