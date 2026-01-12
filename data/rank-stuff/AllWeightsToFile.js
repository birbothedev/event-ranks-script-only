import { writeToFile } from "../json-stuff/Output.js";
import { applyWeightsToPlayerBossCount } from "./BossWeights.js";
import { applyWeightsToPlayerEfficiency } from "./EfficiencyWeights.js";
import { applyWeightsToPlayerSkills } from "./SkillWeights.js";

export async function getAllPlayerWeights(filename, exportfilename, TEMP_DIR){
    const bossweights = await applyWeightsToPlayerBossCount(TEMP_DIR, filename);
    const efficiencyweights = await applyWeightsToPlayerEfficiency(TEMP_DIR, filename);
    const skillweights = await applyWeightsToPlayerSkills(TEMP_DIR, filename);

    const allWeightsMerged = bossweights.map(bossItem => {
        const playerName = bossItem.playerName;
        const skillItem = skillweights.find(s => s.playerName === playerName);
        const efficiencyItem = efficiencyweights.find(e => e.playerName === playerName);

        return {
            playerName,
            data: {
            bossWeights: {
                t1: bossItem.t1weights,
                t2: bossItem.t2weights,
                t3: bossItem.t3weights,
                t4: bossItem.t4weights,
                t5: bossItem.t5weights,
                toa: bossItem.toaWeights,
                tob: bossItem.tobWeights,
                cox: bossItem.coxWeights
            },
            skills: {
                weightedCombats: skillItem ? skillItem.weightedCombats : {},
                weightedSkilling: skillItem ? skillItem.weightedSkilling : {}
            },
            efficiency: {
                ehp: efficiencyItem ? efficiencyItem.ehpWeights : {},
                ehb: efficiencyItem ? efficiencyItem.ehbWeights : {}
            }
        }
        };
    });

    writeToFile(allWeightsMerged, exportfilename, TEMP_DIR);
}