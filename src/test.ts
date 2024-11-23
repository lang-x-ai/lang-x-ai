import { main } from "./cli";

// Simulate command line arguments
process.argv = ["node", "test.js", "source.zs", "output.js"];

// Call the main function
main().catch(console.error); 