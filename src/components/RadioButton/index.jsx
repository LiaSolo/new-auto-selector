import './styles.scss';

export default function RadioButton({
    label,
    isSelected,
    onChange,
}) {
    return (
        <label className='radioButton'>
            <input
                type='radio'
                checked={isSelected}
                onChange={onChange}
                />
            {label}       
        </label>
    )
};
