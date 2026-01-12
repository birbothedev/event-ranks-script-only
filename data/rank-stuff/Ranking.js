import { readFromFile, writeToFile } from "../json-stuff/Output.js";

// multipliers
const bossMultiplier = 2;
const skillMultiplier = 1;
const efficiencyMultiplier = 1;
const mainMultiplier = 1.5;

// total categories
const totalCategories = 3;

// rank tiers
const rank1 = 0;
const rank2 = 10;
const rank3 = 20;
const rank4 = 30;
const rank5 = 40;
const rank6 = 50;

//rank order
const rankOrder = {
    'No Rank': 0,
    'Rank 1': 1,
    'Rank 2': 2,
    'Rank 3': 3,
    'Rank 4': 4,
    'Rank 5': 5,
    'Rank 6': 6
};

async function calculateTotalPointValueFromWeights(filename){
    const weightedPlayerData = await readFromFile(filename);

    const results = [];

    for (const player of weightedPlayerData) {
        const bossWeights = player.data.bossWeights;
        const skillWeights = player.data.skills;
        const efficiencyWeights = player.data.efficiency;

        const totalBossPoints = Object.values(bossWeights).reduce((sum, current) => sum + current, 0);
        const totalSkillPoints = Object.values(skillWeights).reduce((sum, current) => sum + current, 0);
        const totalEfficiencyPoints = Object.values(efficiencyWeights).reduce((sum, current) => sum + current, 0);

        const totalPoints = (totalBossPoints * bossMultiplier) + (totalSkillPoints * skillMultiplier) + (totalEfficiencyPoints * efficiencyMultiplier);

        const totalAveragedPoints = totalPoints / totalCategories;

        const decimalPlaces = 3;
        const factor = 10 ** decimalPlaces;
        const roundedPoints = Math.round(totalAveragedPoints * factor) / factor;

        results.push({
            playerName: player.playerName,
            totalPoints: roundedPoints
        });
    }
    return results;
}   

export async function rankAllPlayers(filename, exportfilename, TEMP_DIR){
    const playerPoints = await calculateTotalPointValueFromWeights(filename);
    const ranks = {};

    for (const playerData of playerPoints) {
        const { playerName, totalPoints } = playerData;
        let rank = "";

        if (totalPoints >= rank6) rank = "Rank 6";
        else if (totalPoints >= rank5) rank = "Rank 5";
        else if (totalPoints >= rank4) rank = "Rank 4";
        else if (totalPoints >= rank3) rank = "Rank 3";
        else if (totalPoints >= rank2) rank = "Rank 2";
        else if (totalPoints >= rank1) rank = "Rank 1";
        else rank = "No Rank";

        ranks[playerName] = rank;
    }

    const rankArray = Object.entries(ranks).map(([playerName, rank]) => ({ playerName, rank }));
    rankArray.sort((a, b) => rankOrder[b.rank] - rankOrder[a.rank]);

    writeToFile(rankArray, exportfilename, TEMP_DIR);
    return rankArray;
}