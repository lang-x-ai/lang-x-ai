import fs from "fs";
import path from "path";
import { tokenize } from "./lexer.js";
import { parse } from "./parser.js";
import { translate } from "./translator.js";

async function cli() {
    const [, , source, outputArg] = process.argv;


    // Ensure source file is provided
    if (!source) {
        console.error("Usage: node src/cli.js <source.xl> [output]");
        process.exit(1);
    }

    // Ensure the source file has a .zs extension
    if (!source.endsWith(".xl")) {
        console.error("Error: Source file must have a .xl extension");
        process.exit(1);
    }

    // Resolve the absolute path of the source file
    const sourcePath = path.resolve(source);

    // Check if the source file exists
    if (!fs.existsSync(sourcePath)) {
        console.error(`Error: Source file not found at "${sourcePath}"`);
        process.exit(1);
    }


    //Need to add for py, java

    // Determine output file name and ensure it has a .js extension
    const output = outputArg?.endsWith(".js")
        ? outputArg
        : `${outputArg || "output"}.js`;
    const outputPath = path.resolve(output);

    try {
        // Read source file
        const code = fs.readFileSync(sourcePath, "utf-8");

        // Tokenize the code
        const tokens = tokenize(code);

        // Parse tokens into data
        const parsedData = parse(tokens);

        // Translate parsed data into target code
        const generatedCode = await translate(parsedData);

        // Write generated code to the output file
        fs.writeFileSync(outputPath, generatedCode);
       
    } catch (error) {
        console.error("Error during processing:", error.message);
        console.error("Stack Trace:", error.stack);
        process.exit(1);
    }
}

cli();
