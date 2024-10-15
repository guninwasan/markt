import React from 'react';

import { inputStyles } from './input-field.styles';

interface InputFieldProps {
    type: string;
    placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({ type, placeholder }) => {
    return <input type={type} placeholder={placeholder} style={inputStyles} />;
};

export { InputField };