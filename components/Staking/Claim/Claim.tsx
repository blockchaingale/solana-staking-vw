import React, { useContext, useState } from 'react';
import { CustomInput } from '../../CustomInput/CustomInput';
import scnIcon from '../../../icons/icon_scnSOL.png';
import styles from '../../../styles/Staking.module.css';
import Image from 'next/image';
import { CustomLabel } from '../../CustomLabel/CustomLabel';
import { CustomButton } from '../../CustomButton/CustomButton';
import { useClaim } from './hooks';

export const Claim = () => {
    const { onClick } = useClaim();
    return (
        <div>
                {/* <CustomLabel amount={fetchrewards}/>
                <div className={styles.stakeAmountContainer}>
                </div> */}
                <CustomButton fullWidth={true} onClick={onClick}>Claim Rewards</CustomButton>
        </div>
    );
};
