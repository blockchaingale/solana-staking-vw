import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, PublicKey, sendAndConfirmRawTransaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { StakingContext } from "../../../contexts/StakingContext";
import { ApiMessage, calculateStakeEntryPda } from "../../../pages/api/api";
import { web3 } from "@project-serum/anchor";
import { TextareaAutosize } from "@mui/material";
// import { web3 } from "@project-serum/anchor";
// import * as anchor from '@project-serum/anchor'
// // import idl from '../../../pages/IDL/idl.json';
// // const PROGRAM_ID = new anchor.web3.PublicKey(
// //     `4Ai9X7KFMNSwrqxzvirJ7GjSzcZC2xWTEm67BDynzmi8`
// // )

export const useClaim = () => {
    // const [program, setProgram] = useState<anchor.Program>()
    const [ fetchrewards, setFetch ] = useState(0);
    const { publicKey } = useWallet();
    const { visible, setVisible } = useWalletModal();

    const { FetchRewards, onClaimRewards } = ApiMessage();

    const { connection, stakedToken } = useContext(StakingContext);

    const Fetch = useCallback(async () => {
        let fetch = await FetchRewards();
        if(!fetch)return;
        setFetch(fetch);
    }, [FetchRewards])   
    useEffect(() => {
        if (!publicKey) return;
        Fetch();
    }, [publicKey, Fetch]);
    useEffect(() => {
        if (!publicKey || !connection) return;

        const listenerId = connection.onAccountChange(publicKey, (account) => {
            Fetch();
        });

        return () => {
            connection.removeAccountChangeListener(listenerId);
        };
   
    }, [publicKey, connection, Fetch]);

    const onClick = useCallback(async () => {
        if (publicKey) {
            await onClaimRewards();
        }
        else {
            setVisible(!visible);
        }
    }, [publicKey, visible, onClaimRewards, setVisible]);
    return {
        fetchrewards, onClick
    };
};