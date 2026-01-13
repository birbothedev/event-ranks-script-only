import { readFromFile, writeToFile } from "../../json-stuff/Output.js";

export async function getParsedDataFromFile(TEMP_DIR, filename){
    const data = await readFromFile(TEMP_DIR, filename);
    return data;
}

async function getEndValuePerSkill(TEMP_DIR, filename){
    const fullData = await getParsedDataFromFile(TEMP_DIR, filename);
    
    // get end xp value per skill per player
    const playerSkillData = fullData.map(player => ({
        playerName: player.playerName,
        skills: Object.fromEntries(
            Object.entries(player.data.skills).map(([skillName, skillData]) => [
                skillName,
                skillData.experience.end
            ])
        )
    }));

    return playerSkillData;
}

async function getEndValuePerBossKC(TEMP_DIR, filename){
    const fullData = await getParsedDataFromFile(TEMP_DIR, filename);

    // get end boss kc per boss per player
    const playerBossData = fullData.map(player => ({
        playerName: player.playerName,
        bosses: Object.fromEntries(
            Object.entries(player.data.bosses).map(([bossName, bossData]) => [
                bossName,
                bossData.kills.end
            ])
        )
    }));

    return playerBossData;
}

async function getPlayerEfficiency(TEMP_DIR, filename){
    const fullData = await getParsedDataFromFile(TEMP_DIR, filename);

    // get end efficiency value per type per player
    const playerEfficiencyData = fullData.map(player => ({
        playerName: player.playerName,
        efficiency: Object.fromEntries(
            Object.entries(player.data.computed).map(([efficiencyName, efficiencyData]) => [
                efficiencyName,
                efficiencyData.value.end
            ])
        )
    }));

    return playerEfficiencyData;
}

// TODO: create function for getting player account type (main or iron)

export async function combineDataAndWriteToFile(filename, exportfilename, TEMP_DIR){
    const playerSkillData = await getEndValuePerSkill(TEMP_DIR, filename);
    const playerBossData = await getEndValuePerBossKC(TEMP_DIR, filename);
    const playerEfficiencyData = await getPlayerEfficiency(TEMP_DIR, filename);

    const allDataMerged = playerSkillData.map(skillItem => {
        const playerName = skillItem.playerName;
        const bossItem = playerBossData.find(b => b.playerName === playerName);
        const efficiencyItem = playerEfficiencyData.find(e => e.playerName === playerName);

        // add player data per skills, find where boss and efficiency data match the player name 
        return {
            playerName,
            data : {
                skills: skillItem.skills,
                bosses: bossItem ? bossItem.bosses : {},
                efficiency: efficiencyItem ? efficiencyItem.efficiency : {}
            }
        };
    });

    writeToFile(allDataMerged, exportfilename, TEMP_DIR);
}