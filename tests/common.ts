declare var it: any;
declare var require: any;

require('source-map-support').install();

function test(node: any, expected: string[]) {
  it(('\n' + JSON.stringify(node, null, 2)).replace(/\n/g, '\n      '), () => {
    require('assert').strictEqual(cppcodegen.generate(node, { indent: '  ' }), expected.join('\n'));
  });
}

////////////////////////////////////////////////////////////////////////////////
// Expressions
////////////////////////////////////////////////////////////////////////////////

function SequenceExpression(expressions: any[]): Object {
  return {
    type: 'SequenceExpression',
    expressions: expressions,
  };
}

function AssignmentExpression(operator: string, left: any, right: any): Object {
  return {
    type: 'AssignmentExpression',
    operator: operator,
    left: left,
    right: right,
  };
}

function ConditionalExpression(test: any, consequent: any, alternate: any): Object {
  return {
    type: 'ConditionalExpression',
    test: test,
    consequent: consequent,
    alternate: alternate,
  };
}

function BinaryExpression(operator: string, left: any, right: any): Object {
  return {
    type: 'BinaryExpression',
    operator: operator,
    left: left,
    right: right,
  };
}

function CallExpression(callee: any, args: any[]): Object {
  return {
    type: 'CallExpression',
    callee: callee,
    'arguments': args,
  };
}

function NewExpression(callee: any, args: any[]): Object {
  return {
    type: 'NewExpression',
    callee: callee,
    'arguments': args,
  };
}

function MemberExpression(operator: string, object: any, property: any): Object {
  return {
    type: 'MemberExpression',
    operator: operator,
    object: object,
    property: property,
  };
}

function UnaryExpression(operator: string, prefix: boolean, argument: any): Object {
  return {
    type: 'UnaryExpression',
    operator: operator,
    prefix: prefix,
    argument: argument,
  };
}

function ThisExpression(): Object {
  return {
    type: 'ThisExpression',
  };
}

function Identifier(name: string): Object {
  return {
    type: 'Identifier',
    name: name,
  };
}

function IntegerLiteral(value: number): Object {
  return {
    type: 'IntegerLiteral',
    value: value,
  };
}

function DoubleLiteral(value: number): Object {
  return {
    type: 'DoubleLiteral',
    value: value,
  };
}

function BooleanLiteral(value: boolean): Object {
  return {
    type: 'BooleanLiteral',
    value: value,
  };
}

function StringLiteral(value: string): Object {
  return {
    type: 'StringLiteral',
    value: value,
  };
}

function NullLiteral(): Object {
  return {
    type: 'NullLiteral',
  };
}

////////////////////////////////////////////////////////////////////////////////
// Statements
////////////////////////////////////////////////////////////////////////////////

function BlockStatement(body: any[]): Object {
  return {
    type: 'BlockStatement',
    body: body,
  };
}

function VariableDeclaration(qualifiers: any[], symbols: any[]): Object {
  return {
    type: 'VariableDeclaration',
    qualifiers: qualifiers,
    symbols: symbols,
  };
}

function FunctionDeclaration(qualifiers: any[], symbol: any, body: any): Object {
  return {
    type: 'FunctionDeclaration',
    qualifiers: qualifiers,
    symbol: symbol,
    body: body,
  };
}

////////////////////////////////////////////////////////////////////////////////
// Other
////////////////////////////////////////////////////////////////////////////////

function Declarator(name: any, wrapper: any, init: any): Object {
  return {
    type: 'Declarator',
    name: name,
    wrapper: wrapper,
    init: init,
  };
}

function ArgumentDeclaration(qualifiers: any[], symbol: any): Object {
  return {
    type: 'ArgumentDeclaration',
    qualifiers: qualifiers,
    symbol: symbol,
  };
}

function DeclaratorPrefix(text: string, next: any): Object {
  return {
    type: 'DeclaratorPrefix',
    text: text,
    next: next,
  };
}

function DeclaratorFunction(args: any[], next: any): Object {
  return {
    type: 'DeclaratorFunction',
    'arguments': args,
    next: next,
  };
}

function DeclaratorArray(size: number, next: any): Object {
  return {
    type: 'DeclaratorArray',
    size: size,
    next: next,
  };
}
