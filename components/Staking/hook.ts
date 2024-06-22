import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { StakingContext } from "../../contexts/StakingContext";
import idl from '../../pages/IDL/idl.json'
import * as anchor from '@project-serum/anchor'
import { Program, web3 } from '@project-serum/anchor'
import { calculateGlobalDataPda } from "../../pages/api/api";
import { solanaConfig } from "../../config/solana.config";
import { type } from "os";
const PROGRAM_ID = new anchor.web3.PublicKey(solanaConfig["devnet"].programId);
export const useHome = () => {
    const { publicKey } = useWallet();
    const { connection, stakedToken } = useContext(StakingContext);
    const wallet = useAnchorWallet()
    const [Admin, setAdmin] = useState(false)
    const [program, setProgram] = useState<anchor.Program>()
    useEffect(() => {
        if (!publicKey || !connection) return;

        const listenerId = connection.onAccountChange(publicKey, (account) => {
            IsAdmin()
        });

        return () => {
            connection.removeAccountChangeListener(listenerId);
        };
    }, [publicKey, connection]);


    useEffect(() => {
        if(wallet === undefined || !connection)return;
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

    const IsAdmin = useCallback(async () => {
        if(!program)return false;
        if(!publicKey || !connection)return false;
        if(publicKey) {
            const globalDataPda = await calculateGlobalDataPda();
            let globalData = await program.account.globalData.fetchNullable(globalDataPda[0]);
 //           console.log(publicKey.toBase58(), globalData.admin.toBase58())
            if(!globalData || !globalData.admin)return;
            if(globalData.admin === publicKey)return true;
            return false;
            // console.log(Admin);
        }
    }, [program, publicKey, connection])

    useEffect(()=>{
        if(!publicKey)return;
        IsAdmin()
    }, [publicKey, IsAdmin])

    return {IsAdmin}
}