import { readFromFile } from "../json-stuff/Output.js";
import { combatSkills, maxEXPValue, skillingSkills, tier1EXP,
    tier2EXP, tier3EXP, tier4EXP } from "../data-stuff/DataCategories.js";


function separateSkillsByType(skillsArray){
    const playerSkills = skillsArray.map(player => {
        const playerName = player.playerName;
        const allSkills = player.skills;
        const combats = Object.fromEntries(
            Object.entries(allSkills).filter(([skillName]) => 
                combatSkills.includes(skillName)
            )
        );
        const skilling = Object.fromEntries(
            Object.entries(allSkills).filter(([skillName]) => 
                skillingSkills.includes(skillName)
            )
        );
        return {
            playerName,
            combatSkills: combats,
            skillingSkills: skilling
        };
    });
    return playerSkills;
}
    
function weighSkillsByType(skillType, pointMultiplier){
    const points = {};

    for (const [skill, exp] of Object.entries(skillType)) {
        let score = 0;

        if (exp >= maxEXPValue) score = 5 * pointMultiplier;
        else if (exp >= tier4EXP) score = 4 * pointMultiplier;
        else if (exp >= tier3EXP) score = 3 * pointMultiplier;
        else if (exp >= tier2EXP) score = 2 * pointMultiplier;
        else if (exp >= tier1EXP) score = 1 * pointMultiplier;
        else score = 0;

        points[skill] = score;
    }

    const totalPointsValue = Object.values(points).reduce((sum, current) => sum + current, 0);

    const averagedPointsValue = totalPointsValue / Object.keys(points).length;

    return averagedPointsValue;
}

export async function applyWeightsToPlayerSkills(TEMP_DIR, filename){
    const playerData = await readFromFile(TEMP_DIR, filename);

    const playerSkills = playerData.map(player => ({
        playerName: player.playerName,
        skills: player.data.skills
    }));

    const separtedSkills = await separateSkillsByType(playerSkills);

    const weightedSkills = separtedSkills.map(player => {
        const weightedCombats = weighSkillsByType(player.combatSkills, 2);
        const weightedSkilling = weighSkillsByType(player.skillingSkills, 1);

        return {
            playerName: player.playerName,
            weightedCombats,
            weightedSkilling
        }
    })

    return weightedSkills;
}