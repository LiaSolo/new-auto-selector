import cn from 'classnames'

export default function Toggle(curOption, setCurOption, option1, option2) {

    const handleSwitch = () => {
        // curOption:
        // true === 1 semi
        // false === 2 semi
        setCurOption(!curOption);
    }

    return (
        <div className='toggleContainer' onClick={handleSwitch}>
            <div className={cn('toggleThumb', curOption ? 'toRight' : 'toLeft')}>
                {curOption ? option1 : option2}
            </div>
        </div>
    )
}