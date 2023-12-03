import { useEffect } from 'react'

const AnimationWindow = ({ dfa, parentDiv, canvasRef }) => {

    const handleResize = () => {
        if (!parentDiv) {
            return
        }

        const canvas = canvasRef.current

        canvas.width = parentDiv.clientWidth
        canvas.height = parentDiv.clientHeight

        const ctx = canvas.getContext('2d')
        dfa.draw(ctx)
    }


    useEffect(() => {
        const canvas = canvasRef.current

        if (!canvas) {
            return
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => {
            window.removeEventListener("resize", handleResize)
        }

    }, [canvasRef.current, dfa])

    return (
        <canvas 
            width="960" height="720" ref={canvasRef}
        >
        </canvas>
    )
}

export default AnimationWindow