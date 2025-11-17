import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { allFacs as allFaculties, back, socketUrl } from "../../config";
import './styles.css';

export default function SemiSettings() {
  //const [semi, setSemi] = useState({ participants: [], winners: [], released: [] });
  const [hideNonWinners, setHideNonWinners] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [participants, setParticipants] = useState(new Set());
  const [winners, setWinners] = useState(new Set());
  const [released, setReleased] = useState(new Set());  

  useEffect(() => {
      fetch(`${back}/semi`).then(r => r.json()).then(data => {
        setParticipants(new Set(data.participants));
        setWinners(new Set(data.winners));
        setReleased(new Set(data.released));
      });
  }, []);

  const { sendMessage } = useWebSocket(socketUrl);

  //  const handleClickSendMessage = (event) => {
  //       setFetching((prev) => ({...prev, ok: "", error: "", loading: true}))
  //       event.preventDefault()
  //       sendMessage('111');
  //       setFetching((prev) => ({...prev, ok: "все оки"}));
  //       setFetching((prev) => ({...prev, loading: false}));
  //   }

  const showMessage = (isSuccess, status, text) => {
    const type = isSuccess ? 'success' : 'error'
    setMessage({ type, status, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleParticipantChange = (facultyId) => {
    const newParticipants = new Set(participants);
    
    if (newParticipants.has(facultyId)) {
      // если убрали из участников, то из победителей тоже надо
      newParticipants.delete(facultyId);
      
      if (winners.has(facultyId)) {
        const newWinners = new Set(winners);
        newWinners.delete(facultyId);
        setWinners(newWinners);
      }
    } else {
      newParticipants.add(facultyId);
    }

    setParticipants(newParticipants);    
  };

  const handleWinnerChange = (facultyId) => {
    const newWinners = new Set(winners);

    if (newWinners.has(facultyId)) {
      newWinners.delete(facultyId);
    } else {
      newWinners.add(facultyId);
    }

    setWinners(newWinners);
  };

  const releaseFaculty = async (facultyId) => {
    if (!facultyId) {
      const waiting = Array.from(winners.difference(released))
      facultyId = waiting.shift()
    }

    const newReleased = new Set(released);
    newReleased.add(facultyId);
    setReleased(newReleased);

    const releasedArray = [...newReleased, ...Array(winners.size - released.size).fill(0)]
    const res = await fetch(`${back}/semi`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({released: releasedArray})
    });
  
    sendMessage('111');
    showMessage(res.ok, res.status, res.statusText);
  };

  // Отправить сразу все данные на сервер
  const submitData = async () => {
    const data = {
      participants: Array.from(participants),
      winners: Array.from(winners),
      released: [...released, ...Array(winners.size - released.size).fill(0)]
    };
  
    const res = await fetch(`${back}/semi`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    sendMessage('111');
    showMessage(res.ok, res.status, res.statusText);
  };

  const clearAll = async () => {
    setParticipants(new Set());
    setWinners(new Set());
    setReleased(new Set());
    const data = {
      participants: [],
      winners: [],
      released: []
    };

    const res = await fetch(`${back}/semi`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    showMessage(res.ok, res.status, res.statusText);
  };

  const clearReleased = async () => {
    setReleased(new Set());
    const res = await fetch(`${back}/semi`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({released: []})
    });

    showMessage(res.ok, res.status, res.statusText);
  };

  // Получить факультеты с непрошедшими или без
  const getDisplayWinners = () => {
    if (hideNonWinners) {
      return Array.from(winners)

    }
    return Array.from(participants);
  };

  return (
    <div className="app">
      <h1>Настройки авто-селектора</h1>

      <div className="columns-container">
        {/* Колонка 1: Кто участвует */}
        <div className="column">
          <h2>Кто участвует?</h2>
          <div className="faculty-list">
            {Object.keys(allFaculties).map(facultyId => (
              <div key={facultyId} className="faculty-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={participants.has(facultyId)}
                    onChange={() => handleParticipantChange(facultyId)}
                  />
                  <span className="checkmark"></span>
                  {allFaculties[facultyId].name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Колонка 2: Кто проходит дальше */}
        <div className="column">
          <div>
            <h2>Кто проходит дальше?</h2>
            <label>
              <input
                type="checkbox"
                checked={hideNonWinners}
                onChange={(e) => setHideNonWinners(e.target.checked)}
              />
              Показать очередь
            </label>
          </div>
          

          <div className="faculty-list">
            {getDisplayWinners().map((facultyId, index) => (
              <div key={facultyId} className="faculty-item winner-item">
                <label>
                  {hideNonWinners ? index + 1 : 
                  <input
                    type="checkbox"
                    checked={winners.has(facultyId)}
                    onChange={() => handleWinnerChange(facultyId)}
                    disabled={released.has(facultyId)}
                  />}
                  
                  <span className={released.has(facultyId) ? 'released' : ''}>
                    {allFaculties[facultyId].name}
                  </span>
                </label>
                
                {winners.has(facultyId) && (
                  <button
                    onClick={() => releaseFaculty(facultyId)}
                    disabled={released.has(facultyId)}
                    className="release-btn mini-btn"
                  >
                    Выпустить
                  </button>
                )}
              </div>
            ))}
            
           
          </div>
          <div className="control-buttons">
               <button onClick={submitData} className="submit-btn">
                Решить судьбу унивидения
              </button>
              <button onClick={() => releaseFaculty(0)} className="release-btn large-btn">
                Продвинуть сюжет
              </button>
            </div>
        </div>
      </div>

      <div className="stats">
        <p>Участников: {participants.size} | Проходят: {winners.size} | Выпущено: {released.size}</p>
      </div>
      <div className="control-buttons">
        <button onClick={clearReleased} className="clear-btn">
          Очистить очередь
        </button>
        <button onClick={clearAll} className="clear-btn danger">
          Очистить всё
        </button>
        {message.text && (
        <div className={`message ${message.type}`}>
          {message.status} {message.text}
        </div>
      )}
      </div>
      
    </div>
  );
}
