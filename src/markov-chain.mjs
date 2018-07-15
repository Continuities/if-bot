import { SEPARATOR } from './token-window.mjs';

function getNextWord(key, stateModel, logger) {
  logger(`Getting word for key '${key}'`);
  const transitions = stateModel.transitions[key];
  logger(`Found transitions: ${JSON.stringify(transitions)}`);
  if (!transitions) {
    return SEPARATOR;
  }

  const probabilities = [];
  for (let [word, p] of Object.entries(transitions)) {
    const rollUnder = !probabilities.length ? p : p + probabilities[probabilities.length - 1][0];
    probabilities.push([rollUnder, word]);
  }

  logger(`Generated probabilities: ${JSON.stringify(probabilities)}`)
  
  const roll = Math.random();
  const pick = probabilities.find(([rollUnder]) => roll <= rollUnder);
  logger(`Rolled ${roll} to pick ${JSON.stringify(pick)}`);
  return !pick ? SEPARATOR : pick[1];
}

export default function(stateModel, logger) {
  logger = logger ? logger : () => {};

  const { spaceSize } = stateModel;
  logger(`Generating text with space-size of ${spaceSize}`);

  let output = '';
  let window = [SEPARATOR];
  let nextWord;
  while (SEPARATOR !== (nextWord = getNextWord(window.join(' '), stateModel, logger))) {
    logger(`Got next word '${nextWord}'`);
    output = `${output} ${nextWord}`;
    window.push(nextWord);
    window.length > spaceSize && window.shift();
  }

  return output;
}