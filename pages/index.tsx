import { createTheme, ThemeProvider, Typography } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { SolanaProvider } from '../components/SolanaProvider/SolanaProvider'
import { Staking } from '../components/Staking/Staking'
import { Widgets } from '../components/Widgets/Widgets'
import { StakingContext } from '../contexts/StakingContext'
import styles from '../styles/Home.module.css'
import theme from '../themes/theme'
import { useIndex } from '../hooks/index.hooks';
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { solanaConfig } from '../config/solana.config'
import { ApiMessage, calculateGlobalDataPda } from './api/api'
import { useCallback, useContext, useEffect, useState } from 'react'
import * as anchor from '@project-serum/anchor'
import { Program, web3 } from '@project-serum/anchor'
import idl from './IDL/idl.json';
import { useHome } from './api/hook'

const stakingTheme = createTheme(theme);
const PROGRAM_ID = new anchor.web3.PublicKey(solanaConfig["devnet"].programId);

const Home: NextPage = () => {
    const { apr, endpoint, connection } = useIndex();

    return (
        <ThemeProvider theme={stakingTheme}>
            <Head>
                <title>Solana Staking Finance</title>
                <meta name="description" content="The best risk-free yields on Solana." />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            </Head>

            <main className={styles.main}>
                <SolanaProvider endpoint={endpoint}>
                    {
                    <StakingContext.Provider value={{ apr, connection, stakedToken: "SOL" }}>
                        <Staking/>
                    </StakingContext.Provider>
                    }
                </SolanaProvider>
            </main>
        </ThemeProvider>
    )
}

export default Home
