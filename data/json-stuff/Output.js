import fs from "fs/promises";
import path from "path";

// const CACHE_DIR = path.resolve("../json-stuff");

async function ensureCacheFile(fileName, initialData = [], TEMP_DIR) {
    const filePath = path.join(TEMP_DIR, `${fileName}.json`);
    try {
        await fs.access(filePath);
    } catch {
        await fs.writeFile(filePath, JSON.stringify(initialData, null, 2), "utf8");
        console.log(`Created new cache file: ${filePath}`);
    }
    return filePath;
}

export async function writeToFile(data, fileName, TEMP_DIR){
    const filePath = path.join(TEMP_DIR, `${fileName}.json`);
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
        console.log(`Data written to ${filePath}`);
    } catch (err) {
        console.error("Error writing file", err);
    }
}

export async function readFromFile(fileName){
    const filePath = await ensureCacheFile(fileName);
    try {
        const jsonData = await fs.readFile(filePath, "utf8");
        const data = JSON.parse(jsonData);
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("Error reading from file", err);
        return [];
    }
}

export function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}