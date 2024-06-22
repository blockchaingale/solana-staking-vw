import * as anchor from '@project-serum/anchor'
import { Program, web3 } from '@project-serum/anchor'
import idl from '../IDL/idl.json';
import { FC, useCallback, useEffect, useState } from 'react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { listItemTextClasses } from '@mui/material';
import { solanaConfig } from '../../config/solana.config';
// const PROGRAM_ID = new anchor.web3.PublicKey(
//     `4Ai9X7KFMNSwrqxzvirJ7GjSzcZC2xWTEm67BDynzmi8`
// )
const PROGRAM_ID = new anchor.web3.PublicKey(solanaConfig["devnet"].programId);

export const calculateGlobalDataPda = async () => {
    const prefix = "global-data";
    let seeds = [
        Buffer.from(prefix),
    ];
    return await web3.PublicKey.findProgramAddressSync(seeds, PROGRAM_ID);
}

export const calculateVaultDataPda = async () => {
    const prefix = "vault-entry";
    let seeds = [
        Buffer.from(prefix),
    ];
    return await web3.PublicKey.findProgramAddressSync(seeds, PROGRAM_ID);
}

export const calculateStakeEntryPda = async (user: anchor.web3.PublicKey) => {
    const prefix = "stake-entry";
    let seeds = [
        Buffer.from(prefix),
        user.toBuffer()
    ];
    return await web3.PublicKey.findProgramAddressSync(seeds, PROGRAM_ID);
}

export const ApiMessage = () => {
    const [program, setProgram] = useState<anchor.Program>()

    const { connection } = useConnection()
    const wallet = useAnchorWallet()

    const { publicKey } = useWallet();

    useEffect(() => {
        if(wallet === undefined)return;
        let provider: anchor.Provider
        try {
            provider = anchor.getProvider()
        } catch (e) {
            provider = new anchor.AnchorProvider(connection, wallet, {})
            anchor.setProvider(provider)
        }

        const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID)
        setProgram(program);
    }, [connection, wallet])

    const Initialize = useCallback(async ()=>{
        let globalDataPda = await calculateGlobalDataPda();
        console.log(globalDataPda[0].toBase58());
        // console.log("debug gloabalData", globalDataPda[0].toBase58())
        // return {
        //     admin,
        //     globalData: globalDataPda[0],
        //     systemProgram: web3.SystemProgram.programId
        // }        
    }, [])

    const onCreateStakeEntry = useCallback(async () => {
        if(program === undefined || publicKey === null)return;
        let globalDataPda = await calculateGlobalDataPda();
        let stakeEntryPda = await calculateStakeEntryPda(publicKey);
      
        await program.methods.createStakeEntry()
        .accounts({
            user: publicKey,
            globalData: globalDataPda[0],
            stakeEntry: stakeEntryPda[0],
            systemProgram: web3.SystemProgram.programId
        })
        .signers([])
        .rpc();
        //await program.provider.connection.confirmTransaction(ix);
    }, [program, publicKey])

    const onStake = useCallback(async (amount: number) => {
        if(program === undefined || publicKey === null)return;
        let vaultPda = await calculateVaultDataPda();
        let stakeEntryPda = await calculateStakeEntryPda(publicKey);
        let stakeEntry = await program.account.stakeEntry.fetchNullable(stakeEntryPda[0]);
        if(stakeEntry == null)
            await onCreateStakeEntry();
        const stakeAmount = new anchor.BN(amount);
        await program.methods.stake(stakeAmount)
        .accounts({
            user: publicKey,
            stakeEntry: stakeEntryPda[0],
            vault: vaultPda[0],
            systemProgram: web3.SystemProgram.programId
        })
        .signers([])
        .rpc();
        //return ix;
    }, [program, publicKey])

    const onUnstake = useCallback(async (amount: number) => {
        if(program === undefined || publicKey === null)return;
        let vaultPda = await calculateVaultDataPda();
        const globalDataPda = await calculateGlobalDataPda();
        let stakeEntryPda = await calculateStakeEntryPda(publicKey);
        const unstakeAmount = new anchor.BN(amount);
        //let ix = 
        await program.methods.unstake(unstakeAmount, vaultPda[1])
        .accounts({
            user: publicKey,
            stakeEntry: stakeEntryPda[0],
            globalData: globalDataPda[0],
            vault: vaultPda[0],
            systemProgram: web3.SystemProgram.programId
        })
        .signers([])
        .rpc();
        //return ix;
    }, [program, publicKey])

    const FetchValue = useCallback(async () => {
        if(program === undefined || publicKey === null)return;
        let stakeEntryPda = await calculateStakeEntryPda(publicKey);
        let stakeEntry = await program.account.stakeEntry.fetchNullable(stakeEntryPda[0]);
        if(!stakeEntry || !stakeEntry.balance )return 0;
        if(stakeEntry.balance instanceof anchor.BN)
            return stakeEntry.balance.toNumber() / 1e9;
    }, [program, publicKey])

    const FeeTotal = useCallback(async () => {
        if(program === undefined || publicKey === null)return;
        const globalDataPda = await calculateGlobalDataPda();
        let globalData = await program.account.globalData.fetchNullable(globalDataPda[0]);
//           console.log(publicKey.toBase58(), globalData.admin.toBase58())
        if(!globalData || !globalData.feetotal)return 0; 
        if(globalData.feetotal instanceof anchor.BN)
            return globalData.feetotal.toNumber() / 1e9;
    }, [program, publicKey])

    const Fee = useCallback(async () => {
        if(program === undefined || publicKey === null)return;
        const globalDataPda = await calculateGlobalDataPda();
        let globalData = await program.account.globalData.fetchNullable(globalDataPda[0]);
//           console.log(publicKey.toBase58(), globalData.admin.toBase58())
        if(!globalData || !globalData.fee)return 0; 
        if(globalData.fee instanceof anchor.BN)
            return globalData.fee.toNumber();
    }, [program, publicKey])    

    const Withdrawfee = useCallback(async () => {
        if(!publicKey || !program)return;
        console.log("withdraw");
        let globalDataPda = await calculateGlobalDataPda();
        let vaultPda = await calculateVaultDataPda();
        await program.methods.withdrawfee(vaultPda[1])
        .accounts({
            initializer: publicKey,
            systemProgram: web3.SystemProgram.programId,
            globalData: globalDataPda[0],
            vault: vaultPda[0],
        })
        .signers([])
        .rpc();
    }, [program, publicKey]);

    const setFee = useCallback(async (per: number) => {
        if(!publicKey || !program)return;
        console.log("fee")
        let globalDataPda = await calculateGlobalDataPda();
        const percent = new anchor.BN(per);
        await program.methods.setfee(percent)
        .accounts({
            initializer: publicKey,
            globalData: globalDataPda[0],
        })
        .signers([])
        .rpc();
    }, [program, publicKey])

    return { Fee, Initialize, onCreateStakeEntry, onStake, onUnstake, FetchValue, FeeTotal, Withdrawfee, setFee };
}