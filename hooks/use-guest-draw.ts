import { useEffect, useRef, useState } from 'react'


export const useGuestDrawLine = (onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void) => {
  
    const [mouseDown, setMouseDown] = useState(false)
    const start = useRef<null | Point>(null)
  
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const prevPoint = useRef<null | Point>(null)
  
    const penDown = () => setMouseDown(true)
  
    const clear = () => {
      const canvas = canvasRef.current
      if (!canvas) return
  
      const ctx = canvasRef.current.getContext('2d')
      if (!ctx) return
  
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  
    useEffect(() => {
      const handler = (e: MouseEvent) => {
      
        if (!mouseDown) {
          if (start.current) {
            const currentPoint = mousePositionInCanvas(e)
            const ctx = canvasRef.current?.getContext('2d')
            if (!ctx || !currentPoint) return

            onDraw({ ctx, currentPoint: start.current, prevPoint: currentPoint })
            start.current = null
          }
          return
        }

        const currentPoint = mousePositionInCanvas(e)
        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx || !currentPoint) return

        if (!start.current) {
          start.current = currentPoint
          return
        }
      }
  
      const mousePositionInCanvas = (e: MouseEvent) => {
        const canvas = canvasRef.current
        if (!canvas) return
  
        const rect = canvas.getBoundingClientRect()

        const width = rect.right - rect.left
        const ratio = width / canvas.width 

        const x = (e.clientX - rect.left) / ratio
        const y = (e.clientY - rect.top) / ratio

        if (!x || !y) return null
        else
  
        return { x, y }
      }
  
      const mouseUpHandler = () => {
        setMouseDown(false)
        prevPoint.current = null
      }
  
      // Add event listeners
      canvasRef.current?.addEventListener('mousemove', handler)
      window.addEventListener('mouseup', mouseUpHandler)
  
      // Remove event listeners
      return () => {
        canvasRef.current?.removeEventListener('mousemove', handler)
        window.removeEventListener('mouseup', mouseUpHandler)
      }
    }, [onDraw])
  
    return { canvasRef, penDown, clear }
}