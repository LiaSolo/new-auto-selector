import { useState } from 'react';
import Toggle from '../Toggle';
import './styles.css';

export default function FacultySettings(
    facultyName, 
    isParticipant = true, 
    whichSemi = 1, 
    isFinal = false,
    scoreJudge = 0,
    scoreAudience = 0,
) {
    const [curToggleOption, setCurToggleOption] = useState(whichSemi === 1)
    const [curJudgeScore, setCurJudgeScore] = useState(scoreJudge);
    const [curAudienceScore, setCurAudienceScore] = useState(scoreAudience);
    const [curIsParticipant, setCurIsParticipant] = useState(isParticipant);
    const [curIsFinal, setCurIsFinal] = useState(isFinal);

    return (
        <div className='row'>
            <input 
                type='checkbox' 
                checked={curIsParticipant}
                onChange={(e) => setCurIsParticipant(e.target.checked)}
            />
            <div className='baseContainer'>{facultyName}</div>

            {curIsParticipant && 
                <>
                    <Toggle 
                        curOption={curToggleOption} 
                        setCurOption={setCurToggleOption} 
                        option1='1пф' 
                        option2='2пф'
                    />
                    <input 
                        type='checkbox' 
                        checked={curIsFinal}
                        onChange={(e) => setCurIsFinal(e.target.checked)}
                    />

                    {curIsFinal && 
                        <div className='finalSettings'>
                            <input type='number' onChange={(e) => setCurJudgeScore(e.target.value)}>{curJudgeScore}</input>
                            <input type='number' onChange={(e) => setCurAudienceScore(e.target.value)}>{curAudienceScore}</input>
                        </div>
                    }
                </> 
            }
            

        </div>
    )

};