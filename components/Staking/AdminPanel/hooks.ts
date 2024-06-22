import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, PublicKey, sendAndConfirmRawTransaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { StakingContext } from "../../../contexts/StakingContext";
import { ApiMessage, calculateStakeEntryPda } from "../../../pages/api/api";
import { TextareaAutosize } from "@mui/material";
import * as anchor from '@project-serum/anchor'
import { Program, web3 } from '@project-serum/anchor'
import idl from '../../../pages/IDL/idl.json';
import { solanaConfig } from "../../../config/solana.config";
const PROGRAM_ID = new anchor.web3.PublicKey(solanaConfig["devnet"].programId);

export const useAdmin = () => {  
    const { publicKey } = useWallet();
    const { visible, setVisible } = useWalletModal();

    const { FeeTotal, Fee, Withdrawfee, setFee } = ApiMessage();

    const [value, setValue] = useState(0);
    const [feetotal, setFeetotal] = useState(0)
    const { connection, stakedToken } = useContext(StakingContext);

    const getBalance = useCallback(async () => {
        const fee = await FeeTotal();
        return fee;
        //setBalance(balance / LAMPORTS_PER_SOL);
    }, [FeeTotal]);   

    const getFee = useCallback(async () => {
        const fee = await Fee();
        return fee;
        //setBalance(balance / LAMPORTS_PER_SOL);
    }, [Fee]);      

    useEffect(() => {
        getFee();
        getBalance();
    }, []);

    useEffect(() => {
        if (!publicKey || !connection) return;

        const listenerId = connection.onAccountChange(publicKey, (account) => {
            getBalance();
        });

        return () => {
            connection.removeAccountChangeListener(listenerId);
        };
    }, [publicKey, connection]);

    const onWithdraw = useCallback(async () => {
        await Withdrawfee()
    }, [Withdrawfee]);

    const onSetfee = useCallback(async (per: number) => {
        await setFee(per)
    }, [setFee])

    return {
        Fee, onWithdraw, onSetfee, getBalance
    };
};