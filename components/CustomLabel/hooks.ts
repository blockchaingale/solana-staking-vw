import { useCallback } from 'react';
import { CustomLabelProps } from './types';

export const useCustomLabel = ({ icon, amount, balance, onChange, onMax }: CustomLabelProps) => {

    const handleOnChange = useCallback((ev) => {
        console.log(ev.currentTarget.value);
        const value = ev.currentTarget.value;
        onChange?.(isNaN(value) || Math.sign(value) < 0 ? 0 : value);
    }, [onChange]);

    const maxButtonProps = {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        color: '#ffffff',
        borderRadius: '8px',
    };

    return {
        icon, amount, balance, maxButtonProps, onChange: handleOnChange, onMax,
    };
};