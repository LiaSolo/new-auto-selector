import '../../scss/settingsPage.scss';
import cn from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RadioButton from '../../components/radioButton';
import Button from '../../components/Button';
import { allFacs } from '../../config';
import { getData, getRelease, getSettings, saveData, saveRelease } from '../../services/api';
import { settingsFormatter } from '../../services/settingsFormatter';

const helpText = [
        'Раунд не выбран',
        'Сейчас 1 полуфинал',
        'Сейчас 2 полуфинал',
        'Сейчас финал'
    ];

export default function Release() {  
    const [selectedRound, setSelectedRound] = useState(0);
    const [queue, setQueue] = useState([]);
    const [released, setReleased] = useState([]);
    const [disableNext, setDisableNext] = useState(true);  
    
    const releaseFormatter = useCallback((rawSettings) => {
        //console.log(222, `I releaseFormatter: setSelectedRound ${rawSettings.round} & setReleased ${rawSettings.released}`)
        //console.log(rawSettings, selectedRound)
        setSelectedRound(rawSettings.round)
        setReleased(rawSettings.released)

        // if (rawSettings.round) {
        //     setSelectedRound(rawSettings.round)
        //     setReleased(rawSettings.released)
        // }
        
    }, [])

    const setData = useCallback((rawSettings) => {
        
        //console.log(rawSettings, selectedRound)
        const data = settingsFormatter(rawSettings, selectedRound)
        //console.log(data)
        //console.log('I setData with data', data, selectedRound)
        setQueue(data.queue);
        saveData(data);
    }, [selectedRound])

    useEffect(() => {
        console.log(released.length, queue.length, !selectedRound || released.length === queue.length)
        setDisableNext(!selectedRound || released.length === queue.length)
    }, [released, queue, selectedRound]);

    const syncReleaseData = useCallback((data) => {
        //console.log(data.round, selectedRound)
        //console.log(444, `I getData from server and check ${data.round} === ${selectedRound}`)
        if (data.round === selectedRound) {
            setQueue(data.queue);

            return;
        }

        // пересчитываем очередь
        getSettings(setData);
        setReleased([]);
        //console.log('I saveRelease with', selectedRound)
        saveRelease({
            released: [],
            round: selectedRound,
        });

    }, [selectedRound, setData])

    useEffect(() => {
        //console.log(111, 'I getRelease from server')
        getRelease(releaseFormatter);
    }, [releaseFormatter]);


    useEffect(() => {
        //console.log(333, 'I want to syncReleaseData, because selectedRound has changed', selectedRound)
        //console.log('syncReleaseData', selectedRound)
        selectedRound && getData(syncReleaseData);
    }, [selectedRound, syncReleaseData]);


    const handleNext = () => {
        //console.log(released.length, queue.length)
        if (released.length < queue.length) {
            const newReleased = [...released, queue[released.length]]
            //console.log(newReleased.length, queue.length)
            setReleased(newReleased)

            //console.log('I handleNext, saveRelease with released', newReleased, selectedRound)
            saveRelease({
                released: newReleased,
                round: selectedRound,
            })
        }
    }

    const handleResetLast = () => {
        const newReleased = [...released]
        newReleased.pop()
        setReleased(newReleased);
        saveRelease({
            released: newReleased,
            round: selectedRound,
        })
    }


    const handleResetAll = () => {
        setReleased([]);
        saveRelease({
            released: [],
            round: selectedRound,
        })
    }

    return (
        <div className='settingsPage'>
            <div className='header'>

                <span className='flexContainer'>
                    Че у нас сейчас?
                    <RadioButton 
                        label="1 пф"
                        isSelected={selectedRound === 1}
                        onChange={() => setSelectedRound(1)}
                    />
                    <RadioButton 
                        label="2 пф"
                        isSelected={selectedRound === 2}
                        onChange={() => setSelectedRound(2)}
                    />
                    <RadioButton 
                        label="финал"
                        isSelected={selectedRound === 3}
                        onChange={() => setSelectedRound(3)}
                    />
                </span>
            </div>
            <div className='queueHeader'>
                <span>ожидают</span>
                <span>выпущены</span>
            </div>
            <div className='releaseContent'>
               {queue.map((fac) => 
                   <div key={fac} className={cn('facContainer', released.includes(fac) && 'released')}>{allFacs[fac].name}</div>
                )} 
            </div>
            

            <span className='warning'>{helpText[selectedRound]}</span>
            <div className='footer'>
                <span className='flexContainer'>
                    <Link to="/settings">
                        <Button type={'primary'}>К настройкам</Button>
                    </Link>
                    <Button type={'dangerous'} onClick={handleNext} disabled={disableNext}>Продвинуть сюжет</Button>    
                </span>
                <span className='flexContainer'>
                    <Button type={'pickme'} onClick={handleResetLast} disabled={!released.length}>Вернуть последнего</Button>
                    <Button type={'secondary'} onClick={handleResetAll} disabled={!released.length}>Вернуть всех</Button>
                </span>
                
            </div>
            

        </div>
    )

};