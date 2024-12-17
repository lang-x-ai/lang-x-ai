/* -----[ the parser ]----- */

// Export the parse function
export function parse(input) {
  // Define operator precedence
  var PRECEDENCE = {
    "=": 1,
    "||": 2,
    "&&": 3,
    "<": 7,
    ">": 7,
    "<=": 7,
    ">=": 7,
    "==": 7,
    "!=": 7,
    "+": 10,
    "-": 10,
    "*": 20,
    "/": 20,
    "%": 20,
  };

  // Start parsing from the top level
  return parse_toplevel();

  // Check if the next token is a punctuation
  function is_punc(ch) {
    var tok = input.peek();
    return tok && tok.type == "punc" && (!ch || tok.value == ch) && tok;
  }

  // Check if the next token is a keyword
  function is_kw(kw) {
    var tok = input.peek();
    return tok && tok.type == "kw" && (!kw || tok.value == kw) && tok;
  }

  // Check if the next token is an operator
  function is_op(op) {
    var tok = input.peek();
    return tok && tok.type == "op" && (!op || tok.value == op) && tok;
  }

  // Skip a punctuation token
  function skip_punc(ch) {
    if (is_punc(ch)) input.next();
    else input.croak('Expecting punctuation: "' + ch + '"');
  }

  // Skip a keyword token
  function skip_kw(kw) {
    if (is_kw(kw)) input.next();
    else input.croak('Expecting keyword: "' + kw + '"');
  }

  // Skip an operator token
  function skip_op(op) {
    if (is_op(op)) input.next();
    else input.croak('Expecting operator: "' + op + '"');
  }

  // Handle unexpected tokens
  function unexpected() {
    input.croak("Unexpected token: " + JSON.stringify(input.peek()));
  }

  // Parse binary expressions
  function maybe_binary(left, my_prec) {
    var tok = is_op();
    if (tok) {
      var his_prec = PRECEDENCE[tok.value];
      if (his_prec > my_prec) {
        input.next();
        return maybe_binary(
          {
            type: tok.value == "=" ? "assign" : "binary",
            operator: tok.value,
            left: left,
            right: maybe_binary(parse_atom(), his_prec),
          },
          my_prec
        );
      }
    }
    return left;
  }

  // Parse delimited expressions
  function delimited(start, stop, separator, parser) {
    var a = [],
      first = true;
    skip_punc(start);
    while (!input.eof()) {
      if (is_punc(stop)) break;
      if (first) first = false;
      else skip_punc(separator);
      if (is_punc(stop)) break;
      a.push(parser());
    }
    skip_punc(stop);
    return a;
  }

  // Parse function calls
  function parse_call(func) {
    return {
      type: "call",
      func: func,
      args: delimited("(", ")", ",", parse_expression),
    };
  }

  // Parse variable names
  function parse_varname() {
    var name = input.next();
    if (name.type != "var") input.croak("Expecting variable name");
    return name.value;
  }

  // Parse variable definitions
  function parse_vardef() {
    var name = parse_varname(),
      def;
    if (is_op("=")) {
      input.next();
      def = parse_expression();
    }
    return { name: name, def: def };
  }

  // Parse 'let' expressions
  function parse_let() {
    skip_kw("let");
    if (input.peek().type == "var") {
      var name = input.next().value;
      var defs = delimited("(", ")", ",", parse_vardef);
      return {
        type: "call",
        func: {
          type: "func",
          name: name,
          vars: defs.map(function (def) {
            return def.name;
          }),
          body: parse_expression(),
        },
        args: defs.map(function (def) {
          return def.def || FALSE;
        }),
      };
    }
    return {
      type: "let",
      vars: delimited("(", ")", ",", parse_vardef),
      body: parse_expression(),
    };
  }

  // Parse 'if' expressions
  function parse_if() {
    skip_kw("if");
    var cond = parse_expression();
    if (!is_punc("{")) skip_kw("then");
    var then = parse_expression();
    var ret = {
      type: "if",
      cond: cond,
      then: then,
    };
    if (is_kw("else")) {
      input.next();
      ret.else = parse_expression();
    }
    return ret;
  }

  // Parse func expressions
  function parse_lambda() {
    return {
      type: "func",
      name: input.peek().type == "var" ? input.next().value : null,
      vars: delimited("(", ")", ",", parse_varname),
      body: parse_expression(),
      prompt: is_kw("prompt") ? parse_prompt() : null, // Check for prompt
    };
  }

  // Parse prompt expressions
  function parse_prompt() {
    skip_kw("prompt"); // Ensure the next token is the "prompt" keyword
    var promptString = input.next();
    if (promptString.type != "str") {
      input.croak("Expecting a string after 'prompt'");
    }
    return {
      type: "prompt",
      value: promptString.value,
    };
  }

  // Parse boolean literals
  function parse_bool() {
    return {
      type: "bool",
      value: input.next().value == "true",
    };
  }

  // Parse raw JavaScript code
  function parse_raw() {
    skip_kw("js:raw");
    if (input.peek().type != "str")
      input.croak("js:raw must be a plain string");
    return {
      type: "raw",
      code: input.next().value,
    };
  }

  // Parse potential function calls
  function maybe_call(expr) {
    expr = expr();
    return is_punc("(") ? parse_call(expr) : expr;
  }

  // Parse atomic expressions
  function parse_atom() {
    return maybe_call(function () {
      if (is_punc("(")) {
        input.next();
        var exp = parse_expression();
        skip_punc(")");
        return exp;
      }
      if (is_punc("{")) return parse_prog();
      if (is_op("!")) {
        input.next();
        return {
          type: "not",
          body: parse_atom(),
        };
      }
      if (is_kw("let")) return parse_let();
      if (is_kw("if")) return parse_if();
      if (is_kw("true") || is_kw("false")) return parse_bool();
      if (is_kw("js:raw")) return parse_raw();
      if (is_kw("func") || is_kw("λ")) {
        input.next();
        return parse_lambda();
      }
      if (is_kw("prompt")) return parse_prompt();
      var tok = input.next();
      if (tok.type == "var" || tok.type == "num" || tok.type == "str")
        return tok;
      unexpected();
    });
  }

  // Parse the top-level program
  function parse_toplevel() {
    var prog = [];
    while (!input.eof()) {
      prog.push(parse_expression());
      if (!input.eof()) skip_punc(";");
    }
    return { type: "prog", prog: prog };
  }

  // Parse program blocks
  function parse_prog() {
    var prog = delimited("{", "}", ";", parse_expression);
    if (prog.length == 0) return FALSE;
    if (prog.length == 1) return prog[0];
    return { type: "prog", prog: prog };
  }

  // Parse general expressions
  function parse_expression() {
    return maybe_call(function () {
      return maybe_binary(parse_atom(), 0);
    });
  }
}
