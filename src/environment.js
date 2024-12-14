// parse(TokenStream(InputStream

import { InputStream } from "./inputStream.js";
import { TokenStream } from "./lexer.js";
import { parse } from "./parser.js";

// Environment for variable storage and lookup
function Environment(parent) {
  this.vars = Object.create(parent ? parent.vars : null);
  this.parent = parent;
}
Environment.prototype = {
  // Extends the environment with a new scope
  extend: function () {
    return new Environment(this);
  },

  // Looks up a variable in the environment
  lookup: function (name) {
    var scope = this;
    while (scope) {
      if (Object.prototype.hasOwnProperty.call(scope.vars, name)) return scope;
      scope = scope.parent;
    }
  },

  // Gets a variable's value
  get: function (name) {
    if (name in this.vars) return this.vars[name];
    throw new Error("Undefined variable " + name);
  },

  // Sets a variable's value
  set: function (name, value) {
    var scope = this.lookup(name);
    if (!scope && this.parent) throw new Error("Undefined variable " + name);
    return ((scope || this).vars[name] = value);
  },

  // Defines a new variable
  def: function (name, value) {
    return (this.vars[name] = value);
  },
};

// Evaluates the AST in a given environment
function evaluate(exp, env) {
  switch (exp.type) {
    case "num":
    case "str":
    case "bool":
      return exp.value;

    case "var":
      return env.get(exp.value);

    case "assign":
      if (exp.left.type != "var")
        throw new Error("Cannot assign to " + JSON.stringify(exp.left));
      return env.set(exp.left.value, evaluate(exp.right, env));

    case "binary":
      return apply_op(
        exp.operator,
        evaluate(exp.left, env),
        evaluate(exp.right, env)
      );

    case "lambda":
      return make_lambda(env, exp);

    case "if":
      var cond = evaluate(exp.cond, env);
      if (cond !== false) return evaluate(exp.then, env);
      return exp.else ? evaluate(exp.else, env) : false;

    case "prog":
      var val = false;
      exp.prog.forEach(function (exp) {
        val = evaluate(exp, env);
      });
      return val;

    case "call":
      var func = evaluate(exp.func, env);
      return func.apply(
        null,
        exp.args.map(function (arg) {
          return evaluate(arg, env);
        })
      );

    default:
      throw new Error("I don't know how to evaluate " + exp.type);
  }
}

// Applies a binary operator to two operands
function apply_op(op, a, b) {
  function num(x) {
    if (typeof x != "number") throw new Error("Expected number but got " + x);
    return x;
  }
  function div(x) {
    if (num(x) == 0) throw new Error("Divide by zero");
    return x;
  }
  switch (op) {
    case "+":
      return num(a) + num(b);
    case "-":
      return num(a) - num(b);
    case "*":
      return num(a) * num(b);
    case "/":
      return num(a) / div(b);
    case "%":
      return num(a) % div(b);
    case "&&":
      return a !== false && b;
    case "||":
      return a !== false ? a : b;
    case "<":
      return num(a) < num(b);
    case ">":
      return num(a) > num(b);
    case "<=":
      return num(a) <= num(b);
    case ">=":
      return num(a) >= num(b);
    case "==":
      return a === b;
    case "!=":
      return a !== b;
  }
  throw new Error("Can't apply operator " + op);
}

// Creates a lambda function
function make_lambda(env, exp) {
  function lambda() {
    var names = exp.vars;
    var scope = env.extend();
    for (var i = 0; i < names.length; ++i)
      scope.def(names[i], i < arguments.length ? arguments[i] : false);
    return evaluate(exp.body, scope);
  }
  return lambda;
}

/* -----[ entry point for NodeJS ]----- */

// Global environment setup
var globalEnv = new Environment();

// Define a timing function in the global environment
globalEnv.def("time", function (func) {
  try {
    console.time("time");
    return func();
  } finally {
    console.timeEnd("time");
  }
});

// Node.js specific code for reading from stdin and executing code
if (typeof process != "undefined")
  (function () {
    // Use the imported 'util' module
    globalEnv.def("println", function (val) {
      console.log(val); // Updated from util.puts to console.log
    });
    globalEnv.def("print", function (val) {
      process.stdout.write(String(val));
    });
    var code = `
        print_range = λ(a, b) if a <= b {
          print(a);
          if a + 1 <= b {
            print(", ");
            print_range(a + 1, b);
          } else println("");
        };
        print_range(1, 10);
      `;
    process.stdin.setEncoding("utf8");
    process.stdin.on("readable", function () {
      var chunk = process.stdin.read();
      if (chunk) code += chunk;
    });
    process.stdin.on("end", function () {
      var ast = parse(TokenStream(InputStream(code)));
      evaluate(ast, globalEnv);
    });
  })();
