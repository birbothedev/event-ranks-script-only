import { getParsedDataFromFile } from "../../event-ranking/data-stuff/EventDataCleaning.js";
import { writeToFile } from "../../json-stuff/Output.js";

async function getGainedValuePerSkillPerPlayer(TEMP_DIR, filename){
    const fullData = await getParsedDataFromFile(TEMP_DIR, filename);

    // get gained xp value per skill per player
    const playerSkillData = fullData.map(player => ({
        playerName: player.playerName,
        skills: Object.fromEntries(
            Object.entries(player.data.skills).map(([skillName, skillData]) => [
                skillName,
                skillData.experience.gained
            ])
        )
    }));

    return playerSkillData;
}

async function getGainedValuePerBossKCPerPlayer(TEMP_DIR, filename){
    const fullData = await getParsedDataFromFile(TEMP_DIR, filename);

    // get gained boss kc per boss per player
    const playerBossData = fullData.map(player => ({
        playerName: player.playerName,
        bosses: Object.fromEntries(
            Object.entries(player.data.bosses).map(([bossName, bossData]) => [
                bossName,
                bossData.kills.gained
            ])
        )
    }));

    return playerBossData;
}

export async function combineNewsDataAndWriteToFile(filename, exportfilename, TEMP_DIR){
    const playerSkillData = await getGainedValuePerSkillPerPlayer(TEMP_DIR, filename);
    const playerBossData = await getGainedValuePerBossKCPerPlayer(TEMP_DIR, filename);

    const allDataMerged = playerSkillData.map(skillItem => {
        const playerName = skillItem.playerName;
        const bossItem = playerBossData.find(b => b.playerName === playerName);

        // add player data per skills, find where boss data matches the player name 
        return {
            playerName,
            data: {
                skills: skillItem.skills,
                bosses: bossItem ? bossItem.bosses : {}
            }
        };
    });

    writeToFile(allDataMerged, exportfilename, TEMP_DIR);
}