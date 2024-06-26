import React, { useEffect, useState } from 'react';
import { useStaking } from './hooks';
import { StakingTab, stakingTabs } from './types';
import { Stake } from './Stake/Stake';
import { Unstake } from './Unstake/Unstake';
import styles from '../../styles/Staking.module.css';
import { StakingHelp } from '../StakingHelp/StakingHelp';
import { CustomTabs } from '../CustomTabs/CustomTabs';
import { Typography } from '@mui/material';
import { useHome } from './hook';
import { AdminPanel } from './AdminPanel/AdminPanel';
import { Claim } from './Claim/Claim';
// export interface CustomProps {
//     selectedTab: string
// }
export const Staking = () => {
    const { selectedTab, handleSelectedTab, depositFee, stakedToken } = useStaking();
    const { IsAdmin } = useHome();
    const [Admin, setAdmin] = useState(false);
    useEffect(()=>{
        const fetch = async () => {
            const t = await IsAdmin()
            console.log(t)
            if(t === undefined)return;
            setAdmin(t)
        }
        fetch()
    }, [IsAdmin])
    return (
        <>
            {Admin
            ?<>
                <Typography fontSize={40} textAlign="center" fontWeight={700}>
                    Admin Panel<br/>
                    {/* Admin Panel<br />{props.apr.toFixed(2)}% APY */}
                </Typography>
                <AdminPanel />
            </>
            :<>
                <Typography fontSize={40} textAlign="center" fontWeight={700}>
                    Stake SOL and Earn<br />
                    {/* {props.apr.toFixed(2)}% APY */}
                </Typography>   
                <div className={styles.staking}>
                
                    <CustomTabs selectedTab={selectedTab} onChange={handleSelectedTab} />
                    {selectedTab === StakingTab.Stake ? <Stake /> : selectedTab === StakingTab.Unstake ? <Unstake /> : <Claim/>}
                    {/* <StakingHelp /> */}
                </div>
            </>
            }
            {/* <div className={styles.spaceBetween}>
                <label>Exchange rate:</label>
                <label>1 SOL = 0.976 {stakedToken}</label>
            </div>
            {selectedTab === StakingTab.Stake
                ? (
                    <div className={styles.spaceBetween}>
                        <label>Deposit fees:</label>
                        <label>{depositFee}%</label>
                    </div>
                )
                : null} */}
        </>
    );
};
