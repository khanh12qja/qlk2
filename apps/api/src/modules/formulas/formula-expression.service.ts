import { BadRequestException, Injectable } from "@nestjs/common";

type RuntimeValue = string | number | boolean;
type RuntimeContext = Record<string, RuntimeValue>;
type OperatorToken = "==" | ">" | "<" | ">=" | "<=" | "&&" | "||" | "+" | "-" | "*" | "/";

type Token =
  | { type: "identifier"; value: string }
  | { type: "number"; value: number }
  | { type: "string"; value: string }
  | { type: "operator"; value: OperatorToken }
  | { type: "paren"; value: "(" | ")" };

@Injectable()
export class FormulaExpressionService {
  evaluateNumber(expression: string | undefined, context: RuntimeContext, fallback = 0): number {
    if (!expression?.trim()) {
      return fallback;
    }

    const result = this.evaluateArithmetic(expression, context);
    if (!Number.isFinite(result)) {
      throw new BadRequestException(`Biểu thức công thức trả về số không hợp lệ: ${expression}`);
    }
    return result;
  }

  evaluateCondition(expression: string | undefined, context: RuntimeContext): boolean {
    if (!expression?.trim() || expression.trim().toLowerCase() === "always") {
      return true;
    }

    const tokens = this.tokenize(expression);
    const orSegments = this.splitByOperator(tokens, "||");
    return orSegments.some((segment) => this.evaluateAndSegment(segment, context));
  }

  private evaluateAndSegment(tokens: Token[], context: RuntimeContext): boolean {
    return this.splitByOperator(tokens, "&&").every((segment) => this.evaluateComparison(segment, context));
  }

  private evaluateComparison(tokens: Token[], context: RuntimeContext): boolean {
    const operatorIndex = tokens.findIndex((token) => token.type === "operator" && ["==", ">", "<", ">=", "<="].includes(token.value));
    if (operatorIndex < 0) {
      const value = this.resolveValue(tokens, context);
      return Boolean(value);
    }

    const operator = tokens[operatorIndex].value;
    const left = this.resolveValue(tokens.slice(0, operatorIndex), context);
    const right = this.resolveValue(tokens.slice(operatorIndex + 1), context);

    if (operator === "==") {
      return String(left) === String(right);
    }

    const leftNumber = Number(left);
    const rightNumber = Number(right);
    if (!Number.isFinite(leftNumber) || !Number.isFinite(rightNumber)) {
      throw new BadRequestException(`Toán tử ${operator} yêu cầu giá trị dạng số`);
    }

    if (operator === ">") return leftNumber > rightNumber;
    if (operator === "<") return leftNumber < rightNumber;
    if (operator === ">=") return leftNumber >= rightNumber;
    return leftNumber <= rightNumber;
  }

  private evaluateArithmetic(expression: string, context: RuntimeContext): number {
    const tokens = this.tokenize(expression);
    const output: Token[] = [];
    const operators: Token[] = [];
    const precedence: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2 };

    for (const token of tokens) {
      if (token.type === "number" || token.type === "identifier") {
        output.push(token);
      } else if (token.type === "operator" && token.value in precedence) {
        while (
          operators.length > 0 &&
          operators[operators.length - 1].type === "operator" &&
          precedence[operators[operators.length - 1].value] >= precedence[token.value]
        ) {
          output.push(operators.pop() as Token);
        }
        operators.push(token);
      } else if (token.type === "paren" && token.value === "(") {
        operators.push(token);
      } else if (token.type === "paren" && token.value === ")") {
        while (operators.length > 0 && !(operators[operators.length - 1].type === "paren" && operators[operators.length - 1].value === "(")) {
          output.push(operators.pop() as Token);
        }
        operators.pop();
      } else {
        throw new BadRequestException(`Biểu thức số học không được hỗ trợ: ${expression}`);
      }
    }

    while (operators.length > 0) {
      output.push(operators.pop() as Token);
    }

    const stack: number[] = [];
    for (const token of output) {
      if (token.type === "number") {
        stack.push(token.value);
      } else if (token.type === "identifier") {
        stack.push(this.resolveNumber(token.value, context));
      } else if (token.type === "operator") {
        const right = stack.pop();
        const left = stack.pop();
        if (left === undefined || right === undefined) {
          throw new BadRequestException(`Biểu thức số học không hợp lệ: ${expression}`);
        }
        if (token.value === "+") stack.push(left + right);
        if (token.value === "-") stack.push(left - right);
        if (token.value === "*") stack.push(left * right);
        if (token.value === "/") stack.push(left / right);
      }
    }

    if (stack.length !== 1) {
      throw new BadRequestException(`Biểu thức số học không hợp lệ: ${expression}`);
    }
    return stack[0];
  }

  private resolveValue(tokens: Token[], context: RuntimeContext): RuntimeValue {
    if (tokens.length !== 1) {
      return this.evaluateArithmetic(tokens.map((token) => token.value).join(""), context);
    }

    const [token] = tokens;
    if (token.type === "identifier") {
      return context[token.value] ?? token.value;
    }
    if (token.type === "number" || token.type === "string") {
      return token.value;
    }
    throw new BadRequestException("Vế điều kiện không hợp lệ");
  }

  private resolveNumber(identifier: string, context: RuntimeContext): number {
    const value = context[identifier];
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) {
      throw new BadRequestException(`Tham số ${identifier} phải là dạng số`);
    }
    return numberValue;
  }

  private splitByOperator(tokens: Token[], operator: string): Token[][] {
    const segments: Token[][] = [[]];
    for (const token of tokens) {
      if (token.type === "operator" && token.value === operator) {
        segments.push([]);
      } else {
        segments[segments.length - 1].push(token);
      }
    }
    return segments;
  }

  private tokenize(expression: string): Token[] {
    const tokens: Token[] = [];
    const source = expression.trim();
    let index = 0;

    while (index < source.length) {
      const current = source[index];
      const two = source.slice(index, index + 2);

      if (/\s/.test(current)) {
        index += 1;
      } else if (["==", ">=", "<=", "&&", "||"].includes(two)) {
        tokens.push({ type: "operator", value: two as OperatorToken });
        index += 2;
      } else if ([">", "<", "+", "-", "*", "/"].includes(current)) {
        tokens.push({ type: "operator", value: current as OperatorToken });
        index += 1;
      } else if (current === "(" || current === ")") {
        tokens.push({ type: "paren", value: current });
        index += 1;
      } else if (current === "'" || current === "\"") {
        const end = source.indexOf(current, index + 1);
        if (end < 0) throw new BadRequestException("Chuỗi ký tự chưa được đóng");
        tokens.push({ type: "string", value: source.slice(index + 1, end) });
        index = end + 1;
      } else if (/\d/.test(current)) {
        const match = source.slice(index).match(/^\d+(\.\d+)?/);
        if (!match) throw new BadRequestException("Giá trị số không hợp lệ");
        tokens.push({ type: "number", value: Number(match[0]) });
        index += match[0].length;
      } else if (/[A-Za-z_]/.test(current)) {
        const match = source.slice(index).match(/^[A-Za-z_][A-Za-z0-9_]*/);
        if (!match) throw new BadRequestException("Tên tham số không hợp lệ");
        tokens.push({ type: "identifier", value: match[0].toUpperCase() });
        index += match[0].length;
      } else {
        throw new BadRequestException(`Ký tự không được hỗ trợ: ${current}`);
      }
    }

    return tokens;
  }
}
