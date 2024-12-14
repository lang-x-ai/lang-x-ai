/**
 * InputStream is a utility for reading characters from a string input.
 * It keeps track of the current position, line, and column in the input.
 *
 * @param {string} input - The string input to be processed.
 * @returns {Object} An object with methods to interact with the input stream.
 */
export function InputStream(input) {
  var pos = 0, // Current position in the input
    line = 1, // Current line number
    col = 0; // Current column number

  return {
    next: next, // Function to read the next character
    peek: peek, // Function to look at the next character without consuming it
    eof: eof, // Function to check if the end of the input is reached
    croak: croak, // Function to throw an error with the current position
  };

  /**
   * Reads the next character from the input and advances the position.
   * Updates line and column numbers accordingly.
   *
   * @returns {string} The next character in the input.
   */
  function next() {
    var ch = input.charAt(pos++);
    if (ch == "\n") line++, (col = 0);
    else col++;
    return ch;
  }

  /**
   * Returns the next character in the input without advancing the position.
   *
   * @returns {string} The next character in the input.
   */
  function peek() {
    return input.charAt(pos);
  }

  /**
   * Checks if the end of the input has been reached.
   *
   * @returns {boolean} True if the end of the input is reached, false otherwise.
   */
  function eof() {
    return peek() == "";
  }

  /**
   * Throws an error with a message and the current line and column numbers.
   *
   * @param {string} msg - The error message.
   * @throws {Error} An error with the provided message and position.
   */
  function croak(msg) {
    throw new Error(msg + " (" + line + ":" + col + ")");
  }
}
