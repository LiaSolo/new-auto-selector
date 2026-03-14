import '../../scss/mainPage.scss';
import Faculty from "../../components/Faculty";
import {allFacs, back, socketUrl} from "../../config";
import {useEffect, useState} from "react";
import useWebSocket from "react-use-websocket";
import { getData, getRelease } from '../../services/api';
;

export default function SemiFinal() {
    const [released, setReleased] = useState([]);
    //const [loading, setLoading] = useState(true);
    const [semi, setSemi] = useState(null);

    // const fetchData = (rawData) => {
    //     setReleased(rawData.released)
    //     //setLoading(false)
    // }
    
    useEffect(() => {
        getData(setSemi);
        getRelease((data) => setReleased(data.released))
    }, []);

    // useEffect(() => {
    //     console.log('semi', semi)
    // }, [semi]);

    // useEffect(() => {
    //     console.log('released', released)

    // }, [released]);

    const { lastJsonMessage } = useWebSocket('ws://localhost:3003', {
        onOpen: () => console.log('Соединение установлено'),
        shouldReconnect: () => true,
    });

    // Ловим следующего показанного финалиста
    useEffect(() => {
        if (lastJsonMessage && lastJsonMessage.type === 'data-updated') {
        setReleased(lastJsonMessage.data.released)
        }
    }, [lastJsonMessage]);


    return (
            <div className="App">
                <div className="right">
                    <div className="video"/>
                    <div className="FacultyList">
                        {
                            semi && semi.parts.map((fac) =>
                                <Faculty 
                                    key={fac} 
                                    className={released.includes(fac) ? 'lowOpacity' : ''} 
                                    facultyInfo={allFacs[fac]}
                                />
                            )
                        }
                    </div>
                </div>
                    <div className="winnersList">
                        <h1>Финалисты</h1>
                        {
                            semi && semi.queue.map((fac) => {
                                const isReleased = released.includes(fac);
                                return (
                                    <Faculty 
                                        key={fac} 
                                        className={isReleased ? "winnerReleased" : "lowOpacity"} 
                                        facultyInfo={isReleased && allFacs[fac]}
                                    />
                                )
                            })
                        }
                    </div>
            </div>


    )
}
