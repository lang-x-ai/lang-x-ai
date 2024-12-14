import { InputStream } from "./inputStream.js";
import { TokenStream } from "./lexer.js";
import { parse } from "./parser.js";
import { translate } from "./translator.js";

// A simple print function that logs arguments to the console and calls a callback
const print = function (k) {
  console.log([].slice.call(arguments, 1).join(" "));
  k(false);
};

// Function to read from standard input and pass the input to a callback
function readStdin(callback) {
  let text = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("readable", function () {
    const chunk = process.stdin.read();
    if (chunk) text += chunk;
  });
  process.stdin.on("end", function () {
    callback(text);
  });
}

// Main function to process the input code
readStdin(async function (code) {
  // Parse the input code into an abstract syntax tree (AST)
  code = `
  print_range = λ(a, b) if a <= b {
          print(a);
          if a + 1 <= b {
            print(", ");
            print_range(a + 1, b);
          } else println("");
        };
        print_range(1, 10);

      `;
  const ast = parse(TokenStream(InputStream(code)));
  console.log(JSON.stringify(ast, null, 2));

  const generateAIResponse = await translate(JSON.stringify(ast, null, 2));
  console.log(generateAIResponse);

  // // Convert the AST to continuation-passing style (CPS)
  // const cps = to_cps(ast, function (x) {
  //   return {
  //     type: "call",
  //     func: { type: "var", value: "Î²_TOPLEVEL" },
  //     args: [x],
  //   };
  // });

  // // Optimize the CPS representation
  // const opt = optimize(cps);

  // // Generate JavaScript code from the optimized CPS
  // let jsc = make_js(opt);
});
