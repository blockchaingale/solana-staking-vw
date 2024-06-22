import React, { useEffect, useState } from 'react';
import { CustomInput } from '../../CustomInput/CustomInput';
import solIcon from '../../../icons/icon_SOL.png';
import scnIcon from '../../../icons/icon_scnSOL.png';
import styles from '../../../styles/Staking.module.css';
import Image from 'next/image';
import { CustomButton } from '../../CustomButton/CustomButton';
import { useAdmin } from './hooks';
import { CustomFee } from '../../CustomInput/CustomFee';
import { CustomWithdraw } from '../../CustomInput/CustomWithdraw';

export const AdminPanel = () => {
    const { getBalance, onWithdraw, onSetfee, Fee} = useAdmin()
    const [feetotal, setFeetotal] = useState('');
    const [fee, setFee] = useState(0);
    useEffect(()=>{
        const fetch = async () => {
            const t = await getBalance()
            if(t === undefined)return;
            const t1 = await Fee()
            setFeetotal(t)
            setFee(t1)
        }
        fetch()
    }, [getBalance, Fee])
    const onChange = (value: number) => {
        setFee(value);
    };    
    const onMax = () => {
        setFee(100);
    }
    return (
        <div>
            <CustomWithdraw balance={feetotal===undefined?'-':feetotal} icon={solIcon}/>
            <div className={styles.stakeAmountContainer}>
            </div>
            <CustomButton fullWidth={true} onClick={onWithdraw}>{'Widthdraw fees'}</CustomButton>
            <div className={styles.stakeAmountContainer}>
            </div>
            <CustomFee icon={solIcon} amount={fee} onChange={onChange} onMax={onMax}/>
            <div className={styles.stakeAmountContainer}>
            </div>
            <CustomButton fullWidth={true} onClick={(e)=> {onSetfee(fee)}}>{'Set fee percent'}</CustomButton>
        </div>
    );
};
