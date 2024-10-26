import React from 'react';

import { inputStyles } from './input-field.styles';

interface LoginInputFieldProps {
    type: string;
    placeholder: string;
}

interface RegisterInputFieldProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const LoginInputField: React.FC<LoginInputFieldProps> = ({ type, placeholder }) => {
    return <input type={type} placeholder={placeholder} style={inputStyles} />;
};

const RegisterInputField: React.FC<RegisterInputFieldProps> = ({ type, placeholder, onChange, onBlur }) => {
    return <input type={type} placeholder={placeholder} style={inputStyles} onChange={onChange} onBlur={onBlur} />;
};

export { LoginInputField, RegisterInputField };
