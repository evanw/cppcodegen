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
    kind: 'SequenceExpression',
    expressions: expressions,
  };
}

function AssignmentExpression(operator: string, left: any, right: any): Object {
  return {
    kind: 'AssignmentExpression',
    operator: operator,
    left: left,
    right: right,
  };
}

function ConditionalExpression(test: any, consequent: any, alternate: any): Object {
  return {
    kind: 'ConditionalExpression',
    test: test,
    consequent: consequent,
    alternate: alternate,
  };
}

function BinaryExpression(operator: string, left: any, right: any): Object {
  return {
    kind: 'BinaryExpression',
    operator: operator,
    left: left,
    right: right,
  };
}

function CallExpression(callee: any, _arguments: any[]): Object {
  return {
    kind: 'CallExpression',
    callee: callee,
    'arguments': _arguments,
  };
}

function NewExpression(callee: any, _arguments: any[]): Object {
  return {
    kind: 'NewExpression',
    callee: callee,
    'arguments': _arguments,
  };
}

function MemberExpression(operator: string, object: any, property: any): Object {
  return {
    kind: 'MemberExpression',
    operator: operator,
    object: object,
    property: property,
  };
}

function UnaryExpression(operator: string, prefix: boolean, argument: any): Object {
  return {
    kind: 'UnaryExpression',
    operator: operator,
    prefix: prefix,
    argument: argument,
  };
}

function ThisExpression(): Object {
  return {
    kind: 'ThisExpression',
  };
}

function Identifier(name: string): Object {
  return {
    kind: 'Identifier',
    name: name,
  };
}

function IntegerLiteral(value: number): Object {
  return {
    kind: 'IntegerLiteral',
    value: value,
  };
}

function DoubleLiteral(value: number): Object {
  return {
    kind: 'DoubleLiteral',
    value: value,
  };
}

function BooleanLiteral(value: boolean): Object {
  return {
    kind: 'BooleanLiteral',
    value: value,
  };
}

function StringLiteral(value: string): Object {
  return {
    kind: 'StringLiteral',
    value: value,
  };
}

function NullLiteral(): Object {
  return {
    kind: 'NullLiteral',
  };
}

function SpecializeTemplate(template: any, parameters: any[]): Object {
  return {
    kind: 'SpecializeTemplate',
    template: template,
    parameters: parameters,
  };
}

////////////////////////////////////////////////////////////////////////////////
// Statements
////////////////////////////////////////////////////////////////////////////////

function BlockStatement(body: any[]): Object {
  return {
    kind: 'BlockStatement',
    body: body,
  };
}

function VariableDeclaration(qualifiers: any[], variables: any[]): Object {
  return {
    kind: 'VariableDeclaration',
    qualifiers: qualifiers,
    variables: variables,
  };
}

function FunctionDeclaration(qualifiers: any[], type: any, id: any, body: any): Object {
  return {
    kind: 'FunctionDeclaration',
    qualifiers: qualifiers,
    type: type,
    id: id,
    body: body,
  };
}

function ObjectDeclaration(type: any): Object {
  return {
    kind: 'ObjectDeclaration',
    type: type,
  };
}

////////////////////////////////////////////////////////////////////////////////
// Types
////////////////////////////////////////////////////////////////////////////////

function MemberType(inner: any, member: any): Object {
  return {
    kind: 'MemberType',
    inner: inner,
    member: member,
  };
}

function ConstType(inner: any): Object {
  return {
    kind: 'ConstType',
    inner: inner,
  };
}

function VolatileType(inner: any): Object {
  return {
    kind: 'VolatileType',
    inner: inner,
  };
}

function PointerType(inner: any): Object {
  return {
    kind: 'PointerType',
    inner: inner,
  };
}

function ReferenceType(inner: any): Object {
  return {
    kind: 'ReferenceType',
    inner: inner,
  };
}

function FunctionType(_return: any, _arguments: any[]): Object {
  return {
    kind: 'FunctionType',
    'return': _return,
    'arguments': _arguments,
  };
}

function MemberPointerType(inner: any, object: any): Object {
  return {
    kind: 'MemberPointerType',
    inner: inner,
    object: object,
  };
}

function ArrayType(inner: any, size: any): Object {
  return {
    kind: 'ArrayType',
    inner: inner,
    size: size,
  };
}

function ObjectType(keyword: any, id: any, bases: any, body: any): Object {
  return {
    kind: 'ObjectType',
    keyword: keyword,
    id: id,
    bases: bases,
    body: body,
  };
}

////////////////////////////////////////////////////////////////////////////////
// Other
////////////////////////////////////////////////////////////////////////////////

function Variable(type: any, id: any, init: any): Object {
  return {
    kind: 'Variable',
    type: type,
    id: id,
    init: init,
  };
}
