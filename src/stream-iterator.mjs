/**
 * Turns a ReadableStream into an ES6 iterator that iterates a character
 * at a time. Sure, I could use NodeJS pipe, but I wanna do it this way.
 * 
 * @param {ReadableStream} stream The stream to iterate
 */
export default function(stream) {
  return {
    [Symbol.iterator]: function*() {
      let char;
      while (null !== (char = stream.read(1))) {
        yield char;
      }
    }
  };
}