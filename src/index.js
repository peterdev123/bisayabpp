const { Lexer } = require("./lexer");
const { Parser } = require("./parser");
const { Interpreter } = require("./interpreter");

function run(input) {
  try {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const tree = parser.program();
    const interpreter = new Interpreter();

    interpreter.visit(tree);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

const fs = require("fs");

// For testing
try {
  const program = fs.readFileSync("../test/hello.bpp", "utf8");
  run(program);
} catch (error) {
  console.error("Error reading file:", error.message);
}

module.exports = { run };
