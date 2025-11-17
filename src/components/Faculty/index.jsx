import {useEffect, useState} from "react";
import cn from 'classnames';
import './styles.css'

function Faculty({facultyInfo, className}) {
    const [gradient, setGradient] = useState(false);
    useEffect(() => {
        if (className === 'winner_released') {
            setGradient(true);
            setTimeout(() => {
                setGradient(false);
            }, 2000)
        }
    }, [className, facultyInfo])


    return (
        <div className={cn("faculty_outer", className)}>
            <div className={`${gradient && "gradient2"}`}  style={gradient ? facultyInfo?.styles : {}}></div>
            <div className='faculty_inner'>
                {facultyInfo && <img src={`./assets/logos/${facultyInfo.logo}`} height="40px"/>}
                {facultyInfo?.name}
            </div>
           
        </div>
    );
}

export default Faculty;

// свойства
// внутри: лого, название, баллы [опционально] или ничего (заглушка)
// масштаб: 0.8 и 1 или 1 и 1.5 (пока примерно)
// опасити: 0.5 или 1

// поведение на полуфиналах
// изначально
// выведены в списочек факультетов (FacultyList) масштаб 0.8 и опасити 1
// списочек заглушек (Winners) масштаб 1
// кто выходит в финал
// в FacultyList становится опасити 0.5
// и появляется в списке Winners с лого и названием опасити 1

// состояния

// участник //  && !isReleased || className="participant"
// участник + выведен // && isReleased || className="participantReleased"

// победитель (драфт) // isWinner && !isReleased || className="winnerDraft"
// победитель + выведен // isWinner && isReleased || className="winnerReleased"

