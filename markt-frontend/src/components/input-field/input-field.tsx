import React from 'react';

import { inputStyles } from './input-field.styles';

interface LoginInputFieldProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
}

const LoginInputField: React.FC<LoginInputFieldProps> = ({ type, placeholder, onChange, onBlur, value }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            style={inputStyles}
        />
    );
};

export { LoginInputField };