import { tier1eff, tier2eff, tier3eff, tier4eff, tier5eff } from "../data-stuff/DataCategories.js";
import { readFromFile, writeToFile } from "../../json-stuff/Output.js";

function weighEfficiency(hours){
    if (hours >= tier5eff) return 5;
    else if (hours >= tier4eff) return 4;
    else if (hours >= tier3eff) return 3;
    else if (hours >= tier2eff) return 2;
    else if (hours >= tier1eff) return 1;
    else return 0;
}

export async function applyWeightsToPlayerEfficiency(TEMP_DIR, filename){
    const playerData = await readFromFile(TEMP_DIR, filename);

    const playerEfficiency = playerData.map(player => ({
        playerName: player.playerName,
        efficiency: player.data.efficiency
    }));

    const weightedEfficiency = playerEfficiency.map(player => {
        const ehpWeights = weighEfficiency(player.efficiency.ehp);
        const ehbWeights = weighEfficiency(player.efficiency.ehb);

        return {
            playerName: player.playerName,
            ehpWeights,
            ehbWeights
        }
    });

    return weightedEfficiency;
}

