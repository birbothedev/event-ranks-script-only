import { tier1bosses, tier1KC, tier2bosses, tier2KC, tier3bosses, tier3KC, tier4bosses, tier4KC, tier5bosses, tier5KC, toaKC, tobKC, coxKC} from "../data-stuff/DataCategories.js";

import { readFromFile } from "../json-stuff/Output.js";

function separateBossByType(bossArray){
    const playerBosses = bossArray.map(player => {
        const playerName = player.playerName;
        const allBosses = player.bosses;

        const t1bosses = Object.fromEntries(
            Object.entries(allBosses).filter(([bossName]) =>
                tier1bosses.includes(bossName)
            )
        );
        const t2bosses = Object.fromEntries(
            Object.entries(allBosses).filter(([bossName]) =>
                tier2bosses.includes(bossName)
            )
        );
        const t3bosses = Object.fromEntries(
            Object.entries(allBosses).filter(([bossName]) =>
                tier3bosses.includes(bossName)
            )
        );
        const t4bosses = Object.fromEntries(
            Object.entries(allBosses).filter(([bossName]) =>
                tier4bosses.includes(bossName)
            )
        );
        const t5bosses = Object.fromEntries(
            Object.entries(allBosses).filter(([bossName]) =>
                tier5bosses.includes(bossName)
            )
        );
        const toaRaids = Object.fromEntries(
            Object.entries(allBosses).filter(([bossName]) =>
                toaKC.includes(bossName)
            )
        );
        const tobRaids = Object.fromEntries(
            Object.entries(allBosses).filter(([bossName]) =>
                tobKC.includes(bossName)
            )
        );
        const coxRaids = Object.fromEntries(
            Object.entries(allBosses).filter(([bossName]) =>
                coxKC.includes(bossName)
            )
        );
        return {
            playerName,
            tier1bosses: t1bosses,
            tier2bosses: t2bosses,
            tier3bosses: t3bosses,
            tier4bosses: t4bosses,
            tier5bosses: t5bosses,
            toaRaids: toaRaids,
            tobRaids: tobRaids,
            coxRaids: coxRaids
        }
    });

    return playerBosses;
}

function weighBossesByType(bossType, pointMultiplier){
    const bossPoints = {};

    for (const [boss, kc] of Object.entries(bossType)){
        let score = 0;
        
        if (kc >= tier5KC) score = 5 * pointMultiplier;
        else if (kc >= tier4KC) score = 4 * pointMultiplier;
        else if (kc >= tier3KC) score = 3 * pointMultiplier;
        else if (kc >= tier2KC) score = 2 * pointMultiplier;
        else if (kc >= tier1KC) score = 1 * pointMultiplier;
        else score = 0;

        bossPoints[boss] = score;
    }

    const totalBossPointsValue = Object.values(bossPoints).reduce((sum, current) => sum + current, 0);
    const averagedBossPointsValue = totalBossPointsValue / Object.keys(bossPoints).length;

    return averagedBossPointsValue;
}

export async function applyWeightsToPlayerBossCount(TEMP_DIR, filename){
    const playerData = await readFromFile(TEMP_DIR, filename);

    const playerBosses = playerData.map(player => ({
        playerName: player.playerName,
        bosses: player.data.bosses
    }));

    const separatedBosses = await separateBossByType(playerBosses);
    const weightedBosses = separatedBosses.map(player => {
        const t1weights = weighBossesByType(player.tier1bosses, 1);
        const t2weights = weighBossesByType(player.tier2bosses, 2);
        const t3weights = weighBossesByType(player.tier3bosses, 3);
        const t4weights = weighBossesByType(player.tier4bosses, 4);
        const t5weights = weighBossesByType(player.tier5bosses, 5);
        const toaWeights = weighBossesByType(player.toaRaids, 6);
        const tobWeights = weighBossesByType(player.tobRaids, 6);
        const coxWeights = weighBossesByType(player.coxRaids, 6);

        return {
            playerName: player.playerName,
            t1weights,
            t2weights,
            t3weights,
            t4weights,
            t5weights,
            toaWeights,
            tobWeights,
            coxWeights
        }
    });

    return weightedBosses;
}

