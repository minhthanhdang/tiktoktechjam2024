
import { useState, useRef } from 'react'

export const useDrag = () => {
  const [mouseDown, setMouseDown] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const start = useRef<null | Point>(null)

    const handler = (e: MouseEvent) => {
    
    if (!mouseDown) {
      if (start.current) {
        const currentPoint = mousePositionInCanvas(e)
        const value = {start: start.current, end: currentPoint}
        start.current = null
        return (value)
      }
    }

    const currentPoint = mousePositionInCanvas(e)

    if (!start.current) {
      start.current = currentPoint!
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
    start.current = null
  }

  // Add event listeners
  canvasRef.current?.addEventListener('mousemove', handler)
  window.addEventListener('mouseup', mouseUpHandler)

  // Remove event listeners
  return () => {
    canvasRef.current?.removeEventListener('mousemove', handler)
    window.removeEventListener('mouseup', mouseUpHandler)
  }
}