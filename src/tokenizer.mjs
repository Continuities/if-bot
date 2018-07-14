/**
 * Turns a character-by-character iterator into an iterator of tokens.
 * @param {Iterable} iterable The iterable to tokenize
 * @param {Array<String>} separators Characters to tokenize on
 */
export default function(iterable, separators) {
  return {
    [Symbol.iterator]: function*() {
      let token = '';
      for (let char of iterable) {
        if (separators.includes(char)) {
          if (token) {
            yield token;
          }
          token = '';
        }
        else {
          token += char;
        }
      }
    }
  };
}