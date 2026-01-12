import { getPlayerGainsFromPeriod } from "./api-stuff/getData";
import { combineDataAndWriteToFile } from "./data-stuff/DataCleaning";
import { getAllPlayerWeights } from "./rank-stuff/AllWeightsToFile";
import { rankAllPlayers } from "./rank-stuff/Ranking";

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
    await rankAllPlayers(filename, exportfilename, TEMP_DIR)
}
