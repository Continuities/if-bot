import yargs from 'yargs';
import fs from 'fs';
import streamIterator from './stream-iterator.mjs';
import tokenizer from './tokenizer.mjs';

const argv = yargs
    .usage('Usage: $0 --corpus [path] --out [path]')
    .alias('c', 'corpus')
    .alias('o', 'out')
    .demandOption(['corpus', 'out'])
    .argv;

const stream = fs.createReadStream(argv.c, {
  encoding: 'utf8',
  fd: null,
});

stream.on('readable', () => {
  const iter = tokenizer(streamIterator(stream), ['\n', ' ']);
  for (let token of iter) {
    console.log(token);
  }
});

