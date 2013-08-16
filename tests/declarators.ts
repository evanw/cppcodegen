// Note: all translations below are from http://cdecl.org/

test(VariableDeclaration(
  [Identifier('int')],
  [DeclarationSymbol('foo', null, null)]
), [
  'int foo;',
]);

test(VariableDeclaration(
  [Identifier('int')],
  [DeclarationSymbol('foo', null, IntegerLiteral(1))]
), [
  'int foo = 1;',
]);

test(VariableDeclaration(
  [Identifier('int')],
  [DeclarationSymbol('foo', null, AssignmentExpression('=',
    Identifier('bar'),
    IntegerLiteral(1)))]
), [
  'int foo = bar = 1;',
]);

// declare foo as volatile pointer to const int
test(VariableDeclaration(
  [Identifier('const'), Identifier('int')],
  [DeclarationSymbol('foo',
    PrefixDeclarator('*',
      PrefixDeclarator('volatile',
        null)),
    NullLiteral())]
), [
  'const int *volatile foo = NULL;',
]);

// declare foo as pointer to array 1 of pointer to int
test(VariableDeclaration(
  [Identifier('int')],
  [DeclarationSymbol('foo',
    PrefixDeclarator('*',
      ArrayDeclarator(1,
        PrefixDeclarator('*',
          null))),
    NullLiteral())]
), [
  'int *(*foo)[1] = NULL;',
]);

// declare foo as pointer to pointer to array 1 of int
test(VariableDeclaration(
  [Identifier('int')],
  [DeclarationSymbol('foo',
    ArrayDeclarator(1,
      PrefixDeclarator('*',
        PrefixDeclarator('*',
          null))),
    NullLiteral())]
), [
  'int (**foo)[1] = NULL;',
]);

// declare foo as array 1 of pointer to pointer to int
test(VariableDeclaration(
  [Identifier('int')],
  [DeclarationSymbol('foo',
    PrefixDeclarator('*',
      PrefixDeclarator('*',
        ArrayDeclarator(1,
          null))),
    NullLiteral())]
), [
  'int **foo[1] = NULL;',
]);

// declare foo as array 1 of function (int, double) returning pointer to int
test(VariableDeclaration(
  [Identifier('int')],
  [DeclarationSymbol('foo',
    PrefixDeclarator('*',
      FunctionDeclarator([
        ArgumentDeclaration([Identifier('int')], null),
        ArgumentDeclaration([Identifier('double')], null)],
        ArrayDeclarator(1,
          null))),
    NullLiteral())]
), [
  'int *foo[1](int, double) = NULL;',
]);

// declare foo as pointer to function (int, double) returning array 1 of int
test(VariableDeclaration(
  [Identifier('int')],
  [DeclarationSymbol('foo',
    ArrayDeclarator(1,
      FunctionDeclarator([
        ArgumentDeclaration([Identifier('int')], null),
        ArgumentDeclaration([Identifier('double')], null)],
        PrefixDeclarator('*',
          null))),
    NullLiteral())]
), [
  'int (*foo)(int, double)[1] = NULL;',
]);

// declare foo as pointer to array 2 of array 1 of array of int
test(VariableDeclaration(
  [Identifier('int')],
  [DeclarationSymbol('foo',
    ArrayDeclarator(null,
      ArrayDeclarator(1,
        ArrayDeclarator(2,
        PrefixDeclarator('*',
          null)))),
    NullLiteral())]
), [
  'int (*foo)[2][1][] = NULL;',
]);

// declare foo as function (int, double) returning int
test(FunctionDeclaration(
  [Identifier('int')],
  DeclarationSymbol('foo',
    FunctionDeclarator([
      ArgumentDeclaration([Identifier('int')], DeclarationSymbol('a', null, null)),
      ArgumentDeclaration([Identifier('double')], DeclarationSymbol('b', null, null))],
        null),
    null),
  BlockStatement([])
), [
  'int foo(int a, double b) {',
  '}',
]);

// declare foo as function (int, double) returning pointer to function (bool) returning array of int
test(FunctionDeclaration(
  [Identifier('int')],
  DeclarationSymbol('foo',
    ArrayDeclarator(null,
      FunctionDeclarator([
        ArgumentDeclaration([Identifier('bool')], null)],
        PrefixDeclarator('*',
          FunctionDeclarator([
            ArgumentDeclaration([Identifier('int')], DeclarationSymbol('a', null, null)),
            ArgumentDeclaration([Identifier('double')], DeclarationSymbol('b', null, null))],
              null)))),
    null),
  BlockStatement([])
), [
  'int (*foo(int a, double b))(bool)[] {',
  '}',
]);
