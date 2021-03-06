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
    .alias('v', 'verbose')
    .default('space', 2)
    .default('verbose', false)
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
    
    if (token.length < 2) {
      continue;
    }

    const key = token.slice(0, -1).join(' ');
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

  const transitions = Object.entries(counts).reduce((acc, [key, value]) => {
    acc[key] = Object.entries(value.next).reduce((ret, [to, count]) => {
      ret[to] = count / value.total;
      return ret;
    }, {});
    return acc;
  }, {});
  
  const output = {
    spaceSize: argv.space,
    transitions
  };

  argv.verbose && console.log(output);

  console.log('Writing output...');
  fs.writeFile(argv.out, JSON.stringify(output), () => {
    console.log('Done!');
  });
});

