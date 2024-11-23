import fs from "fs";
import { tokenize } from "./lexer";
import { parse } from "./parser";
import { translate } from "./translator";

export async function main() {
    const [, , source, output] = process.argv;
    if (!source) throw new Error("Source .zs file required");

    // Ensure the source file has a .zs extension
    if (!source.endsWith(".zs")) {
        throw new Error("Source file must have a .zs extension");
    }

    const code = fs.readFileSync(source, "utf-8");
    const tokens = tokenize(code);
    const parsedData = parse(tokens);
    const generatedCode = await translate(parsedData);

    const outputFile = output || "output";
    fs.writeFileSync(outputFile, generatedCode);
    console.log(`Code generated and saved to ${outputFile}`);
}


