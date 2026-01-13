import { getParsedDataFromFile } from "../../event-ranking/data-stuff/EventDataCleaning.js";

async function getGainedValuePerSkillForEveryone(){
    const fullData = await getParsedDataFromFile('outputs', 'news_data_cleaned');

    const allSkills = fullData.map(item => {
        return item.data.skills;
    });

    const skillsReduced = allSkills.reduce((accumulator, item) => {
        for (const key in item) {
            accumulator[key] = (accumulator[key] || 0) + item[key];
        }
        return accumulator;
    }, {});

    return skillsReduced;
}

getGainedValuePerSkillForEveryone();