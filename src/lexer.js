class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

const TokenType = {
  // Keywords
  SUGOD: "SUGOD",
  KATAPUSAN: "KATAPUSAN",
  MUGNA: "MUGNA",
  IPAKITA: "IPAKITA",
  UG: "UG",
  DILI: "DILI",

  // Data Types
  NUMERO: "NUMERO",
  LETRA: "LETRA",
  TINUOD: "TINUOD",

  // Operators
  PLUS: "+",
  MINUS: "-",
  MULTIPLY: "*",
  DIVIDE: "/",
  MODULO: "%",
  ASSIGN: "=",
  EQUALS: "==",
  NOT_EQUALS: "<>",
  GREATER_THAN: ">",
  LESS_THAN: "<",
  GREATER_EQUALS: ">=",
  LESS_EQUALS: "<=",

  // Others
  IDENTIFIER: "IDENTIFIER",
  NUMBER: "NUMBER",
  STRING: "STRING",
  NEWLINE: "NEWLINE",
  COLON: ":",
  EOF: "EOF",
  CONCATENATOR: "&",
};

class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.currentChar = this.input[this.position];
  }

  advance() {
    this.position++;
    this.currentChar =
      this.position < this.input.length ? this.input[this.position] : null;
  }

  skipWhitespace() {
    while (this.currentChar && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  getNumber() {
    let result = "";
    while (this.currentChar && /\d/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return new Token(TokenType.NUMBER, parseInt(result));
  }

  getIdentifier() {
    let result = "";
    while (this.currentChar && /[a-zA-Z_0-9]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }

    switch (result.toUpperCase()) {
      case "SUGOD":
        return new Token(TokenType.SUGOD, result);
      case "KATAPUSAN":
        return new Token(TokenType.KATAPUSAN, result);
      case "MUGNA":
        return new Token(TokenType.MUGNA, result);
      case "IPAKITA":
        return new Token(TokenType.IPAKITA, result);
      case "NUMERO":
        return new Token(TokenType.NUMERO, result);
      case "LETRA":
        return new Token(TokenType.LETRA, result);
      case "TINUOD":
        return new Token(TokenType.TINUOD, result);
      case "UG":
        return new Token(TokenType.UG, result);
      case "DILI":
        return new Token(TokenType.DILI, result);
      case "TINUOD":
        return new Token(TokenType.BOOLEAN, true);
      case "SAYOP":
        return new Token(TokenType.BOOLEAN, false);
      default:
        return new Token(TokenType.IDENTIFIER, result);
    }
  }

  skipComment() {
    while (this.currentChar && this.currentChar !== "\n") {
      this.advance();
    }
  }

  getNextToken() {
    while (this.currentChar) {
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

      if (this.currentChar === "-" && this.input[this.position + 1] === "-") {
        this.advance();
        this.advance();
        this.skipComment();
        continue;
      }

      if (/\d/.test(this.currentChar)) {
        return this.getNumber();
      }

      if (/[a-zA-Z_]/.test(this.currentChar)) {
        return this.getIdentifier();
      }

      if (this.currentChar === '"') {
        return this.getString();
      }

      switch (this.currentChar) {
        case ":":
          this.advance();
          return new Token(TokenType.COLON, ":");
        case "+":
          this.advance();
          return new Token(TokenType.PLUS, "+");
        case "-":
          this.advance();
          return new Token(TokenType.MINUS, "-");
        case "*":
          this.advance();
          return new Token(TokenType.MULTIPLY, "*");
        case "/":
          this.advance();
          return new Token(TokenType.DIVIDE, "/");
        case "%":
          this.advance();
          return new Token(TokenType.MODULO, "%");
        case "=":
          this.advance();
          if (this.currentChar === "=") {
            this.advance();
            return new Token(TokenType.EQUALS, "==");
          }
          return new Token(TokenType.ASSIGN, "=");
        case "&":
          this.advance();
          return new Token(TokenType.CONCATENATOR, "&");
        case "<":
          this.advance();
          if (this.currentChar === ">") {
            this.advance();
            return new Token(TokenType.NOT_EQUALS, "<>");
          } else if (this.currentChar === "=") {
            this.advance();
            return new Token(TokenType.LESS_EQUALS, "<=");
          }
          return new Token(TokenType.LESS_THAN, "<");
        case ">":
          this.advance();
          if (this.currentChar === "=") {
            this.advance();
            return new Token(TokenType.GREATER_EQUALS, ">=");
          }
          return new Token(TokenType.GREATER_THAN, ">");
        case "[":
          this.advance();
          let escapeContent = "";
          while (this.currentChar && this.currentChar !== "]") {
            escapeContent += this.currentChar;
            this.advance();
          }
          this.advance();
          return new Token(TokenType.ESCAPE_SEQUENCE, escapeContent);
      }

      throw new Error(`Invalid character: ${this.currentChar}`);
    }

    return new Token(TokenType.EOF, null);
  }

  getString() {
    let result = "";
    this.advance();
    while (this.currentChar && this.currentChar !== '"') {
      result += this.currentChar;
      this.advance();
    }
    this.advance();
    return new Token(TokenType.STRING, result);
  }
}

module.exports = { Lexer, Token, TokenType };
