const { TokenType } = require("./lexer");

class AST {}

class Program extends AST {
  constructor(statements) {
    super();
    this.statements = statements;
  }
}

class Boolean extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value;
  }
}

class UnaryOp extends AST {
  constructor(op, expr) {
    super();
    this.token = this.op = op;
    this.expr = expr;
  }
}

class Statement extends AST {}

class VarDeclaration extends Statement {
  constructor(varType, name, value) {
    super();
    this.varType = varType;
    this.name = name;
    this.value = value;
  }
}

class PrintStatement extends Statement {
  constructor(expressions) {
    super();
    this.expressions = expressions;
  }
}

class BinOp extends AST {
  constructor(left, op, right) {
    super();
    this.left = left;
    this.token = this.op = op;
    this.right = right;
  }
}

class CompareOp extends AST {
  constructor(left, op, right) {
    super();
    this.left = left;
    this.token = this.op = op;
    this.right = right;
  }
}

class Num extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value;
  }
}

class String extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value;
  }
}

class Var extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value;
  }
}

class EscapeSequence extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value;
  }
}

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
  }

  error(message) {
    throw new Error(`Parser error: ${message}`);
  }

  eat(tokenType) {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      this.error(`Expected ${tokenType} but got ${this.currentToken.type}`);
    }
  }

  program() {
    this.eat(TokenType.SUGOD);
    const statements = this.statementList();
    this.eat(TokenType.KATAPUSAN);
    return new Program(statements);
  }

  statementList() {
    const statements = [];

    while (
      this.currentToken.type !== TokenType.KATAPUSAN &&
      this.currentToken.type !== TokenType.EOF
    ) {
      if (
        this.currentToken.type === TokenType.MUGNA ||
        this.currentToken.type === TokenType.IPAKITA
      ) {
        statements.push(this.statement());
      } else if (
        this.currentToken.type === TokenType.NEWLINE ||
        this.currentToken.type === TokenType.DOLLAR
      ) {
        this.eat(this.currentToken.type);
      } else {
        this.currentToken = this.lexer.getNextToken();
      }
    }

    return statements;
  }

  statement() {
    switch (this.currentToken.type) {
      case TokenType.MUGNA:
        return this.varDeclaration();
      case TokenType.IPAKITA:
        return this.printStatement();
      default:
        this.error(`Unexpected token ${this.currentToken.type}`);
    }
  }

  varDeclaration() {
    this.eat(TokenType.MUGNA);
    const varType = this.currentToken.type;
    this.eat(varType);
    const name = this.currentToken.value;
    this.eat(TokenType.IDENTIFIER);
    this.eat(TokenType.ASSIGN);
    const value = this.expr();
    return new VarDeclaration(varType, name, value);
  }

  printStatement() {
    this.eat(TokenType.IPAKITA);
    this.eat(TokenType.COLON);
    const expressions = [this.expr()];

    while (this.currentToken.type === TokenType.CONCATENATOR) {
      this.eat(TokenType.CONCATENATOR);
      expressions.push(this.expr());
    }

    return new PrintStatement(expressions);
  }

  expr() {
    let node = this.term();

    while ([TokenType.PLUS, TokenType.MINUS].includes(this.currentToken.type)) {
      const token = this.currentToken;
      if (token.type === TokenType.PLUS) {
        this.eat(TokenType.PLUS);
      } else if (token.type === TokenType.MINUS) {
        this.eat(TokenType.MINUS);
      }
      node = new BinOp(node, token, this.term());
    }

    if (
      [
        TokenType.EQUALS,
        TokenType.NOT_EQUALS,
        TokenType.GREATER_THAN,
        TokenType.LESS_THAN,
        TokenType.GREATER_EQUALS,
        TokenType.LESS_EQUALS,
      ].includes(this.currentToken.type)
    ) {
      const token = this.currentToken;
      this.eat(token.type);
      node = new CompareOp(node, token, this.term());
    }

    if (this.currentToken.type === TokenType.ESCAPE_SEQUENCE) {
      const token = this.currentToken;
      this.eat(TokenType.ESCAPE_SEQUENCE);
      node = new EscapeSequence(token);
    }

    return node;
  }

  term() {
    let node = this.factor();

    while (
      [TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO].includes(
        this.currentToken.type
      )
    ) {
      const token = this.currentToken;
      if (token.type === TokenType.MULTIPLY) {
        this.eat(TokenType.MULTIPLY);
      } else if (token.type === TokenType.DIVIDE) {
        this.eat(TokenType.DIVIDE);
      } else if (token.type === TokenType.MODULO) {
        this.eat(TokenType.MODULO);
      }
      node = new BinOp(node, token, this.factor());
    }

    return node;
  }

  factor() {
    const token = this.currentToken;

    if (token.type === TokenType.DILI) {
      this.eat(TokenType.DILI);
      return new UnaryOp(token, this.factor());
    }

    if (token.type === TokenType.ESCAPE_SEQUENCE) {
      this.eat(TokenType.ESCAPE_SEQUENCE);
      return new EscapeSequence(token);
    }

    switch (token.type) {
      case TokenType.NUMBER:
        this.eat(TokenType.NUMBER);
        return new Num(token);
      case TokenType.STRING:
        this.eat(TokenType.STRING);
        return new String(token);
      case TokenType.BOOLEAN:
        this.eat(TokenType.BOOLEAN);
        return new Boolean(token);
      case TokenType.IDENTIFIER:
        this.eat(TokenType.IDENTIFIER);
        return new Var(token);
      default:
        this.error(`Unexpected token ${token.type}`);
    }
  }
}

module.exports = {
  Parser,
  Program,
  VarDeclaration,
  PrintStatement,
  BinOp,
  CompareOp,
  UnaryOp,
  Num,
  String,
  Boolean,
  Var,
};
