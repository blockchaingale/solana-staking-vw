export enum StakingTab {
    Stake = "Stake",
    Unstake = "Unstake",
    Claim = "Claim"
}

export const stakingTabs = Object.keys(StakingTab) as Array<keyof typeof StakingTab>;