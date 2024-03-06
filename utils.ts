import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';


export const convertCsvToMatrix = (csvString: string): string[][] => {
  return parse(csvString, {
    bom: true,
    columns: false,
    trim: true,
    relax_column_count: true
  });
}
///
export const snakeToCamel = (str:string)=>{
  const sections = str.split('_');
  let camelString = sections[0];
  for(let i=1;i<sections.length;i++){
    camelString += sections[i][0].toUpperCase() +sections[i].slice(1);
  }
  return camelString;
}
export const csvMatrixToObjectList = (headers: string[], matrix: string[][]) => {
 return matrix.map(row => {
    return row.reduce((prev, val, idx) => {
        return { ...prev, [headers[idx]]: val };
    }, {});
  });
}

export const convertMatrixToCsvString = (matrix: any[][]): string => {
  return stringify(matrix).trim();
}

export const rowObjectListToMatrix = (rowList: Record<any, any>[]): any[][] => {
  const headerRow = Object.keys(rowList[0]);
  const csvMatrix = rowList.map(val => Object.values(val));
  csvMatrix.unshift(headerRow);
  return csvMatrix;
}

export const readFileAsString = async (fileName: string): Promise<string> => {
  const file = Bun.file(fileName);

  return await file.text();
};

export const readFirstNRowsOfCSVFile = async (file: File, rowCount: number = 2, chunkSize: number = 5000) => {
  let i = 0;
  let csvString = '';
  while (csvString.split('\n').length <= rowCount) {
    const chunk = await file.slice(i * chunkSize, Math.min((i * chunkSize + chunkSize), file.size));
    const chunkString = await chunk.text();
    csvString += chunkString;
    i+=1;
  }
  // only return first n rows regardless of how much of the csv was actually loaded
  return csvString.split('\n').slice(0, rowCount).join('\n');
}

const validateRequiredHeaders = (row: string[], headers: string[]) => {
  const usedHeaders = new Set(row);
  const missingHeaders: string[] = [];
  headers.forEach((h: string) => {
    if (!usedHeaders.has(h)) {
      missingHeaders.push(h);
    }
  });
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers:${missingHeaders.join(', ')}`);
  }
}
const validateProvidedHeaders = (row: string[], headers: string[]) => {
  const allowedHeaders = new Set(headers);
  const unknownHeaders: string[] = [];
  row.forEach((h) => {
    if (!allowedHeaders.has(h)) {
      unknownHeaders.push(h);
    }
  })
  if (unknownHeaders.length) {
    throw new Error(`Recieved following unknown headers:${unknownHeaders.join(', ')}`);
  }
}
export const validateCsvHeaders = (requiredHeaders: string[], providedHeaders: string[]) => async (file: any) => {
  const csvString = await readFirstNRowsOfCSVFile(file, 1);
  const matrix = convertCsvToMatrix(csvString);
  const headerRow = matrix[0];
  validateRequiredHeaders(headerRow, requiredHeaders);
  validateProvidedHeaders(headerRow, providedHeaders);
}