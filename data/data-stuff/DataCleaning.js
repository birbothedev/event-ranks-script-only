import { readFromFile, writeToFile } from "../json-stuff/Output.js";

export async function getParsedDataFromFile(filename){
    const data = await readFromFile(filename);
    return data;
}

async function getEndValuePerSkill(filename){
    const fullData = await getParsedDataFromFile(filename);
    
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

async function getEndValuePerBossKC(filename){
    const fullData = await getParsedDataFromFile(filename);

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

async function getPlayerEfficiency(filename){
    const fullData = await getParsedDataFromFile(filename);

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
    const playerSkillData = await getEndValuePerSkill(filename);
    const playerBossData = await getEndValuePerBossKC(filename);
    const playerEfficiencyData = await getPlayerEfficiency(filename);

    const allDataMerged = playerSkillData.map(skillItem => {
        const playerName = skillItem.playerName;
        const bossItem = playerBossData.find(b => b.playerName === playerName);
        const efficiencyItem = playerEfficiencyData.find(e => e.playerName === playerName);

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