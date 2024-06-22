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

export const useStake = () => {  
    const { publicKey } = useWallet();
    const { visible, setVisible } = useWalletModal();

    const { Initialize, onCreateStakeEntry, onStake } = ApiMessage();

    const [balance, setBalance] = useState(0);
    const [value, setValue] = useState(0);

    const { connection, stakedToken } = useContext(StakingContext);

    const getBalance = useCallback(async (publicKey: PublicKey) => {
        if (!connection) return;

        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
    }, [connection]);

    useEffect(() => {
        if (!publicKey) return;
        getBalance(publicKey);
    }, [publicKey, getBalance]);

    useEffect(() => {
        if (!publicKey || !connection) return;

        const listenerId = connection.onAccountChange(publicKey, (account) => {
            setBalance(account.lamports / LAMPORTS_PER_SOL);
        });

        // const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID)
        // setProgram(program);

        return () => {
            connection.removeAccountChangeListener(listenerId);
        };
   
    }, [publicKey, connection]);

    const onMax = useCallback(() => {
        setValue(balance);
    }, [balance]);

    const onChange = useCallback((value: number) => {
        setValue(value);
    }, []);

    const onClick = useCallback(async () => {
        if (publicKey) {
            await onStake(1e9 * value);
        }
        else {
            setVisible(!visible);
        }
    }, [publicKey, setVisible, visible, onStake, value]);

    return {
        publicKey, value, balance, stakedToken, onClick, onMax, onChange,
    };
};