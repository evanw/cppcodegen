// Inspired by: https://github.com/Constellation/escodegen
module cppcodegen {
  var indent: string;
  var base: string;

  export module Syntax {
    // Expressions
    export var SequenceExpression: string    = 'SequenceExpression';    // { expressions: Expression[] }
    export var AssignmentExpression: string  = 'AssignmentExpression';  // { operator: string, left: Expression, right: Expression }
    export var ConditionalExpression: string = 'ConditionalExpression'; // { test: Expression, consequent: Expression, alternate: Expression }
    export var BinaryExpression: string      = 'BinaryExpression';      // { operator: string, left: Expression, right: Expression }
    export var CallExpression: string        = 'CallExpression';        // { callee: Expression, arguments: Expression[] }
    export var NewExpression: string         = 'NewExpression';         // { callee: Expression, arguments: Expression[] }
    export var MemberExpression: string      = 'MemberExpression';      // { operator: string, object: Expression, property: Identifier }
    export var UnaryExpression: string       = 'UnaryExpression';       // { operator: string, prefix: boolean, argument: Expression }
    export var ThisExpression: string        = 'ThisExpression';        // {}
    export var Identifier: string            = 'Identifier';            // { name: string }
    export var IntegerLiteral: string        = 'IntegerLiteral';        // { value: number }
    export var DoubleLiteral: string         = 'DoubleLiteral';         // { value: number }
    export var BooleanLiteral: string        = 'BooleanLiteral';        // { value: boolean }
    export var StringLiteral: string         = 'StringLiteral';         // { value: string }
    export var NullLiteral: string           = 'NullLiteral';           // {}

    // Statements
    export var BlockStatement: string        = 'BlockStatement';        // { body: Statement[] }
    export var BreakStatement: string        = 'BreakStatement';        // {}
    export var ContinueStatement: string     = 'ContinueStatement';     // {}
    export var DoWhileStatement: string      = 'DoWhileStatement';      // { body: Statement, test: Expression }
    export var EmptyStatement: string        = 'EmptyStatement';        // {}
    export var ExpressionStatement: string   = 'ExpressionStatement';   // { expression: Expression }
    export var SwitchStatement: string       = 'SwitchStatement';       // { discriminant: Expression, cases: SwitchCase[] }
    export var SwitchCase: string            = 'SwitchCase';            // { test: Expression | null, consequent: Statement[] }
    export var IfStatement: string           = 'IfStatement';           // { test: Expression, consequent: Statement, alternate: Statement }
    export var Program: string               = 'Program';               // { body: Statement[] }
    export var ReturnStatement: string       = 'ReturnStatement';       // { argument: Expression | null }
    export var WhileStatement: string        = 'WhileStatement';        // { test: Expression, body: Statement }
    export var VariableDeclaration: string   = 'VariableDeclaration';   // { qualifiers: Identifier[], symbols: DeclarationSymbol[] }
    export var FunctionDeclaration: string   = 'FunctionDeclaration';   // { qualifiers: Identifier[], symbol: DeclarationSymbol, body: BlockStatement }
    export var ForStatement: string          = 'ForStatement';          // { setup: Expression | VariableDeclaration | null, test: Expression | null,
                                                                        //   update: Expression | null, body: Statement }

    // Other
    export var DeclarationSymbol: string     = 'DeclarationSymbol';     // { name: Identifier | null, declarators: Declarator, init: Expression | null }
    export var ArgumentDeclaration: string   = 'ArgumentDeclaration';   // { qualifiers: Identifier[], symbol: DeclarationSymbol | null }
    export var PrefixDeclarator: string      = 'PrefixDeclarator';      // { text: string, next: Declarator }
    export var FunctionDeclarator: string    = 'FunctionDeclarator';    // { arguments: VariableDeclaration[], next: Declarator }
    export var ArrayDeclarator: string       = 'ArrayDeclarator';       // { size: number | null, next: Declarator }
  }

  // See: http://en.cppreference.com/w/cpp/language/operator_precedence
  enum Precedence {
    Sequence,
    Throw,
    Assignment,
    LogicalOR,
    LogicalAND,
    BitwiseOR,
    BitwiseXOR,
    BitwiseAND,
    Equality,
    Relational,
    BitwiseSHIFT,
    Additive,
    Multiplicative,
    PointerToMember,
    Unary,
    Postfix,
    Scope,
  }

  var BinaryPrecedence: { [operator: string]: Precedence } = {
    '||': Precedence.LogicalOR,
    '&&': Precedence.LogicalAND,
    '|': Precedence.BitwiseOR,
    '^': Precedence.BitwiseXOR,
    '&': Precedence.BitwiseAND,
    '==': Precedence.Equality,
    '!=': Precedence.Equality,
    '<': Precedence.Relational,
    '>': Precedence.Relational,
    '<=': Precedence.Relational,
    '>=': Precedence.Relational,
    '<<': Precedence.BitwiseSHIFT,
    '>>': Precedence.BitwiseSHIFT,
    '+': Precedence.Additive,
    '-': Precedence.Additive,
    '*': Precedence.Multiplicative,
    '%': Precedence.Multiplicative,
    '/': Precedence.Multiplicative,
    '[]': Precedence.Postfix,
    '.*': Precedence.PointerToMember,
    '->*': Precedence.PointerToMember,
  };

  var MemberPrecedence: { [operator: string]: Precedence } = {
    '.': Precedence.Postfix,
    '->': Precedence.Postfix,
    '::': Precedence.Scope,
  };

  var AssignmentOperators: { [operator: string]: boolean } = {
    '=': true,
    '+=': true,
    '−=': true,
    '*=': true,
    '/=': true,
    '%=': true,
    '<<=': true,
    '>>=': true,
    '&=': true,
    '^=': true,
    '|=': true,
  };

  var BinaryOperators: { [operator: string]: boolean } = {
    '||': true,
    '&&': true,
    '|': true,
    '^': true,
    '&': true,
    '==': true,
    '!=': true,
    '<': true,
    '>': true,
    '<=': true,
    '>=': true,
    '<<': true,
    '>>': true,
    '+': true,
    '-': true,
    '*': true,
    '%': true,
    '/': true,
    '[]': true,
    '.*': true,
    '->*': true,
  };

  var MemberOperators: { [operator: string]: boolean } = {
    '.': true,
    '->': true,
    '::': true,
  };

  var UnaryOperators: { [operator: string]: boolean } = {
    '+': true,
    '-': true,
    '~': true,
    '!': true,
    '*': true,
    '&': true,
    '++': true,
    '--': true,
    'sizeof': true,
  };

  var DeclaratorPrefixes: { [text: string]: boolean } = {
    '*': true,
    '&': true,
    'const': true,
    'volatile': true,
  };

  function stringRepeat(str: string, num: number): string {
    var result: string = '';
    for (num |= 0; num > 0; num >>>= 1, str += str) {
      if (num & 1) {
        result += str;
      }
    }
    return result;
  }

  function parenthesize(text: string, current: Precedence, should: Precedence): string {
    return current < should ? '(' + text + ')' : text;
  }

  function isIdentifierPart(ch: string): boolean {
    return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch >= '0' && ch <= '9' || ch === '_';
  }

  function increaseIndent() {
    base += indent;
  }

  function decreaseIndent() {
    base = base.slice(0, base.length - indent.length);
  }

  function join(left: string, right: string): string {
    var leftChar = left.charAt(left.length - 1);
    var rightChar = right.charAt(0);
    if ((leftChar === '+' || leftChar === '-') && leftChar === rightChar ||
        isIdentifierPart(leftChar) && isIdentifierPart(rightChar)) {
      return left + ' ' + right;
    }
    return left + right;
  }

  function generateNumber(value: any): string {
    if (typeof value !== 'number') {
      throw new Error('Numeric literal with non-numeric value: ' + value);
    }
    if (value !== value) {
      throw new Error('Numeric literal whose value is NaN');
    }
    if (value < 0 || value === 0 && 1 / value < 0) {
      throw new Error('Numeric literal whose value is negative');
    }
    return value + '';
  }

  function generateDeclarator(node: any, name: string): string {
    var result: any;

    if (node === null) {
      return name;
    }

    switch (node.type) {
    case Syntax.PrefixDeclarator:
      if (!(node.text in DeclaratorPrefixes)) {
        throw new Error('Prefix declarator with invalid prefix: ' + node.text);
      }
      result = join(node.text, generateDeclarator(node.next, name));
      break;

    case Syntax.FunctionDeclarator:
      result = generateDeclarator(node.next, name);
      if (node.next !== null && node.next.type === Syntax.PrefixDeclarator) result = '(' + result + ')';
      result += '(' + node.arguments.map(n => generateArgumentDeclaration(n)).join(', ') + ')';
      break;

    case Syntax.ArrayDeclarator:
      if (node.size !== null && (node.size !== (0 | node.size) || node.size < 0)) {
        throw new Error('Array declarator with invalid size: ' + node.size);
      }
      result = generateDeclarator(node.next, name);
      if (node.next !== null && node.next.type === Syntax.PrefixDeclarator) result = '(' + result + ')';
      result += '[' + (node.size !== null ? node.size : '') + ']';
      break;

    default:
      throw new Error('Unknown declarator type: ' + node.type);
    }

    return result;
  }

  function generateIdentifier(node: any): string {
    if (node.type !== Syntax.Identifier) {
      throw new Error('Expected identifier but got type: ' + node.type);
    }
    return node.name;
  }

  function generateDeclarationSymbol(node: any): string {
    if (node.type !== Syntax.DeclarationSymbol) {
      throw new Error('Expected declaration symbol but got type: ' + node.type);
    }
    return generateDeclarator(node.declarators, node.name !== null ? generateIdentifier(node.name) : '') +
      (node.init === null ? '' : ' = ' + generateExpression(node.init, Precedence.Assignment));
  }

  function generateQualifierList(node: any): string {
    return node.qualifiers.map(n => generateIdentifier(n)).join(' ');
  }

  function generateArgumentDeclaration(node: any): string {
    if (node.type !== Syntax.ArgumentDeclaration) {
      throw new Error('Expected argument declaration but got type: ' + node.type);
    }
    return generateQualifierList(node) + (node.symbol === null ? '' : ' ' + generateDeclarationSymbol(node.symbol));
  }

  function generateExpression(node: any, precedence: Precedence): string {
    var result: any;

    switch (node.type) {
    case Syntax.SequenceExpression:
      result = node.expressions.map(n => generateExpression(n, Precedence.Assignment)).join(', ');
      result = parenthesize(result, Precedence.Sequence, precedence);
      break;

    case Syntax.AssignmentExpression:
      if (!(node.operator in AssignmentOperators)) {
        throw new Error('Assigment expression with invalid operator: ' + node.operator);
      }
      result = generateExpression(node.left, Precedence.Postfix) + ' ' + node.operator + ' ' +
        generateExpression(node.right, Precedence.Assignment);
      result = parenthesize(result, Precedence.Assignment, precedence);
      break;

    case Syntax.ConditionalExpression:
      result = generateExpression(node.test, Precedence.LogicalOR) + ' ? ' +
        generateExpression(node.consequent, Precedence.Assignment) + ' : ' +
        generateExpression(node.alternate, Precedence.Assignment);
      result = parenthesize(result, Precedence.Assignment, precedence);
      break;

    case Syntax.BinaryExpression:
      if (!(node.operator in BinaryOperators)) {
        throw new Error('Binary expression with invalid operator: ' + node.operator);
      }
      var currentPrecedence: Precedence = BinaryPrecedence[node.operator];
      result = generateExpression(node.left, currentPrecedence);
      if (node.operator === '[]') {
        result += '[' + generateExpression(node.right, Precedence.Sequence) + ']';
      } else {
        var space: string = node.operator === '.*' || node.operator === '->*' ? '' : ' ';
        result += space + node.operator + space + generateExpression(node.right, currentPrecedence + 1);
      }
      result = parenthesize(result, currentPrecedence, precedence);
      break;

    case Syntax.CallExpression:
      result = generateExpression(node.callee, Precedence.Postfix) + '(' +
        node['arguments'].map(n => generateExpression(n, Precedence.Assignment)) + ')';
      result = parenthesize(result, Precedence.Postfix, precedence);
      break;

    case Syntax.NewExpression:
      result = 'new ' + generateExpression(node.callee, Precedence.Postfix) + '(' +
        node['arguments'].map(n => generateExpression(n, Precedence.Assignment)) + ')';
      result = parenthesize(result, Precedence.Unary, precedence);
      break;

    case Syntax.MemberExpression:
      if (!(node.operator in MemberOperators)) {
        throw new Error('Member expression with invalid operator: ' + node.operator);
      }
      result = generateExpression(node.object, Precedence.Postfix) + node.operator + generateIdentifier(node.property);
      result = parenthesize(result, Precedence.Postfix, precedence);
      break;

    case Syntax.UnaryExpression:
      if (!(node.operator in UnaryOperators)) {
        throw new Error('Unary expression with invalid operator: ' + node.operator);
      }
      if (typeof node.prefix !== 'boolean' || !node.prefix && node.operator !== '++' && node.operator !== '--') {
        throw new Error('Unary expression with incorrect prefix flag: ' + node.prefix);
      }
      if (node.prefix) {
        result = join(node.operator, generateExpression(node.argument, Precedence.Unary));
        result = parenthesize(result, Precedence.Unary, precedence);
      } else {
        result = join(generateExpression(node.argument, Precedence.Postfix), node.operator);
        result = parenthesize(result, Precedence.Postfix, precedence);
      }
      break;

    case Syntax.ThisExpression:
      result = 'this';
      break;

    case Syntax.Identifier:
      result = node.name;
      break;

    case Syntax.IntegerLiteral:
      result = generateNumber(node.value);
      break;

    case Syntax.DoubleLiteral:
      result = generateNumber(node.value);
      if (!/\./.test(result)) result = result.replace(/(e|$)/, '.0$1');
      break;

    case Syntax.BooleanLiteral:
      if (typeof node.value !== 'boolean') {
        throw new Error('Boolean literal with non-boolean value: ' + node.value);
      }
      result = node.value + '';
      break;

    case Syntax.StringLiteral:
      if (typeof node.value !== 'string') {
        throw new Error('String literal with non-string value: ' + node.value);
      }
      result = JSON.stringify(node.value);
      break;

    case Syntax.NullLiteral:
      result = 'NULL';
      break;

    default:
      throw new Error('Unknown expression type: ' + node.type);
    }

    return result;
  }

  function generateStatement(node: any): string {
    var result: any;

    switch (node.type) {
    case Syntax.BlockStatement:
      result = '{\n';
      increaseIndent();
      result += node.body.map(n => base + generateStatement(n) + '\n');
      decreaseIndent();
      result += base + '}';
      break;

    case Syntax.BreakStatement:
      result = 'break;';
      break;

    case Syntax.ContinueStatement:
      result = 'continue;';
      break;

    case Syntax.DoWhileStatement:
      result = 'do ' + generateStatement(node.body) + ' while (' +
        generateExpression(node.test, Precedence.Sequence) + ')';
      break;

    case Syntax.EmptyStatement:
      result = ';';
      break;

    case Syntax.ExpressionStatement:
      result = generateExpression(node.expression, Precedence.Sequence) + ';';
      break;

    case Syntax.SwitchStatement:
      result = 'switch (' + generateExpression(node.discriminant, Precedence.Sequence) + ') {\n';
      result += node.cases.map(n => base + generateStatement(n) + '\n');
      result += base + '}';
      break;

    case Syntax.SwitchCase:
      if (node.test !== null) {
        result = 'case ' + generateExpression(node.test, Precedence.Sequence) + ':\n';
      } else {
        result = 'default:\n';
      }
      increaseIndent();
      result += node.consequent.map(n => base + generateStatement(n) + '\n');
      decreaseIndent();
      break;

    case Syntax.IfStatement:
      result = 'if (' + generateExpression(node.test, Precedence.Sequence) + ') ' +
        generateStatement(node.consequent) + (node.alternate === null ? '' : ' else ' +
        generateStatement(node.alternate));
      break;

    case Syntax.Program:
      result = node.body.map(n => base + generateStatement(n) + '\n');
      break;

    case Syntax.ReturnStatement:
      result = 'return' + (node.argument !== null ? ' ' + generateExpression(node.argument, Precedence.Sequence) : '') + ';';

    case Syntax.WhileStatement:
      result = 'while (' + generateExpression(node.test, Precedence.Sequence) + ') ' + generateStatement(node.body);
      break;

    case Syntax.ForStatement:
      result = 'for (';
      result += node.init.type === Syntax.VariableDeclaration ? generateStatement(node.init) : generateExpression(node.init, Precedence.Sequence) + ';';
      result += node.test !== null ? ' ' + generateExpression(node.test, Precedence.Sequence) + ';' : ';';
      result += (node.update !== null ? ' ' + generateExpression(node.update, Precedence.Sequence) : '') + ') ';
      result += generateStatement(node.body);
      break;

    case Syntax.VariableDeclaration:
      result = generateQualifierList(node) + ' ' + node.symbols.map(s => generateDeclarationSymbol(s)).join(', ') + ';';
      break;

    case Syntax.FunctionDeclaration:
      result = generateQualifierList(node) + ' ' + generateDeclarationSymbol(node.symbol) + ' ' + generateStatement(node.body);
      break;

    default:
      throw new Error('Unknown statement type: ' + node.type);
    }

    return result;
  }

  export interface Options {
    indent?: string;
    base?: string;
  }

  export function generate(node: any, options?: Options): string {
    var result: any;

    options = options || {};
    indent = options.indent || '    ';
    base = options.base || '';

    switch (node.type) {
    case Syntax.BlockStatement:
    case Syntax.BreakStatement:
    case Syntax.ContinueStatement:
    case Syntax.DoWhileStatement:
    case Syntax.EmptyStatement:
    case Syntax.ExpressionStatement:
    case Syntax.SwitchStatement:
    case Syntax.SwitchCase:
    case Syntax.IfStatement:
    case Syntax.Program:
    case Syntax.ReturnStatement:
    case Syntax.WhileStatement:
    case Syntax.ForStatement:
    case Syntax.VariableDeclaration:
    case Syntax.FunctionDeclaration:
      result = generateStatement(node);
      break;

    case Syntax.SequenceExpression:
    case Syntax.AssignmentExpression:
    case Syntax.ConditionalExpression:
    case Syntax.BinaryExpression:
    case Syntax.CallExpression:
    case Syntax.NewExpression:
    case Syntax.MemberExpression:
    case Syntax.UnaryExpression:
    case Syntax.ThisExpression:
    case Syntax.Identifier:
    case Syntax.IntegerLiteral:
    case Syntax.DoubleLiteral:
    case Syntax.BooleanLiteral:
    case Syntax.StringLiteral:
    case Syntax.NullLiteral:
      result = generateExpression(node, Precedence.Sequence);
      break;

    case Syntax.DeclarationSymbol:
      result = generateDeclarationSymbol(node);
      break;

    case Syntax.ArgumentDeclaration:
      result = generateArgumentDeclaration(node);
      break;

    case Syntax.PrefixDeclarator:
    case Syntax.FunctionDeclarator:
    case Syntax.ArrayDeclarator:
      result = generateDeclarator(node, '');
      break;

    default:
      throw new Error('Unknown node type: ' + node.type);
    }

    return result;
  }
}
