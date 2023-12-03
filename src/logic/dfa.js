import { Arrow, CurvedArrow, LoopedArrow } from "./arrow"

export default class DFA {
    constructor(states, alphabet, transitions, startState, acceptingStates) {
        this.states = states
        this.alphabet = alphabet
        this.transitions = transitions
        this.startState = startState
        this.acceptingStates = acceptingStates

        this.inputString = ""
        this.inputStringIndex = null
        this.currentState = startState
        this.accepts = "still processing"

        this.neighbors = []
        this.findNeighbors()

        this.arrows = {}
        this.lastArrowUsed = null
        this.createArrows()

        this.valid = this.verify()
    }

    verify() {
        // check that all parts of DFA were given
        if (!this.states || !this.alphabet || !this.transitions ||
            !this.startState || !this.acceptingStates) {
            
            return false
        }

        // check that q0 is in Q
        if (!Object.keys(this.states).includes(this.startState)) {
            return false
        }

        // check that F is a subset of Q
        this.acceptingStates.forEach((acceptingState) => {
            if (!Object.keys(this.states).includes(acceptingState)) {
                return false
            }
        })

        const states = [...Object.keys(this.states)]
        for (const [stateFrom, row] of Object.entries(this.transitions)) {
            const alphabet = [...this.alphabet]

            for (const character of Object.keys(row)) {
                const charIndex = alphabet.indexOf(character)
                const stateIndex = states.indexOf(stateFrom)
                
                // check that each transition uses chars in the alphabet
                if (charIndex == -1) {
                    return false
                }

                alphabet.splice(charIndex, 1)
                states.splice(stateIndex, 1)
            }

            // check that state has a transition for each char
            if (alphabet.length != 0) {
                return false
            }
        }
        
        // check that every state has transitions
        if (states.length != 0) {
            return false
        }

        // all checks passed
        return true
    }

    enterString(string) {
        for (const char of string) {
            if (!this.alphabet.includes(char)) {
                return false
            }
        }

        this.inputString = string
        this.inputStringIndex = 0
        this.currentState = this.startState
        this.accepts = "still processing"
        this.lastArrowUsed = null

        return true
    }

    // Processes one character of the input string. Returns true if the string is
    // still being processed, false otherwise
    processString() {
        if (this.inputStringIndex == this.inputString.length && this.inputString.length != 0) {
            return false
        }

        if (this.inputString.length != 0) {
            const character = this.inputString[this.inputStringIndex]
            const nextState = this.transitions[this.currentState][character]
            const prevState = this.currentState

            this.currentState = nextState
            this.inputStringIndex++

            this.lastArrowUsed = this.arrows[prevState + "-" + character]
        }
        
        if (this.inputStringIndex == this.inputString.length) {
            this.accepts = (this.acceptingStates.includes(this.currentState)).toString()
            return false
        }

        return true
    }

    findNeighbors() {
        this.neighbors = []

        for (const [stateFrom, row] of Object.entries(this.transitions)) {
            for (const stateTo of Object.values(row)) {
                if (!this.neighbors.includes(stateTo + "-" + stateFrom)) {
                    this.neighbors.push(stateTo + "-" + stateFrom)
                }
            }
        }
    }

    createArrows() {
        const radius = 30

        const startState = this.states[this.startState]

        if (startState) {
            var start = {x: startState.x - 100, y: startState.y}
            var end = {x: startState.x - radius, y: startState.y}
            this.arrows['start'] = new Arrow(start, end, "")
        }

        for (const [stateFrom, row] of Object.entries(this.transitions)) {

            const existingTransitions = {}

            for (const [char, stateTo] of Object.entries(row)) {

                const transitionEncoding = stateFrom + "-" + char

                if (Object.keys(existingTransitions).includes(stateTo)) {
                    const arrow = existingTransitions[stateTo]
                    arrow.chars += ", " + char
                    this.arrows[transitionEncoding] = arrow
                    continue
                }

                var start = this.states[stateFrom]
                var end = this.states[stateTo]
                
                if (stateFrom == stateTo) {
                    const angleOffset = Math.PI / 10

                    start = {
                        x: start.x - radius * Math.cos(Math.PI / 2 - angleOffset),
                        y: start.y - radius * Math.sin(Math.PI / 2 - angleOffset)
                    }
                    end = {
                        x: end.x - radius * Math.cos(Math.PI / 2 + angleOffset),
                        y: end.y - radius * Math.sin(Math.PI / 2 + angleOffset)
                    }

                    const newArrow = new LoopedArrow(start, end, char)
                    // this.arrows.push(newArrow)
                    this.arrows[transitionEncoding] = newArrow
                    existingTransitions[stateTo] = newArrow

                } else if (this.neighbors.includes(stateFrom + "-" + stateTo)) {
                    const angleOffset = Math.PI / 10
                    const angle = Math.atan2(start.y - end.y, start.x - end.x)

                    start = {
                        x: start.x - radius * Math.cos(angle + angleOffset),
                        y: start.y - radius * Math.sin(angle + angleOffset)
                    }
                    end = {
                        x: end.x - radius * Math.cos(angle + Math.PI - angleOffset),
                        y: end.y - radius * Math.sin(angle + Math.PI - angleOffset)
                    }

                    const newArrow = new CurvedArrow(start, end, char)
                    // this.arrows.push(newArrow)
                    this.arrows[transitionEncoding] = newArrow
                    existingTransitions[stateTo] = newArrow

                } else {
                    const angle = Math.atan2(start.y - end.y, start.x - end.x)

                    start = {
                        x: start.x - radius * Math.cos(angle), 
                        y: start.y - radius * Math.sin(angle)
                    }
                    end = {
                        x: end.x + radius * Math.cos(angle),
                        y: end.y + radius * Math.sin(angle)
                    }

                    const newArrow = new Arrow(start, end, char)
                    // this.arrows.push(newArrow)
                    this.arrows[transitionEncoding] = newArrow
                    existingTransitions[stateTo] = newArrow
                }
            }
        }
    }

    draw(ctx) {
        const states = Object.values(this.states)
        var average = {x: 0, y: 0}

        Object.values(this.states).forEach((state) => {
            average.x += state.x
            average.y += state.y
        })

        average = {x: average.x / states.length, y: average.y / states.length}

        const offset = {
            x: ctx.canvas.clientWidth / 2 - average.x,
            y: ctx.canvas.clientHeight / 2 - average.y + 50
        }

        ctx.fillStyle = 'white'
        ctx.beginPath();
        ctx.rect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        ctx.fill();

        const radius = 30

        for (const [name, position] of Object.entries(this.states)) {
            ctx.fillStyle = 'darkgray'
            ctx.strokeStyle = name == this.currentState ? 'deepskyblue' : 'black'
            ctx.lineWidth = 4
            ctx.beginPath()
            ctx.arc(position.x + offset.x, position.y + offset.y, radius, 0, 2 * Math.PI, false)
            ctx.fill()
            ctx.stroke()
            ctx.textAlign = "center"
            ctx.fillStyle = 'black'
            ctx.font = "24px Arial"
            ctx.fillText(name, position.x + offset.x, position.y + offset.y + 7)

            if (this.acceptingStates.includes(name)) {
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.arc(
                    position.x + offset.x, position.y + offset.y, 
                    radius - 7, 0, 2 * Math.PI, false)
                ctx.stroke()
            }
        }

        Object.values(this.arrows).forEach((arrow) => {
            arrow.draw(ctx, this.lastArrowUsed == arrow ? "deepskyblue" : "black", offset)
        })
    }
}