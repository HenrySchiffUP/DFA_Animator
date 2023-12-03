import { boundAngle } from "./functions"

export class Arrow {

    static headAngle = 7/8 * Math.PI

    constructor(start, end, char) {
        this.start = start
        this.end = end
        this.chars = char

        this.angle = Math.atan2(start.y - end.y, start.x - end.x)
        this.midpoint = {
            x: (end.x + start.x) / 2, 
            y: (end.y + start.y) / 2
        }
        this.charsPosition = {
            x: this.midpoint.x + 20 * Math.cos(this.angle - Math.PI / 2),
            y: this.midpoint.y + 20 * Math.sin(this.angle - Math.PI / 2) + 5
        }
    }

    draw(ctx, color, offset) {
        const headLength = 20
        const start = {x: this.start.x + offset.x, y: this.start.y + offset.y}
        const end = {x: this.end.x + offset.x, y: this.end.y + offset.y}

        // draw arrow line
        ctx.lineWidth = 3
        ctx.strokeStyle = color
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()

        // rotate characters but prevent them from being unreadable
        var charAngle = boundAngle(this.angle)
        if (charAngle > Math.PI / 2 && charAngle < Math.PI * 3 / 2) {
            charAngle += Math.PI
        }
        
        ctx.fillStyle = color
        ctx.save()
        ctx.translate(this.charsPosition.x + offset.x, this.charsPosition.y + offset.y)
        ctx.rotate(charAngle)
        ctx.textAlign = 'center'
        ctx.fillText(this.chars, 0, 10 / 2)
        ctx.restore()
        
        // draw arrow head
        ctx.strokeStyle = color
        ctx.beginPath()
        ctx.moveTo(end.x, end.y)
        ctx.lineTo(
            end.x - headLength * Math.cos(this.angle - Arrow.headAngle),
            end.y - headLength * Math.sin(this.angle - Arrow.headAngle))
        ctx.moveTo(end.x, end.y)
        ctx.lineTo(
            end.x - headLength * Math.cos(this.angle + Arrow.headAngle),
            end.y - headLength * Math.sin(this.angle + Arrow.headAngle))
        ctx.moveTo(end.x, end.y)
        ctx.stroke()
    }
}

export class CurvedArrow extends Arrow {
    constructor(start, end, char) {
        super(start, end, char)
        
        this.charsPosition = {
            x: this.midpoint.x + 45 * Math.cos(this.angle - Math.PI / 2),
            y: this.midpoint.y + 50 * Math.sin(this.angle - Math.PI / 2)
        }
    }

    draw(ctx, color, offset) {
        const headLength = 20
        const headOffset = -1/8 * Math.PI
        const curveWidth = 30
        const curveHeight = 100
        const start = {x: this.start.x + offset.x, y: this.start.y + offset.y}
        const end = {x: this.end.x + offset.x, y: this.end.y + offset.y}

        const controlPoint1 = {
            x: (start.x - curveHeight * Math.cos(this.angle)) 
                + curveWidth * Math.cos(this.angle - Math.PI / 2), 
            y: (start.y - curveHeight * Math.sin(this.angle)) 
                + curveWidth * Math.sin(this.angle - Math.PI / 2)
        }
        const controlPoint2 = {
            x: (end.x + curveHeight * Math.cos(this.angle))
                + curveWidth * Math.cos(this.angle - Math.PI / 2), 
            y: (end.y + curveHeight * Math.sin(this.angle))
                + curveWidth * Math.sin(this.angle - Math.PI / 2)
        }

        // ctx.strokeStyle = 'red'
        // ctx.beginPath()
        // ctx.arc(controlPoint1.x + offset.x, controlPoint1.y + offset.y, 10, 0, 2 * Math.PI, false)
        // ctx.stroke()
        // ctx.strokeStyle = 'orange'
        // ctx.beginPath()
        // ctx.arc(controlPoint2.x + offset.x, controlPoint2.y + offset.y, 10, 0, 2 * Math.PI, false)
        // ctx.stroke()

        ctx.lineWidth = 3
        ctx.strokeStyle = color
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.bezierCurveTo(
            controlPoint1.x, controlPoint1.y, 
            controlPoint2.x, controlPoint2.y,
            end.x, end.y)
        ctx.stroke()

        // rotate characters but prevent them from being unreadable
        var charAngle = boundAngle(this.angle)
        if (charAngle > Math.PI / 2 && charAngle < Math.PI * 3 / 2) {
            charAngle += Math.PI
        }
        
        ctx.fillStyle = color
        ctx.save()
        ctx.translate(this.charsPosition.x + offset.x, this.charsPosition.y + offset.y)
        ctx.rotate(charAngle)
        ctx.textAlign = 'center'
        ctx.fillText(this.chars, 0, 10 / 2)
        ctx.restore()

        ctx.strokeStyle = color
        ctx.beginPath()
        ctx.moveTo(end.x, end.y)
        ctx.lineTo(
            end.x - headLength * Math.cos(this.angle - Arrow.headAngle + headOffset),
            end.y - headLength * Math.sin(this.angle - Arrow.headAngle + headOffset))
        ctx.moveTo(end.x, end.y)
        ctx.lineTo(
            end.x - headLength * Math.cos(this.angle + Arrow.headAngle + headOffset),
            end.y - headLength * Math.sin(this.angle + Arrow.headAngle + headOffset))
        ctx.moveTo(end.x, end.y)
        ctx.stroke()
    }
}

export class LoopedArrow extends Arrow {

    constructor(start, end, char) {
        super(start, end, char)
        
        this.charsPosition = {
            x: this.midpoint.x,
            y: this.midpoint.y - 110
        }
    }

    draw(ctx, color, offset) {
        const headLength = 20
        const headOffset = 1.725 * Math.PI
        const start = {x: this.start.x + offset.x, y: this.start.y + offset.y}
        const end = {x: this.end.x + offset.x, y: this.end.y + offset.y}

        const controlPoint1 = {
            x: this.midpoint.x - 120 + offset.x, y: this.midpoint.y - 120 + offset.y
        }
        const controlPoint2 = {
            x: this.midpoint.x + 120 + offset.x, y: this.midpoint.y - 120 + offset.y
        }

        ctx.lineWidth = 3
        ctx.strokeStyle = color
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.bezierCurveTo(
            controlPoint1.x, controlPoint1.y, 
            controlPoint2.x, controlPoint2.y,
            end.x, end.y)
        ctx.stroke()
        
        // ctx.strokeStyle = 'red'
        // ctx.beginPath()
        // ctx.arc(controlPoint1.x, controlPoint1.y, 10, 0, 2 * Math.PI, false)
        // ctx.stroke()
        // ctx.beginPath()
        // ctx.arc(controlPoint2.x, controlPoint2.y, 10, 0, 2 * Math.PI, false)
        // ctx.stroke()

        ctx.textAlign = "center"
        ctx.fillStyle = color
        ctx.font = "24px Arial"
        ctx.fillText(
            this.chars, this.charsPosition.x + offset.x, 
            this.charsPosition.y + offset.y)
        
        ctx.strokeStyle = color
        ctx.beginPath()
        ctx.moveTo(end.x, end.y)
        ctx.lineTo(
            end.x - headLength * Math.cos(headOffset - Arrow.headAngle),
            end.y - headLength * Math.sin(headOffset - Arrow.headAngle))
        ctx.moveTo(end.x, end.y)
        ctx.lineTo(
            end.x - headLength * Math.cos(headOffset + Arrow.headAngle),
            end.y - headLength * Math.sin(headOffset + Arrow.headAngle))
        ctx.moveTo(end.x, end.y)
        ctx.stroke()
    }
}