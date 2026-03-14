import {useEffect, useState} from "react";
import cn from 'classnames';
import './styles.scss'


// facultyInfo: logo, name, styles (config.js)
export default function Faculty({facultyInfo, className, points}) {
    const [gradient, setGradient] = useState(false);
    const [showInfo, setShowInfo] = useState(className !== 'winnerReleased');
    
    useEffect(() => {
        if (!facultyInfo) {
            setShowInfo(false);
            return;
        }
        
        if (className === 'winnerReleased') {
            setGradient(true);
            setTimeout(() => {
                setShowInfo(true);
            }, 1000)
            setTimeout(() => {
                setGradient(false);
            }, 2000)
        }
    }, [className, facultyInfo])

    //useEffect(() => console.log(showInfo), [showInfo])
    //console.log(points, className)

    return (
        <div className={cn("faculty", className)}>
            {showInfo && facultyInfo && 
                <>
                    <img src={`./assets/logos/${facultyInfo.logo}`}/>
                    {facultyInfo.name}
                    <span className='points'>{points}</span>
                </>
            }
            {gradient && <div className="gradient"  style={facultyInfo.styles}/>}         
        </div>
    );
}
