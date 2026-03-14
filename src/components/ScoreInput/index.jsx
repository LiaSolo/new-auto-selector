import './styles.scss'
import { useEffect, useRef, useState } from 'react';

export default function ScoreInput({curScore, setCurScore, label}) {
    const labelRef = useRef(null);
    const [labelWidth, setLabelWidth] = useState(0);
  
    useEffect(() => {
        if (labelRef.current) {
        const width = labelRef.current.offsetWidth;
        setLabelWidth(width);
        }
    }, [label]);

    return (
        <div className='scoreContainer'>
            <label ref={labelRef}>{label}</label>
            <input 
                type='number' 
                value={curScore}
                className='mask'
                style={{ '--label-width': `${labelWidth}px` }}
                onChange={(e) => setCurScore(e.target.value)}
            />
        </div>
            
    )

}