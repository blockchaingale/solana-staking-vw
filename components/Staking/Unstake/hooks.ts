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

export const useUnstake = () => {
    // const [program, setProgram] = useState<anchor.Program>()
    const [ fetchvalue, setFetch ] = useState(0);
    const { publicKey } = useWallet();
    const { visible, setVisible } = useWalletModal();

    const { Initialize, onUnstake, FetchValue } = ApiMessage();

    const [balance, setBalance] = useState(0);
    const [value, setValue] = useState(0);

    const { connection, stakedToken } = useContext(StakingContext);

    const getBalance = useCallback(async (publicKey: PublicKey) => {
        if (!connection) return;

        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
    }, [connection]);
    const Fetch = useCallback(async () => {
        let fetch = await FetchValue();
        if(!fetch)return;
        setFetch(fetch);
    }, [FetchValue])   
    useEffect(() => {
        if (!publicKey) return;
        getBalance(publicKey);
        Fetch();
    }, [publicKey, getBalance, Fetch]);

    useEffect(() => {
        if (!publicKey || !connection) return;

        const listenerId = connection.onAccountChange(publicKey, (account) => {
            setBalance(account.lamports / LAMPORTS_PER_SOL);
        });

        return () => {
            connection.removeAccountChangeListener(listenerId);
        };
   
    }, [publicKey, connection]);

    const onMax = useCallback(() => {
        setValue(fetchvalue);
    }, [fetchvalue]);

    const onChange = useCallback((value: number) => {
        setValue(value);
    }, []);

    const onClick = useCallback(async () => {
        if (publicKey) {

            await onUnstake(1e9 * value);
        }
        else {
            setVisible(!visible);
        }
    }, [publicKey, setVisible, visible, onUnstake, value]);

    return {
        publicKey, fetchvalue, value, balance, stakedToken, onClick, onMax, onChange,
    };
};