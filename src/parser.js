/*
  Parses the token stream into an abstract syntax tree (AST)
*/
export function parse(input) {
  /*
    Define operator precedence levels
  */
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

  /*
    Define a constant for a false boolean value
  */
  var FALSE = { type: "bool", value: false };

  /*
    Start parsing from the top-level
  */
  return parse_toplevel();

  /*
    Checks if the next token is a punctuation
  */
  function is_punc(ch) {
    var tok = input.peek();
    return tok && tok.type == "punc" && (!ch || tok.value == ch) && tok;
  }

  /*
    Checks if the next token is a keyword
  */
  function is_kw(kw) {
    var tok = input.peek();
    return tok && tok.type == "kw" && (!kw || tok.value == kw) && tok;
  }

  /*
    Checks if the next token is an operator
  */
  function is_op(op) {
    var tok = input.peek();
    return tok && tok.type == "op" && (!op || tok.value == op) && tok;
  }

  /*
    Skips a punctuation token
  */
  function skip_punc(ch) {
    if (is_punc(ch)) input.next();
    else input.croak('Expecting punctuation: "' + ch + '"');
  }

  /*
    Skips a keyword token
  */
  function skip_kw(kw) {
    if (is_kw(kw)) input.next();
    else input.croak('Expecting keyword: "' + kw + '"');
  }

  /*
    Skips an operator token
  */
  function skip_op(op) {
    if (is_op(op)) input.next();
    else input.croak('Expecting operator: "' + op + '"');
  }

  /*
    Throws an error for unexpected tokens
  */
  function unexpected() {
    input.croak("Unexpected token: " + JSON.stringify(input.peek()));
  }

  /*
    Parses binary expressions
  */
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

  /*
    Parses delimited expressions
  */
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

  /*
    Parses function calls
  */
  function parse_call(func) {
    return {
      type: "call",
      func: func,
      args: delimited("(", ")", ",", parse_expression),
    };
  }

  /*
    Parses variable names
  */
  function parse_varname() {
    var name = input.next();
    if (name.type != "var") input.croak("Expecting variable name");
    return name.value;
  }

  /*
    Parses if expressions
  */
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

  /*
    Parses lambda expressions
  */
  function parse_lambda() {
    return {
      type: "lambda",
      vars: delimited("(", ")", ",", parse_varname),
      body: parse_expression(),
    };
  }

  /*
    Parses boolean literals
  */
  function parse_bool() {
    return {
      type: "bool",
      value: input.next().value == "true",
    };
  }

  /*
    Parses expressions that might be function calls
  */
  function maybe_call(expr) {
    expr = expr();
    return is_punc("(") ? parse_call(expr) : expr;
  }

  /*
    Parses atomic expressions
  */
  function parse_atom() {
    return maybe_call(function () {
      if (is_punc("(")) {
        input.next();
        var exp = parse_expression();
        skip_punc(")");
        return exp;
      }
      if (is_punc("{")) return parse_prog();
      if (is_kw("if")) return parse_if();
      if (is_kw("true") || is_kw("false")) return parse_bool();
      if (is_kw("lambda") || is_kw("λ")) {
        input.next();
        return parse_lambda();
      }
      var tok = input.next();
      if (tok.type == "var" || tok.type == "num" || tok.type == "str")
        return tok;
      unexpected();
    });
  }

  /*
    Parses the top-level program
  */
  function parse_toplevel() {
    var prog = [];
    while (!input.eof()) {
      prog.push(parse_expression());
      if (!input.eof()) skip_punc(";");
    }
    return { type: "prog", prog: prog };
  }

  /*
    Parses program blocks
  */
  function parse_prog() {
    var prog = delimited("{", "}", ";", parse_expression);
    if (prog.length == 0) return FALSE;
    if (prog.length == 1) return prog[0];
    return { type: "prog", prog: prog };
  }

  /*
    Parses expressions
  */
  function parse_expression() {
    return maybe_call(function () {
      return maybe_binary(parse_atom(), 0);
    });
  }
}
