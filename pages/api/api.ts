import * as anchor from '@project-serum/anchor'
import { Program, web3 } from '@project-serum/anchor'
import idl from '../IDL/idl.json';
import { FC, useCallback, useEffect, useState } from 'react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { listItemTextClasses } from '@mui/material';
import { solanaConfig } from '../../config/solana.config';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
// const PROGRAM_ID = new anchor.web3.PublicKey(
//     `4Ai9X7KFMNSwrqxzvirJ7GjSzcZC2xWTEm67BDynzmi8`
// )
const PROGRAM_ID = new anchor.web3.PublicKey(solanaConfig["devnet"].programId);
let mint = new web3.PublicKey('AS9YAgAC1k3nZrEzTqaS9R65NQUzR2RoS44GRdUyehKG');
let tokenProgram = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
let associatedTokenProgram = new web3.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
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

export const calculateStakePoolPda =  async () => {
    const prefix = "stake-pool";
    let seeds = [
        Buffer.from(prefix),
    ]
    return await web3.PublicKey.findProgramAddressSync(seeds, PROGRAM_ID);
}

export const calculateEscrowPda = async () => {
    const prefix = "reward-escrow";
    const stakePoolPda = await calculateStakePoolPda();
    let seeds = [
        Buffer.from(prefix),
        mint.toBuffer(),
        stakePoolPda[0].toBuffer()
    ]
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

    const onCreateStakePool = useCallback(async () => {
        if(program === undefined || publicKey === null)return;
        let stakePoolPda = await calculateStakePoolPda();
        let escrowPda = await calculateEscrowPda();

        await program.methods
        .createStakePool()
        .accounts({
          creator: publicKey,
          mint: mint,
          stakePool: stakePoolPda[0],
          escrow: escrowPda[0],
          tokenProgram: tokenProgram,
          systemProgram: web3.SystemProgram.programId,
          associatedTokenProgram: associatedTokenProgram,
          rent: web3.SYSVAR_RENT_PUBKEY
        })
        .signers([])
        .rpc();        
    }, [program, publicKey])

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
        let globalDataPda = await calculateGlobalDataPda();
        let stakeEntry = await program.account.stakeEntry.fetchNullable(stakeEntryPda[0]);

        let stakePoolPda = await calculateStakePoolPda();
        // let staker = await solana.getTokenAccountsByOwner(publicKey, { mint: mint });
        let staker = new web3.PublicKey('GX5JiNwpWRBZ73KA5mLAcoDrjLndtNtXWi15WhjKZYCh');
        let escrowPda = await calculateEscrowPda();

        if(stakeEntry == null)
            await onCreateStakeEntry();
        const stakeAmount = new anchor.BN(amount);
        await program.methods.stake(stakeAmount)
        .accounts({
            user: publicKey,
            stakeEntry: stakeEntryPda[0],
            vault: vaultPda[0],
            globalData: globalDataPda[0],
            stakePool: stakePoolPda[0],
            staker: staker,
            vaultTokenAccount: escrowPda[0],
            mint: mint,
            tokenProgram: tokenProgram,
            systemProgram: web3.SystemProgram.programId
        })
        .signers([])
        .rpc();
    }, [program, publicKey, onCreateStakeEntry])

    const onUnstake = useCallback(async (amount: number) => {
        if(program === undefined || publicKey === null)return;
        let vaultPda = await calculateVaultDataPda();
        let stakeEntryPda = await calculateStakeEntryPda(publicKey);
        let stakePoolPda = await calculateStakePoolPda();
        // let staker = await solana.getTokenAccountsByOwner(publicKey, { mint: mint });
        let staker = new web3.PublicKey('GX5JiNwpWRBZ73KA5mLAcoDrjLndtNtXWi15WhjKZYCh');
        let escrowPda = await calculateEscrowPda();

        const unstakeAmount = new anchor.BN(amount);

        await program.methods.unstake(unstakeAmount, vaultPda[1])
        .accounts({
            user: publicKey,
            stakeEntry: stakeEntryPda[0],
            vault: vaultPda[0],
            stakePool: stakePoolPda[0],
            staker: staker,
            vaultTokenAccount: escrowPda[0],
            mint: mint,
            tokenProgram: tokenProgram,
            systemProgram: web3.SystemProgram.programId
        })
        .signers([])
        .rpc();
    }, [program, publicKey])

    const onClaimRewards = useCallback(async () => {
        if(program === undefined || publicKey === null)return;
        let stakeEntryPda = await calculateStakeEntryPda(publicKey);
        let stakePoolPda = await calculateStakePoolPda();
        let escrowPda = await calculateEscrowPda();

        const solana = new web3.Connection('https://api.devnet.solana.com');
        let staker1 = await solana.getTokenAccountsByOwner(publicKey, { mint: mint });
//        let staker = new web3.PublicKey('GX5JiNwpWRBZ73KA5mLAcoDrjLndtNtXWi15WhjKZYCh');
        console.log(stakePoolPda[0].toBase58(), escrowPda[0].toBase58(), staker1.value[0].pubkey.toBase58());        
        //if(staker === null || staker === undefined)return;
        await program?.methods
            .claimrewards()
            .accounts({
                user: publicKey,
                stakePool: stakePoolPda[0],
                stakeEntry: stakeEntryPda[0],
                staker: staker1.value[0].pubkey,
                vaultTokenAccount: escrowPda[0],
                mint: mint,
                tokenProgram: tokenProgram
            })
            .signers([])
            .rpc();
    }, [program, publicKey])

    const FetchRewards = useCallback(async () => {
        if(program === undefined || publicKey === null)return;
        let stakeEntryPda = await calculateStakeEntryPda(publicKey);
        let stakeEntry = await program.account.stakeEntry.fetchNullable(stakeEntryPda[0]);
        if(!stakeEntry || !stakeEntry.balance )return 0;
        if(stakeEntry.rewards instanceof anchor.BN)
            return stakeEntry.rewards.toNumber();
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

    const refreshRewards = useCallback(async () => {
        if(program === undefined || publicKey === null)return;
        let stakeEntryPda = await calculateStakeEntryPda(publicKey);
        await program.methods.refreshrewards()
        .accounts({
            initializer: publicKey,
            stakeEntryPda: stakeEntryPda[0]
        })
        .signers([])
        .rpc();
    }, [program, publicKey])
    return { Fee, refreshRewards, Initialize, onCreateStakeEntry, onStake, onUnstake, FetchRewards, FetchValue, FeeTotal, Withdrawfee, setFee, onClaimRewards, onCreateStakePool };
}