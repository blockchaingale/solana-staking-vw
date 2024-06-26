import React from 'react';
import { CustomInput } from '../../CustomInput/CustomInput';
import solIcon from '../../../icons/icon_SOL.png';
import scnIcon from '../../../icons/icon_scnSOL.png';
import styles from '../../../styles/Staking.module.css';
import Image from 'next/image';
import { CustomButton } from '../../CustomButton/CustomButton';
import { useStake } from './hooks';

export const Stake = () => {
    const { publicKey, value, balance, stakedToken, onClick, onMax, onChange } = useStake();

    return (
        <div>
            <CustomInput icon={solIcon} amount={value} balance={`${balance.toFixed(2)} SOL`} onMax={onMax} onChange={onChange} />
            <div className={styles.stakeAmountContainer}>
            </div>
            <CustomButton fullWidth={true} onClick={onClick}>{publicKey ? 'Stake SOL' : 'Connect wallet'}</CustomButton>
        </div>
    );
};
