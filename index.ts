import { parseArgs } from "util";
import { convertCsvToMatrix, convertMatrixToCsvString, readFileAsString } from "./utils";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {},
  strict: true,
  allowPositionals: true,
}) as any;

if (positionals.length < 4) {
  console.error(`Usage: bun start "/file/path/name.csv" 7`);
  process.exit(1);
}

const filePath = positionals[2];
const tntValue = parseInt(positionals[3]);
const file = await readFileAsString(filePath);
const matrix = convertCsvToMatrix(file);

// set tnt to 11, skip header row
matrix.forEach((row, i) => i !== 0 ? row[5] = String(tntValue) : {})

const updatedFile = convertMatrixToCsvString(matrix);

await Bun.write(`${filePath.replace('.csv', `-${tntValue}.csv`)}`, updatedFile);

process.exit(0)