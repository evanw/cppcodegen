// All translations from C gibberish below are from http://cdecl.org/

// declare foo as pointer to int
test(VariableDeclaration([], [
  Variable(
    PointerType(
      Identifier('int')),
    Identifier('foo'),
    null)]
), [
  'int *foo;',
]);

// declare foo as pointer to const int
test(VariableDeclaration([], [
  Variable(
    PointerType(
      ConstType(
        Identifier('int'))),
    Identifier('foo'),
    null)]
), [
  'const int *foo;',
]);

// declare foo as volatile pointer to const int
test(VariableDeclaration([], [
  Variable(
    VolatileType(
      PointerType(
        ConstType(
          Identifier('int')))),
    Identifier('foo'),
    null)]
), [
  'const int *volatile foo;',
]);

// declare foo as pointer to function returning int
test(VariableDeclaration([], [
  Variable(
    PointerType(
      FunctionType(
        Identifier('int'),
        [])),
    Identifier('foo'),
    null)]
), [
  'int (*foo)();',
]);

// declare foo as pointer to array 1 of pointer to int
test(VariableDeclaration([], [
  Variable(
    PointerType(
      ArrayType(
        PointerType(
          Identifier('int')),
        IntegerLiteral(1))),
    Identifier('foo'),
    null)]
), [
  'int *(*foo)[1];',
]);

// declare foo as pointer to pointer to array 1 of int
test(VariableDeclaration([], [
  Variable(
    PointerType(
      PointerType(
        ArrayType(
          Identifier('int'),
          IntegerLiteral(1)))),
    Identifier('foo'),
    null)]
), [
  'int (**foo)[1];',
]);

// declare foo as array 1 of pointer to pointer to int
test(VariableDeclaration([], [
  Variable(
    ArrayType(
      PointerType(
        PointerType(
          Identifier('int'))),
      IntegerLiteral(1)),
    Identifier('foo'),
    null)]
), [
  'int **foo[1];',
]);

// declare foo as array 1 of function (int, double) returning pointer to int
test(VariableDeclaration([], [
  Variable(
    ArrayType(
      FunctionType(
        PointerType(
          Identifier('int')), [
        Variable(Identifier('int'), null, null),
        Variable(Identifier('double'), null, null)]),
      IntegerLiteral(1)),
    Identifier('foo'),
    null)]
), [
  'int *foo[1](int, double);',
]);

// declare foo as pointer to function (int, double) returning array 1 of int
test(VariableDeclaration([], [
  Variable(
    PointerType(
      FunctionType(
        ArrayType(
          Identifier('int'),
          IntegerLiteral(1)), [
        Variable(Identifier('int'), null, null),
        Variable(Identifier('double'), null, null)])),
    Identifier('foo'),
    null)]
), [
  'int (*foo)(int, double)[1];',
]);

// declare foo as pointer to array of array 1 of array 2 of int
test(VariableDeclaration([], [
  Variable(
    PointerType(
      ArrayType(
        ArrayType(
          ArrayType(
            Identifier('int'),
            IntegerLiteral(2)),
          IntegerLiteral(1)),
        null)),
    Identifier('foo'),
    null)]
), [
  'int (*foo)[][1][2];',
]);

// declare foo as function (int, double) returning pointer to function (bool) returning array of int
test(FunctionDeclaration([],
  FunctionType(
    PointerType(
      FunctionType(
        ArrayType(
          Identifier('int'),
          null), [
        Variable(Identifier('bool'), null, null)])), [
    Variable(Identifier('int'), Identifier('a'), null),
    Variable(Identifier('double'), Identifier('b'), null)]),
  Identifier('foo'),
  BlockStatement([])
), [
  'int (*foo(int a, double b))(bool)[] {',
  '}',
]);

// declare foo as function (pointer to int, double, pointer to function (pointer to void, pointer to int) returning bool) returning int
test(FunctionDeclaration([],
  FunctionType(
    Identifier('int'), [
    Variable(PointerType(Identifier('int')), null, null),
    Variable(Identifier('double'), null, null),
    Variable(PointerType(
      FunctionType(
        Identifier('bool'), [
        Variable(PointerType(Identifier('void')), null, null),
        Variable(ReferenceType(Identifier('int')), null, null)])),
      null, null)]),
  Identifier('foo'),
  BlockStatement([])
), [
  'int foo(int *, double, bool (*)(void *, int &)) {',
  '}',
]);
