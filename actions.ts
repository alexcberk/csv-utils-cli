import { convertCsvToMatrix, convertMatrixToCsvString, readFileAsString } from "./utils";

export const COMMANDS: Record<string, any> = {
  'help': help,
  'column': modifyColumn,
}

export async function help() {
  console.log('Available commands:')
  Object.keys(COMMANDS).forEach(c => console.log('-', c));
  process.exit(0)
}

export async function modifyColumn(...args: string[]) {
  const filePath = args[0];
  const tntValue = parseInt(args[1]);

  console.log(`Processing file ${filePath}...`);
  const file = await readFileAsString(filePath);
  const matrix = convertCsvToMatrix(file);

  // set tnt to 11, skip header row
  matrix.forEach((row, i) => i !== 0 ? row[5] = String(tntValue) : {})

  const updatedFile = convertMatrixToCsvString(matrix);

  const newFile = filePath.replace('.csv', `-${tntValue}.csv`);

  console.log(`Writing new file ${newFile}...`);
  await Bun.write(`${newFile}`, updatedFile);
  

  console.log(`Complete.`);
  process.exit(0)
}