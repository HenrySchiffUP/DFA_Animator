import { useEffect, useRef, useState } from "react"
import DFA from "../logic/dfa"
import AnimationWindow from "../components/AnimationWindow"

import { FaForwardStep } from "react-icons/fa6"
import { FaForwardFast } from "react-icons/fa6"
import { VscDebugRestart } from "react-icons/vsc"

const examples = []
for (let i = 0; i < 10; i++) {
    examples.push(require(`../examples/example${i}.json`))
}

const AnimatorPage = () => {
    const [inputString, setInputString] = useState("")
    const [inputStart, setInputStart] = useState("")
    const [inputMiddle, setInputMiddle] = useState("")
    const [inputEnd, setInputEnd] = useState("")
    const [validString, setValidString] = useState(true)

    const [language, setLanguage] = useState("")
    const [accepts, setAccepts] = useState("still processing")
    const [dfa, setDfa] = useState(null)
    const [validDfa, setValidDfa] = useState(null)
    const [auto, setAuto] = useState(false)

    const canvasRef = useRef(null)
    const parentDivRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        loadExample(0)
    }, [])

    const loadExample = (index) => {
        if (auto) {
            return
        }

        const {
            states, alphabet, transitions, startState, acceptingStates, language
        } = examples[index]
        
        setLanguage(language)

        const newDfa = new DFA(states, alphabet, transitions, startState, acceptingStates)
        setDfa(newDfa)
        setValidDfa(newDfa.valid)
        setAccepts("still processing")

        newDfa.enterString("")
        setInputString("")

        if (inputRef.current) {
            inputRef.current.value = ""
        }
    }

    const handleProcessButton = () => {
        if (auto || !validDfa || !validString) {
            return
        }

        dfa.processString()
        update()
    }

    const handleAutoButton = () => {
        if (auto || !validDfa || !validString) {
            return
        }

        setAuto(true)

        const id = setInterval(() => {
            const running = dfa.processString()
            update()

            if (!running) {
                clearInterval(id)
                setAuto(false)
            }
        }, 500)
    }

    const handleResetButton = () => {
        dfa.enterString(dfa.inputString)
        update()
    }

    const handleInput = (event) => {
        setInputString(event.target.value)
        const valid = dfa.enterString(event.target.value)
        setValidString(valid)
        update()
    }

    const update = () => {
        const ctx = canvasRef.current.getContext('2d')
        dfa.draw(ctx)

        setAccepts(dfa.accepts)

        if (dfa.inputStringIndex == 0) {
            setInputStart(dfa.inputString)
            setInputMiddle("")
            setInputEnd("")
            return
        }
        
        setInputStart(dfa.inputString.slice(0, dfa.inputStringIndex - 1))
        setInputMiddle(dfa.inputString.slice(dfa.inputStringIndex - 1, dfa.inputStringIndex))
        setInputEnd(dfa.inputString.slice(dfa.inputStringIndex, dfa.inputString.length))
    }

    return (
        <div className="page">
            <div className="top">
                <div className="dropdown">
                    <button className="dropbtn" disabled={auto}>examples</button>
                    <div className="dropdown-content">
                        {examples.map((example, index) => (
                            <div 
                                key={index}
                                onClick={() => loadExample(index)}>
                                {"example " + index}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="info">
                    {validString && validDfa ? <>
                    <h3 className="string">
                        <span className="label">input string: </span>
                        {inputString
                        ? <>
                            {inputStart}
                            <span style={{color: "deepskyblue", textDecoration: "underline"}}>
                                {inputMiddle}
                            </span>
                            {inputEnd}
                        </>
                        : "ε"}
                    </h3>
                    </> : <></>}
                    <h3>
                        {validDfa 
                        ? <> {validString 
                            ? <>accepts: <span className={accepts}>{accepts}</span></>
                            : <span className="false">invalid string</span>}</> 
                        : <span className="false">invalid dfa</span>}
                    </h3>
                </div>
                <button className="dropbtn" style={{opacity: "0"}}>Dropdown</button>
            </div>
            <h3 className="language">{language}</h3>
            <div ref={parentDivRef} className="canvasWrapper">
                {dfa ? 
                    <AnimationWindow 
                        dfa={dfa} 
                        parentDiv={parentDivRef.current}
                        canvasRef={canvasRef}>
                    </AnimationWindow> 
                : <div></div>}
            </div>
            <div className="bottom">
                <input 
                    ref={inputRef}
                    type="text" 
                    onChange={handleInput}
                    disabled={auto}
                    placeholder="enter a string">
                </input>
                <button 
                    className={
                        validString && validDfa && !auto  && accepts == "still processing"
                        ? "iconButton" : "iconButton disabled"}
                    onClick={handleProcessButton}
                    title="Animate One Step">
                    <FaForwardStep fontSize="20px" color="white"/>
                </button>
                <button 
                    className={
                        validString && validDfa && !auto && accepts == "still processing"
                        ? "iconButton" : "iconButton disabled"}
                    onClick={handleAutoButton}
                    title="Auto-Animate">
                    <FaForwardFast fontSize="20px" color="white"/>
                </button>
                <button
                    className={
                        validString && validDfa && !auto  
                        ? "iconButton" : "iconButton disabled"}
                    onClick={handleResetButton}
                    title="Reset String">
                    <VscDebugRestart fontSize="26px" color="white"/>
                </button>
            </div>
        </div>
    )
}

export default AnimatorPage