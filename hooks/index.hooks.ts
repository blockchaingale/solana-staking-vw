import { Cluster, clusterApiUrl, Connection } from "@solana/web3.js";
import { useMemo, useState } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export const useIndex = () => {
    const [apr, setApr] = useState(2);
    const [cluster] = useState<Cluster>("devnet");
    const endpoint = useMemo(() => clusterApiUrl(cluster), [cluster]);

    const connection = useMemo(() => {
        return new Connection(endpoint, "processed");
    }, [endpoint]);

    return {
        apr, endpoint, connection,
    }
};