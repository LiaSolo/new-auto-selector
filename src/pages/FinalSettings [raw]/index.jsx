import "./styles.css"
import React from 'react';
import {allFacs as allFaculties, back, backFinal, socketUrl} from "../../config";
import {useEffect, useState} from "react";
import axios from "axios";
import useWebSocket from 'react-use-websocket';

function FinalSettings() {
    const [inputs, setInputs] = useState(
        {
            data: new Map(),
            selected: new Set(),
            password: ""
        }
    );

    const [fetching, setFetching] = useState({
        error: "",
        loading: false,
        ok: ""
    })

    useEffect(() => {
        document.title = "Настройки авто-селектора для финала"
    }, []);
    
    const { sendMessage } = useWebSocket(socketUrl);

    const handleClickSendMessage = (event) => {
        setFetching((prev) => ({...prev, ok: "", error: "", loading: true}))
        event.preventDefault()
        sendMessage('111');
        setFetching((prev) => ({...prev, ok: "все оки"}));
        setFetching((prev) => ({...prev, loading: false}));
    }

    const handleCheckbox = (index) => {
        if (inputs.selected.has(index)) {
            inputs.selected.delete(index);
            inputs.data.delete(index);
            setInputs((prev) => ({...prev}))
        } else {
            inputs.selected.add(index);
            inputs.data.set(index, {faculty: index, added: 0, points: 0})
            setInputs((prev) => ({...prev}))
        }
    }


    const handleOnChangeText = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs((prev) => ({...prev, [name]: value}))
    }

    const handleOnChangePoints = (faculty) => {
        const prevFac = inputs.data.get(faculty)

        return (event) => {
            const name = event.target.name;
            const value = event.target.value;
            inputs.data.set(faculty, {...prevFac, [name]: value})
            setInputs((prev) => ({...prev}))
        }
    }


    const handleSubmit = (event) => {
        setFetching((prev) => ({...prev, ok: "", error: ""}))
        event.preventDefault()
        const dataBack = [...inputs.data.values()]
        const headers = {
            'Content-Type': 'application/json'
        };

        if (dataBack.length) {
            setFetching((prev) => ({...prev, loading: true}))
            axios.post(`${backFinal}/final/audience`, {
                password: inputs.password,
                data: dataBack,
            }, {headers})
                .then(() => {
                    setFetching((prev) => ({...prev, ok: "все оки"}))
                }).catch(error => {
                    setFetching((prev) => ({...prev, error: error}))
                }).finally(() => {
                    setFetching((prev) => ({...prev, loading: false}))
                })
        }

    }

    return (
        <div className="outer-container">
            <div className="outer-form">
                <form className="container-form">
                    <div className="settings-inside">
                        <p>Кто участвует вообще?</p>
                        {
                            Object.keys(allFaculties).map((faculty, index) =>
                                <div className="option" key={faculty}>
                                    <input
                                        type="checkbox"
                                        id={`custom-checkbox-${index}`}
                                        name={allFaculties[faculty].name}
                                        value={allFaculties[faculty].name}
                                        onChange={() => handleCheckbox(faculty, "faculty")}
                                    />
                                    <label htmlFor={`custom-checkbox-${index}`}>{allFaculties[faculty].name}</label>
                                </div>
                            )
                        }
                    </div>
                </form>
                <form className="container-form container-form-points" onSubmit={handleSubmit}>
                    <div className="settings-inside settings-points">
                        {
                            [...inputs.selected.values()].map((faculty, index) =>
                                <div className="optionPoints" key={faculty}>
                                    <span htmlFor={`custom-checkbox-${index}`}>{allFaculties[faculty].name}</span>
                                    <label>Баллы глашатаев</label>
                                    <input
                                        type="number"
                                        name={`points`}
                                        value={inputs.data.get(faculty).points}
                                        onChange={handleOnChangePoints(faculty)}
                                    />
                                    <label>Баллы зрителей</label>
                                    <input
                                        type="number"
                                        name={`added`}
                                        value={inputs.data.get(faculty).added}
                                        onChange={handleOnChangePoints(faculty)}
                                    />
                                </div>
                            )
                        }
                    </div>
                    <button type="submit" onSubmit={handleSubmit}>Решить судьбу унивидения</button>
                </form>
            </div>
            <div className="text-input">
                <label>Секретный пароль, чтобы ММ не взломал нас</label>
                <input type="text" onChange={handleOnChangeText} name="password" value={inputs.password}/>
            </div>

            <button onClick={handleClickSendMessage}>
                Продвинуть сюжет
            </button>
            {fetching.error && <p className="error">Что-то пошло не так - {fetching.error.toJSON().message}</p>}
            {fetching.ok &&  <p className="ok">{fetching.ok}</p>}
            {fetching.loading && <p className="loading">ща-ща я посылаю данные на сервак...</p>}
        </div>
    )
}

export default FinalSettings;
