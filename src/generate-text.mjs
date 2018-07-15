import yargs from 'yargs';
import fs from 'fs';
import markovChain from './markov-chain.mjs';

const argv = yargs
    .usage('Usage: $0 --model [path] --out [path]')
    .alias('m', 'model')
    .alias('o', 'out')
    .alias('v', 'verbose')
    .default('verbose', false)
    .demandOption(['model', 'out'])
    .argv;

function getModel(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(argv.model, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
}

function writeOutput(output) {
  return new Promise((resolve, reject) => {
    fs.writeFile(argv.out, output, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

async function run() {
  console.log('Loading model...');
  const model = await getModel(argv.model);

  console.log('Generating text...');
  const output = markovChain(model, argv.verbose ? console.log : null);

  argv.verbose && console.log(output);

  console.log(`Writing ${argv.out}`);
  await writeOutput(output);

  console.log('Done!');
}

run();