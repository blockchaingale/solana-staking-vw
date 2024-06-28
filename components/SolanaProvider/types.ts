//import { LedgerWalletAdapter, PhantomWalletAdapter, SafePalWalletAdapter, SlopeWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
export const solanaWallets = [
    new PhantomWalletAdapter(),
    // new SlopeWalletAdapter(),
    // new LedgerWalletAdapter(),
    // new SolflareWalletAdapter(),
    // new SafePalWalletAdapter(),
];

export interface SolanaProviderProps {
    endpoint: string;
}