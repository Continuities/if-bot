import yargs from 'yargs';
import fs from 'fs';
import streamIterator from './stream-iterator.mjs';
import tokenizer from './tokenizer.mjs';
import tokenWindow from './token-window.mjs';

const argv = yargs
    .usage('Usage: $0 --corpus [path] --out [path]')
    .alias('c', 'corpus')
    .alias('o', 'out')
    .alias('s', 'space')
    .default('space', 2)
    .demandOption(['corpus', 'out'])
    .argv;

const stream = fs.createReadStream(argv.c, {
  encoding: 'utf8',
  fd: null,
});

stream.on('readable', () => {
  console.log('Parsing corpus...');
  const iter = 
      // Slide our state-space window over the tokens
      tokenWindow(
        // Chunk characters into words
        tokenizer(
          // Iterate over the characters
          streamIterator(stream), 
          ['\n', ' ']
        ), 
        argv.space + 1
      );

  const counts = {};
  let done = true;
  for (let token of iter) {
    done = false;
    const key = token.slice(0, argv.space).join(' ');
    const value = token[token.length - 1];
    if (!counts[key]) {
      counts[key] = {
        next: {},
        total: 0
      };
    }
    counts[key].total++;
    counts[key].next[value] = (counts[key].next[value] || 0) + 1;
  }

  if (done) {
    return;
  }
  
  const output = {
    spaceSize: argv.space,
    counts
  };

  console.log('Writing output...');
  fs.writeFile(argv.out, JSON.stringify(output), () => {
    console.log('Done!');
  });
});

