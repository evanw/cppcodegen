test(BinaryExpression('+',
  IntegerLiteral(1),
  BinaryExpression('*',
    IntegerLiteral(2),
    IntegerLiteral(3))
), [
  '1 + 2 * 3',
]);

test(BinaryExpression('*',
  IntegerLiteral(1),
  BinaryExpression('+',
    IntegerLiteral(2),
    IntegerLiteral(3))
), [
  '1 * (2 + 3)',
]);

test(CallExpression(
  Identifier('foo'),
  [SequenceExpression([
    IntegerLiteral(2),
    IntegerLiteral(3)])]
), [
  'foo((2, 3))',
]);

test(CallExpression(
  AssignmentExpression('=',
    Identifier('foo'),
    IntegerLiteral(2)),
  [IntegerLiteral(3)]
), [
  '(foo = 2)(3)',
]);

test(MemberExpression('.',
  AssignmentExpression('=',
    Identifier('foo'),
    IntegerLiteral(2)),
  Identifier('foo')
), [
  '(foo = 2).foo',
]);

test(BinaryExpression('->*',
  MemberExpression('.',
    Identifier('a'),
    Identifier('b')),
  MemberExpression('.',
    Identifier('c'),
    Identifier('d'))
), [
  'a.b->*c.d',
]);

test(UnaryExpression('-', true,
  BinaryExpression('+',
    IntegerLiteral(1),
    IntegerLiteral(2))
), [
  '-(1 + 2)',
]);

test(UnaryExpression('-', true,
  UnaryExpression('-', true,
    IntegerLiteral(1))
), [
  '- -1',
]);

test(UnaryExpression('+', true,
  UnaryExpression('+', true,
    IntegerLiteral(1))
), [
  '+ +1',
]);

test(UnaryExpression('+', true,
  UnaryExpression('-', true,
    IntegerLiteral(1))
), [
  '+-1',
]);

test(UnaryExpression('-', true,
  UnaryExpression('+', true,
    IntegerLiteral(1))
), [
  '-+1',
]);

test(UnaryExpression('sizeof', true,
  Identifier('foo')
), [
  'sizeof foo',
]);

test(UnaryExpression('sizeof', true,
  MemberExpression('::',
    Identifier('foo'),
    Identifier('bar'))
), [
  'sizeof foo::bar',
]);

test(MemberExpression('::',
  UnaryExpression('sizeof', true, Identifier('foo')),
  Identifier('bar')
), [
  '(sizeof foo)::bar',
]);
