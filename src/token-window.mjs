/** The separator between corpus paragraphs */
export const SEPARATOR = '---';

/**
 * Turns an Iterable of tokens into an Iterable of adjacent token groups
 * @param {Iterable<String>} tokens The tokens to chunk
 * @param {number} space The size of the state space
 */
export default function(tokens, space) {
  let window = [];
  return {
    [Symbol.iterator]: function*() {
      for(let token of tokens) {
        window.push(token);
        if (window.length > space) {
          window.shift();
        }
        
        yield [...window];
        
        if (token === SEPARATOR) {
          window = [token];
        }
      }
    }
  };
}