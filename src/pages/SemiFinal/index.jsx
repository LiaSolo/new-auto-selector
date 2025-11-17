import './styles.css';
import Faculty from "../../components/Faculty";
import {allFacs, back, socketUrl} from "../../config";
import {HotKeys} from "react-hotkeys";
import {useEffect, useRef, useState} from "react";
import FacultyWinner from "../../components/FacultyWinner [raw]";
//import axios from "axios";
//import useWebSocket from "react-use-websocket";
import {Link} from "react-router-dom";
import useWebSocket from "react-use-websocket";

// const keyMap = {
//     NEXT: "d"
// };

export default function SemiFinal() {
    const inputRef = useRef()
    // const [currFac, setFac] = useState(1000);
    // const [counter, setCounter] = useState(0);
    // const [state, setState] = useState({all: [], winners: [], iterator: undefined, winnersList: []});

    // const [participants, setParticipants] = useState([]);
    // const [winners, setWinners] = useState([]);
    // const [released, setReleased] = useState(new Set());
    const [semi, setSemi] = useState({ participants: [], winners: [], released: [] });
    
    useEffect(() => {
        fetch(`${back}/semi`).then(r => r.json()).then(setSemi);
    }, []);
    console.log(semi)
    // useEffect(() => {
    //     axios.get(`${back}/api/faculty`)
    //         .then(res => {
    //             setState(prev => ({...prev, all: res.data}))
    //         }).catch(error => {
    //         console.log(error)
    //     })
    //     axios.get(`${back}/api/winners`)
    //         .then(res => {
    //             setState(prev => ({
    //                 ...prev,
    //                 winners: res.data,
    //                 iterator: res.data.values(),
    //                 winnersList: [...Array(res.data.length).fill(undefined)]
    //             }))
    //         }).catch(error => {
    //         console.log(error)
    //     })

    //     inputRef.current.focus();
    // }, [])

    const { sendMessage } = useWebSocket(socketUrl);


    return (
            <div className="App" style={{
                backgroundImage: 'url(./assets/background.png)'
            }}>
                <div className="line">
                    <div className="container">
                        <div className="right">
                            <div className="video" style={{
                                backgroundImage: 'url(./assets/Logo.png)'
                            }} />
                            <div className="FacultyList">
                                {
                                    semi.participants.map((faculty) =>
                                        <Faculty key={faculty} className={semi.released.includes(faculty) ? "participant_released" : ""} facultyInfo={allFacs[faculty]}/>
                                    )
                                }
                            </div>
                        </div>
                        <div className="left">
                            <p className="title">Финалисты</p>
                            <Link to="/semi-settings" />
                            <div className="winnersList">
                                {
                                    semi.released.map((faculty) =>{
                                        const isReleased = semi.released.includes(faculty)
                                        //<FacultyWinner key={index} params={allFacs[faculty]}/>
                                    // победитель (драфт) // isWinner && !isReleased || className="winnerDraft"
                                    // победитель + выведен // isWinner && isReleased || className="winnerReleased"
                                        return <>
                                                {/* <FacultyWinner key={faculty} params={allFacs[faculty]}/> */}
                                                <Faculty key={faculty} className={isReleased ? "winner_released" : "draft"} facultyInfo={isReleased ? allFacs[faculty] : null}/>
                                                </>
                                     }
                                    )
                                    }
                            </div>
                        </div>
                    </div>
                </div>
            </div>


    )
}
