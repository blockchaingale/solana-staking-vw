import { Button, Icon } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import styles from '../../styles/CustomInput.module.css';
import { CustomLabelProps } from './types';
import { useCustomLabel } from './hooks';

export const CustomLabel = (props: CustomLabelProps) => {
    const { amount } = useCustomLabel(props);
    return (
        <div className={styles.customInputContainer}>
            <div className={styles.customInputLabels}>
                <label className={styles.customInputAmountLabel}>Claim Amount</label>
                <label className={styles.customInputAmountLabel}>{amount ? amount : '-'} TT</label>
            </div>
        </div>
    );
};
