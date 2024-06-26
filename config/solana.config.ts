type ClusterConfig = {
    programId: string;
    stakePool: string;
}

export const solanaConfig: { [s: string]: ClusterConfig } = {
    "mainnet-beta": {
        programId: "5ocnV1qiCgaQR8Jb8xWnVbApfaygJ8tNoZfgPwsgx9kx",
        stakePool: "5oc4nmbNTda9fx8Tw57ShLD132aqDK65vuHH4RU1K4LZ",
    },
    "testnet": {
        programId: "4Ai9X7KFMNSwrqxzvirJ7GjSzcZC2xWTEm67BDynzmi8",
        stakePool: "5oc4nDMhYqP8dB5DW8DHtoLJpcasB19Tacu3GWAMbQAC",
    },
    "devnet": {
        programId: "H3V6xiijQa81CuJs9UWjJ1WsfHiYjpj4Vj5thDxUfXBu",
        stakePool: "FctdcG2dw29GNDQdsFHHT8TNdRg1fBw76AXziWbKSQmz",
    }
}