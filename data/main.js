import { getPlayerGainsFromPeriod } from "./api-stuff/getData.js";
import { combineDataAndWriteToFile } from "./data-stuff/DataCleaning.js";
import { getAllPlayerWeights } from "./rank-stuff/AllWeightsToFile.js";
import { rankAllPlayers } from "./rank-stuff/Ranking.js";

export async function competitionRunMain(compID, exportfilename, TEMP_DIR){
    await getPlayerGainsFromPeriod(compID, exportfilename, TEMP_DIR);
}

export async function fileReadMain(filename, exportfilename, TEMP_DIR){
    await combineDataAndWriteToFile(filename, exportfilename, TEMP_DIR);
}

export async function skillweightsMain(filename, exportfilename, TEMP_DIR){
    await getAllPlayerWeights(filename, exportfilename, TEMP_DIR);
}

export async function rankingMain(filename, exportfilename, TEMP_DIR){
    await rankAllPlayers(filename, exportfilename, TEMP_DIR);
}

// ---------------------------------------------------- //
//  uncomment and use one function at a time, in order from top to bottom, or as needed
// ---------------------------------------------------- //

// First (creates raw_data.json)
competitionRunMain(109642, 'raw_data', 'json-stuff');

// Second (cleans data and creates cleaned_data.json)
// fileReadMain('raw_data', 'cleaned_data', 'json-stuff');

// Third (applies weights to data and creates skill_weights.json)
// skillweightsMain('cleaned_data', 'skill_weights', 'json-stuff');

// Last (ranks players based on weights and creates ranked_players.json)
// rankingMain('skill_weights', 'ranked_players', 'json-stuff');