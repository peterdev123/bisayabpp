const { TokenType } = require("./lexer");

class Interpreter {
  constructor() {
    this.symbolTable = {};
  }

  error(message) {
    throw new Error(`Runtime error: ${message}`);
  }

  visitProgram(node) {
    for (const statement of node.statements) {
      this.visit(statement);
    }
  }

  visitVarDeclaration(node) {
    const value = this.visit(node.value);

    switch (node.varType) {
      case TokenType.NUMERO:
        if (typeof value !== "number") {
          this.error(`Expected NUMERO instead got ${typeof value}`);
        }
        break;
      case TokenType.LETRA:
        if (typeof value !== "string") {
          this.error(`Expected LETRA instead got ${typeof value}`);
        }
        break;
      case TokenType.TINUOD:
        if (typeof value !== "boolean") {
          this.error(`Expected TINUOD instead got ${typeof value}`);
        }
        break;
    }

    this.symbolTable[node.name] = value;
    return value;
  }

  visitPrintStatement(node) {
    const values = node.expressions.map((expr) => this.visit(expr));
    console.log(values.join(""));
    return null;
  }

  visitBinOp(node) {
    const left = this.visit(node.left);
    const right = this.visit(node.right);

    switch (node.op.type) {
      case TokenType.PLUS:
        return left + right;
      case TokenType.MINUS:
        return left - right;
      case TokenType.MULTIPLY:
        return left * right;
      case TokenType.DIVIDE:
        if (right === 0) this.error("Division by zero");
        return left / right;
      case TokenType.MODULO:
        return left % right;
      case TokenType.UG:
        return left && right;
      default:
        this.error(`Unknown operator ${node.op.type}`);
    }
  }

  visitNum(node) {
    return node.value;
  }

  visitString(node) {
    return node.value;
  }

  visitEscapeSequence(node) {
    return node.value;
  }

  visitVar(node) {
    const value = this.symbolTable[node.value];
    if (value === undefined) {
      this.error(`Undefined variable '${node.value}'`);
    }
    return value;
  }

  visitBoolean(node) {
    return node.value;
  }

  visitUnaryOp(node) {
    const operand = this.visit(node.expr);
    switch (node.op.type) {
      case TokenType.DILI:
        return !operand;
      default:
        this.error(`Unknown unary operator ${node.op.type}`);
    }
  }

  visitCompareOp(node) {
    const left = this.visit(node.left);
    const right = this.visit(node.right);

    switch (node.op.type) {
      case TokenType.EQUALS:
        return left === right;
      case TokenType.NOT_EQUALS:
        return left !== right;
      case TokenType.GREATER_THAN:
        return left > right;
      case TokenType.LESS_THAN:
        return left < right;
      case TokenType.GREATER_EQUALS:
        return left >= right;
      case TokenType.LESS_EQUALS:
        return left <= right;
      default:
        this.error(`Unknown comparison operator ${node.op.type}`);
    }
  }

  visit(node) {
    const methodName = `visit${node.constructor.name}`;
    const visitor = this[methodName];
    if (!visitor) {
      this.error(`No visitor method ${methodName}`);
    }
    return visitor.call(this, node);
  }
}

module.exports = { Interpreter };
