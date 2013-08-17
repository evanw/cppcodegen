// Inspired by: https://github.com/Constellation/escodegen
module cppcodegen {
  var indent: string;
  var base: string;
  var nullptr: string;

  export module Syntax {
    // Expressions
    export var SequenceExpression: string    = 'SequenceExpression';    // { expressions: Expression[] }
    export var AssignmentExpression: string  = 'AssignmentExpression';  // { operator: string, left: Expression, right: Expression }
    export var ConditionalExpression: string = 'ConditionalExpression'; // { test: Expression, consequent: Expression, alternate: Expression }
    export var BinaryExpression: string      = 'BinaryExpression';      // { operator: string, left: Expression, right: Expression }
    export var CallExpression: string        = 'CallExpression';        // { callee: Expression, arguments: Expression[] }
    export var NewExpression: string         = 'NewExpression';         // { callee: Expression, arguments: Expression[] }
    export var MemberExpression: string      = 'MemberExpression';      // { operator: string, object: Expression, member: Identifier }
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
    export var VariableDeclaration: string   = 'VariableDeclaration';   // { qualifiers: Identifier[], variables: Variable[] }
    export var FunctionDeclaration: string   = 'FunctionDeclaration';   // { qualifiers: Identifier[], type: Type, id: Identifier, body: BlockStatement | null }
    export var ForStatement: string          = 'ForStatement';          // { setup: Expression | VariableDeclaration | null, test: Expression | null,
                                                                        //   update: Expression | null, body: Statement }

    // Types
    export var MemberType: string            = 'MemberType';            // { inner: Type, member: Identifier }
    export var ConstType: string             = 'ConstType';             // { inner: Type }
    export var VolatileType: string          = 'VolatileType';          // { inner: Type }
    export var PointerType: string           = 'PointerType';           // { inner: Type }
    export var ReferenceType: string         = 'ReferenceType';         // { inner: Type }
    export var FunctionType: string          = 'FunctionType';          // { return: Type, arguments: Variable[] }
    export var MemberPointerType: string     = 'MemberPointerType';     // { inner: Type, object: Type }
    export var ArrayType: string             = 'ArrayType';             // { inner: Type, size: Expression }
    export var TemplateType: string          = 'TemplateType';          // { inner: Type, parameters: Type[] }
    export var ObjectType: string            = 'ObjectType';            // { keyword: 'struct' | 'union' | 'class', bases: Type[], body: BlockStatement }

    // Other
    export var Variable: string              = 'Variable';              // { type: Type, id: Identifier | null, init: Expression | null }
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

  function generateIdentifier(node: any): string {
    if (node.kind !== Syntax.Identifier) {
      throw new Error('Expected identifier but got kind: ' + node.kind);
    }
    return node.name;
  }

  function generateQualifierList(node: any): string {
    return node.qualifiers.map(n => generateIdentifier(n) + ' ').join('');
  }

  function generateExpression(node: any, precedence: Precedence): string {
    var result: any;

    switch (node.kind) {
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
      result = nullptr;
      break;

    default:
      throw new Error('Unknown expression kind: ' + node.kind);
    }

    return result;
  }

  function generateStatement(node: any): string {
    var result: any;

    switch (node.kind) {
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
      result += node.init.kind === Syntax.VariableDeclaration ? generateStatement(node.init) : generateExpression(node.init, Precedence.Sequence) + ';';
      result += node.test !== null ? ' ' + generateExpression(node.test, Precedence.Sequence) + ';' : ';';
      result += (node.update !== null ? ' ' + generateExpression(node.update, Precedence.Sequence) : '') + ') ';
      result += generateStatement(node.body);
      break;

    case Syntax.VariableDeclaration:
      var prefix: string = null;
      result = (generateQualifierList(node) + node.variables.map((n, i) => {
        var context: WrapContext = new WrapContext();
        context.includePrefix = i === 0;
        var result: string = generateVariable(n, context);
        if (prefix !== null && prefix !== context.prefix) {
          throw new Error('Type prefix ' + prefix + ' does not match type prefix ' + context.prefix);
        }
        prefix = context.prefix;
        return result;
      }).join(', ')).trim() + ';';
      break;

    case Syntax.FunctionDeclaration:
      result = generateQualifierList(node) + wrapIdentifierWithType(node.type, node.id, new WrapContext()) +
        (node.body !== null ? ' ' + generateStatement(node.body) : ';');
      break;

    default:
      throw new Error('Unknown statement kind: ' + node.kind);
    }

    return result;
  }

  class WrapContext {
    prefix: string = '';
    before: string = '';
    after: string = '';
    isWrapping: boolean = false;
    includePrefix: boolean = true;
  }

  function wrapType(node: any, context: WrapContext) {
    switch (node.kind) {
    case Syntax.Identifier:
      context.prefix = node.name;
      break;

    case Syntax.ConstType:
    case Syntax.VolatileType:
      wrapType(node.inner, context);
      var keyword: string = node.kind === Syntax.ConstType ? 'const ' : 'volatile ';
      if (context.isWrapping) context.before = context.before + keyword;
      else context.prefix = keyword + context.prefix;
      break;

    case Syntax.PointerType:
    case Syntax.ReferenceType:
      wrapType(node.inner, context);
      context.isWrapping = true;
      if (node.inner.kind === Syntax.ArrayType || node.inner.kind === Syntax.FunctionType) {
        context.before += '(';
        context.after = ')' + context.after;
      }
      context.before += node.kind === Syntax.PointerType ? '*' : '&';
      break;

    case Syntax.ArrayType:
      wrapType(node.inner, context);
      context.isWrapping = true;
      context.after = '[' + (node.size !== null ? generateExpression(node.size, Precedence.Sequence) : '') + ']' + context.after;
      break;

    case Syntax.FunctionType:
      wrapType(node['return'], context);
      context.isWrapping = true;
      context.after = '(' + node['arguments'].map(n => generateVariable(n, new WrapContext())).join(', ') + ')' + context.after;
      break;

    default:
      throw new Error('Unknown type node kind: ' + node.kind);
    }
  }

  function wrapIdentifierWithType(type: any, id: any, context: WrapContext) {
    wrapType(type, context);
    return ((context.includePrefix ? context.prefix + ' ' : '') +
      (id !== null ? context.before + generateIdentifier(id) : context.before.trim()) + context.after).trim();
  }

  function generateVariable(node: any, context: WrapContext): string {
    if (node.kind !== Syntax.Variable) {
      throw new Error('Expected variable but got kind: ' + node.kind);
    }
    if (node.id === null && node.init !== null) {
      throw new Error('Cannot initialize anonymous variable');
    }
    return wrapIdentifierWithType(node.type, node.id, context) +
      (node.init !== null ? ' = ' + generateExpression(node.init, Precedence.Assignment) : '');
  }

  export interface Options {
    indent?: string;
    base?: string;
    nullptr?: string;
  }

  export function generate(node: any, options?: Options): string {
    var result: any;

    options = options || {};
    indent = options.indent || '    ';
    base = options.base || '';
    nullptr = options.nullptr ? 'nullptr' : 'NULL';

    switch (node.kind) {
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

    case Syntax.MemberType:
    case Syntax.ConstType:
    case Syntax.VolatileType:
    case Syntax.PointerType:
    case Syntax.ReferenceType:
    case Syntax.FunctionType:
    case Syntax.MemberPointerType:
    case Syntax.ArrayType:
    case Syntax.TemplateType:
    case Syntax.ObjectType:
      result = wrapIdentifierWithType(node, null, new WrapContext());
      break;

    case Syntax.Variable:
      result = generateVariable(node, new WrapContext());
      break;

    default:
      throw new Error('Unknown node kind: ' + node.kind);
    }

    return result;
  }
}
