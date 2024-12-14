// TokenStream handles tokenizing the input stream
export function TokenStream(input) {
  var current = null;
  var keywords = " if then else lambda λ true false prompt";
  return {
    next: next,
    peek: peek,
    eof: eof,
    croak: input.croak,
  };

  // Checks if a string is a keyword
  function is_keyword(x) {
    return keywords.indexOf(" " + x + " ") >= 0;
  }

  // Checks if a character is a digit
  function is_digit(ch) {
    return /[0-9]/i.test(ch);
  }

  // Checks if a character can start an identifier
  function is_id_start(ch) {
    return /[a-zλ_]/i.test(ch);
  }

  // Checks if a character can be part of an identifier
  function is_id(ch) {
    return is_id_start(ch) || "?!-<>=0123456789".indexOf(ch) >= 0;
  }

  // Checks if a character is an operator
  function is_op_char(ch) {
    return "+-*/%=&|<>!".indexOf(ch) >= 0;
  }

  // Checks if a character is punctuation
  function is_punc(ch) {
    return ",;(){}[]".indexOf(ch) >= 0;
  }

  // Checks if a character is whitespace
  function is_whitespace(ch) {
    return " \t\n".indexOf(ch) >= 0;
  }

  // Reads characters while a predicate is true
  function read_while(predicate) {
    var str = "";
    while (!input.eof() && predicate(input.peek())) str += input.next();
    return str;
  }

  // Reads a number token
  function read_number() {
    var has_dot = false;
    var number = read_while(function (ch) {
      if (ch == ".") {
        if (has_dot) return false;
        has_dot = true;
        return true;
      }
      return is_digit(ch);
    });
    return { type: "num", value: parseFloat(number) };
  }

  // Reads an identifier token
  function read_ident() {
    var id = read_while(is_id);
    return {
      type: is_keyword(id) ? "kw" : "var",
      value: id,
    };
  }

  // Reads an escaped string
  function read_escaped(end) {
    var escaped = false,
      str = "";
    input.next();
    while (!input.eof()) {
      var ch = input.next();
      if (escaped) {
        str += ch;
        escaped = false;
      } else if (ch == "\\") {
        escaped = true;
      } else if (ch == end) {
        break;
      } else {
        str += ch;
      }
    }
    return str;
  }

  // Reads a string token
  function read_string() {
    return { type: "str", value: read_escaped('"') };
  }

  // Skips a comment
  function skip_comment() {
    read_while(function (ch) {
      return ch != "\n";
    });
    input.next();
  }

  // Reads the next token
  function read_next() {
    read_while(is_whitespace);
    if (input.eof()) return null;
    var ch = input.peek();
    if (ch == "#") {
      skip_comment();
      return read_next();
    }
    if (ch == '"') return read_string();
    if (is_digit(ch)) return read_number();
    if (is_id_start(ch)) return read_ident();
    if (is_punc(ch))
      return {
        type: "punc",
        value: input.next(),
      };
    if (is_op_char(ch))
      return {
        type: "op",
        value: read_while(is_op_char),
      };
    input.croak("Can't handle character: " + ch);
  }

  // Peeks at the next token
  function peek() {
    return current || (current = read_next());
  }

  // Returns the next token
  function next() {
    var tok = current;
    current = null;
    return tok || read_next();
  }

  // Checks if the end of the token stream is reached
  function eof() {
    return peek() == null;
  }
}
