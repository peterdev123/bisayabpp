// Main entry point for Bisaya++ Interpreter
const { Lexer } = require("./lexer");
const { Parser } = require("./parser");
const { Interpreter } = require("./interpreter");

function run(input) {
  try {
    // Create lexer instance
    const lexer = new Lexer(input);

    // Create parser instance with the lexer
    const parser = new Parser(lexer);

    // Parse the input into an AST
    const tree = parser.program();

    // Create interpreter instance
    const interpreter = new Interpreter();

    // Execute the AST
    interpreter.visit(tree);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

const fs = require("fs");

// Read and run the hello.bpp file
try {
  const program = fs.readFileSync("hello.bpp", "utf8");
  run(program);
} catch (error) {
  console.error("Error reading file:", error.message);
}

module.exports = { run };
