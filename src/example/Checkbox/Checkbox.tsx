import React from 'react';
import './Checkbox.css';

interface Checkbox {
    label: string;
    checked: boolean;
    touched: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onFocus: React.FocusEventHandler<HTMLInputElement>;
    onBlur: React.FocusEventHandler<HTMLInputElement>;
    error?: string;
    warning?: string;
    asyncError?: string;
    asyncWarning?: string;
}

const Checkbox: React.FC<Checkbox> = ({
    label,
    checked,
    touched,
    onChange,
    onFocus,
    onBlur,
    error,
    warning,
    asyncError,
    asyncWarning,
}) => {
    return (
        <label className="field">
            <div className="label">{label}</div>
            <div className="touched">{touched ? 'field touched' : '-'}</div>
            <input
                className="input"
                type="checkbox"
                checked={checked}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
            />
            <ul className="messages">
                <li className="error">
                    <span className="msgLabel">async error:</span>
                    <span className="msgValue">{asyncError}</span>
                </li>
                <li className="error">
                    <span className="msgLabel">error:</span>
                    <span className="msgValue">{error}</span>
                </li>
                <li className="warning">
                    <span className="msgLabel">async warning:</span>
                    <span className="msgValue">{asyncWarning}</span>
                </li>
                <li className="warning">
                    <span className="msgLabel">warning:</span>
                    <span className="msgValue">{warning}</span>
                </li>
            </ul>
        </label>
    );
};

export default Checkbox;
