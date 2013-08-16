// Note: all translations below are from http://cdecl.org/

test(VariableDeclaration(
  [Identifier('int')],
  [Declarator(Identifier('foo'), null, null)]
), [
  'int foo;',
]);

test(VariableDeclaration(
  [Identifier('int')],
  [Declarator(Identifier('foo'), null, IntegerLiteral(1))]
), [
  'int foo = 1;',
]);

test(VariableDeclaration(
  [Identifier('int')],
  [Declarator(Identifier('foo'), null, AssignmentExpression('=',
    Identifier('bar'),
    IntegerLiteral(1)))]
), [
  'int foo = bar = 1;',
]);

// declare foo as volatile pointer to const int
test(VariableDeclaration(
  [Identifier('const'), Identifier('int')],
  [Declarator(Identifier('foo'),
    DeclaratorPrefix('*',
      DeclaratorPrefix('volatile',
        null)),
    NullLiteral())]
), [
  'const int *volatile foo = NULL;',
]);

// declare foo as pointer to array 1 of pointer to int
test(VariableDeclaration(
  [Identifier('int')],
  [Declarator(Identifier('foo'),
    DeclaratorPrefix('*',
      DeclaratorArray(1,
        DeclaratorPrefix('*',
          null))),
    NullLiteral())]
), [
  'int *(*foo)[1] = NULL;',
]);

// declare foo as pointer to pointer to array 1 of int
test(VariableDeclaration(
  [Identifier('int')],
  [Declarator(Identifier('foo'),
    DeclaratorArray(1,
      DeclaratorPrefix('*',
        DeclaratorPrefix('*',
          null))),
    NullLiteral())]
), [
  'int (**foo)[1] = NULL;',
]);

// declare foo as array 1 of pointer to pointer to int
test(VariableDeclaration(
  [Identifier('int')],
  [Declarator(Identifier('foo'),
    DeclaratorPrefix('*',
      DeclaratorPrefix('*',
        DeclaratorArray(1,
          null))),
    NullLiteral())]
), [
  'int **foo[1] = NULL;',
]);

// declare foo as array 1 of function (int, double) returning pointer to int
test(VariableDeclaration(
  [Identifier('int')],
  [Declarator(Identifier('foo'),
    DeclaratorPrefix('*',
      DeclaratorFunction([
        ArgumentDeclaration([Identifier('int')], null),
        ArgumentDeclaration([Identifier('double')], null)],
        DeclaratorArray(1,
          null))),
    NullLiteral())]
), [
  'int *foo[1](int, double) = NULL;',
]);

// declare foo as pointer to function (int, double) returning array 1 of int
test(VariableDeclaration(
  [Identifier('int')],
  [Declarator(Identifier('foo'),
    DeclaratorArray(1,
      DeclaratorFunction([
        ArgumentDeclaration([Identifier('int')], null),
        ArgumentDeclaration([Identifier('double')], null)],
        DeclaratorPrefix('*',
          null))),
    NullLiteral())]
), [
  'int (*foo)(int, double)[1] = NULL;',
]);

// declare foo as pointer to array 2 of array 1 of array of int
test(VariableDeclaration(
  [Identifier('int')],
  [Declarator(Identifier('foo'),
    DeclaratorArray(null,
      DeclaratorArray(1,
        DeclaratorArray(2,
        DeclaratorPrefix('*',
          null)))),
    NullLiteral())]
), [
  'int (*foo)[2][1][] = NULL;',
]);

// declare foo as function (int, double) returning int
test(FunctionDeclaration(
  [Identifier('int')],
  Declarator(Identifier('foo'),
    DeclaratorFunction([
      ArgumentDeclaration([Identifier('int')], Declarator(Identifier('a'), null, null)),
      ArgumentDeclaration([Identifier('double')], Declarator(Identifier('b'), null, null))],
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
  Declarator(Identifier('foo'),
    DeclaratorArray(null,
      DeclaratorFunction([
        ArgumentDeclaration([Identifier('bool')], null)],
        DeclaratorPrefix('*',
          DeclaratorFunction([
            ArgumentDeclaration([Identifier('int')], Declarator(Identifier('a'), null, null)),
            ArgumentDeclaration([Identifier('double')], Declarator(Identifier('b'), null, null))],
              null)))),
    null),
  BlockStatement([])
), [
  'int (*foo(int a, double b))(bool)[] {',
  '}',
]);

// declare foo as function (pointer to int, double, pointer to function (pointer to void, pointer to int) returning bool) returning int
test(FunctionDeclaration(
  [Identifier('int')],
  Declarator(Identifier('foo'),
    DeclaratorFunction([
      ArgumentDeclaration([Identifier('int')], Declarator(null, DeclaratorPrefix('*', null), null)),
      ArgumentDeclaration([Identifier('double')], null),
      ArgumentDeclaration([Identifier('bool')], Declarator(null,
        DeclaratorFunction([
          ArgumentDeclaration([Identifier('void')], Declarator(null, DeclaratorPrefix('*', null), null)),
          ArgumentDeclaration([Identifier('int')], Declarator(null, DeclaratorPrefix('&', null), null))],
          DeclaratorPrefix('*', null)), null))],
        null),
    null),
  BlockStatement([])
), [
  'int foo(int *, double, bool (*)(void *, int &)) {',
  '}',
]);
