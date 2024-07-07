import { Color as dbColor } from "@prisma/client"

interface ColorPickProps {
  colors: dbColor[],
  changeColor: (c: dbColor) => void
};

export const ColorPick = ({ 
  colors,
  changeColor
}: ColorPickProps) => {

  return (
    <div className="flex flex-col w-full h-full items-center justify-center " >
      <div className="bg-[#f5f5f5] rounded-[2.5rem] w-full py-8 flex flex-col items-center gap-4">
      {colors.map((color) => (
        <div 
          className="w-[48px] h-[48px] rounded-full bg-white border-2 border-grey-200 flex items-center justify-center hover:scale-[115%]"
          onClick={() => changeColor(color)}
          key={color.id}
        >
          
          <img src={color.imageUrl} className="w-[36px] h-[36px]" />
        </div>
      ))}
      </div>
    </div>
  )
}