import { parseArgs } from "util";
import { COMMANDS } from "./actions";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {},
  strict: true,
  allowPositionals: true,
}) as any;


if (positionals.length < 3) {
  console.error(`
  Usage: ./cm column /file/path/name.csv 7 my-new-value\n
  Use ./cm help for available commands.
  `);
  process.exit(1);
}

// console.log(positionals);

const command = positionals[2];

const action = COMMANDS[command];

if (!command) {
  console.error(`Unsupported Command ${command}.`)
}

await action(...positionals.slice(3));
