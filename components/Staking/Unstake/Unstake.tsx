import React, { useContext, useState } from 'react';
import { CustomInput } from '../../CustomInput/CustomInput';
import scnIcon from '../../../icons/icon_scnSOL.png';
import styles from '../../../styles/Staking.module.css';
import { SelectableOptionGroup } from '../../SelectableOptionGroup/SelectableOptionGroup';
import { CustomButton } from '../../CustomButton/CustomButton';
import { unstakeOptions } from './types';
import { SelectableOption } from '../../SelectableOptionGroup/SelectableOption/SelectableOption';
import { StakingContext } from '../../../contexts/StakingContext';
import Image from 'next/image';
import { useUnstake } from './hooks';

export const Unstake = () => {
    //const { stakedToken } = useContext(StakingContext);
    const { publicKey, fetchvalue, value, balance, stakedToken, onClick, onMax, onChange } = useUnstake();
    return (
        <div>
            <CustomInput icon={scnIcon} amount={value} balance={`${balance.toFixed(2)} SOL`} onChange={onChange} onMax={onMax} />
            <div className={styles.stakeAmountContainer}>
                {/* <SelectableOptionGroup selectedValue={selected} onChange={setSelected}>
                    {unstakeOptions.map((o) => <SelectableOption key={o.id} {...o} />)}
                </SelectableOptionGroup> */}
                <label>Stake Amount:</label>
                <div className={styles.stakeAmount}>
                    <label>{fetchvalue} {stakedToken}</label>
                    <Image src={scnIcon} alt={stakedToken} width={26} height={26} />
                </div>
            </div>
            <CustomButton fullWidth={true} onClick={onClick}>Unstake {stakedToken}</CustomButton>
        </div>
    );
};
