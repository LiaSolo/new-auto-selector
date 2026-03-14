import cn from 'classnames'
import './styles.scss'

export default function Toggle({
    curOption, 
    setCurOption, 
    option1, 
    option2,
    className
}) {

    const handleSwitch = () => {
        // curOption:
        // true <=> 1 semi right
        // false <=> 2 semi left
        setCurOption(!curOption);
    }

    return (
        <div className={cn('toggleContainer', className)} onClick={handleSwitch}>
            <div className={cn('toggleThumb', curOption ? 'toRight' : 'toLeft')}>
                {curOption ? option1 : option2}
            </div>
        </div>
    )
}