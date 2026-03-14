import './styles.scss';

export default function Button({
    onClick,
    type,
    disabled = false,
    children,
}) {
    return (
        <button 
            disabled={disabled} 
            className={type} 
            onClick={onClick}
        >
            {children}
        </button>
    )
};
