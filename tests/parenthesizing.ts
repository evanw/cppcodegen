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

test(UnaryExpression('++', true,
  UnaryExpression('--', false,
    Identifier('foo'))
), [
  '++foo--',
]);

test(UnaryExpression('--', false,
  UnaryExpression('++', true,
    Identifier('foo'))
), [
  '(++foo)--',
]);

test(UnaryExpression('--', true,
  UnaryExpression('--', true,
    Identifier('foo'))
), [
  '-- --foo',
]);

test(UnaryExpression('++', false,
  UnaryExpression('++', false,
    Identifier('foo'))
), [
  'foo++ ++',
]);

test(CallExpression(
  BinaryExpression('.*',
    Identifier('a'),
    Identifier('b')), [
  IntegerLiteral(1)]
), [
  '(a.*b)(1)',
]);

test(CallExpression(
  BinaryExpression('->*',
    Identifier('a'),
    Identifier('b')), [
  IntegerLiteral(1)]
), [
  '(a->*b)(1)',
]);

test(BinaryExpression('.*',
    Identifier('a'),
    CallExpression(Identifier('b'), [])
), [
  'a.*b()',
]);

test(BinaryExpression('->*',
    Identifier('a'),
    CallExpression(Identifier('b'), [])
), [
  'a->*b()',
]);

test(SpecializeTemplate(
  Identifier('a'), [
  BinaryExpression('>',
    Identifier('b'),
    Identifier('c'))]
), [
  'a<(b > c)>',
]);

test(SpecializeTemplate(
  Identifier('a'), [
  SpecializeTemplate(
    Identifier('b'), [
    BinaryExpression('>',
      Identifier('c'),
      Identifier('d'))])]
), [
  'a<b<(c > d)> >',
]);

test(SpecializeTemplate(
  Identifier('a'), [
  BinaryExpression('&',
    Identifier('b'),
    BinaryExpression('>',
      Identifier('c'),
      Identifier('d')))]
), [
  'a<(b & c > d)>',
]);

test(SpecializeTemplate(
  Identifier('a'), [
  BinaryExpression('[]',
    Identifier('b'),
    BinaryExpression('>',
      Identifier('c'),
      Identifier('d')))]
), [
  'a<b[c > d]>',
]);

test(SpecializeTemplate(
  Identifier('a'), [
    BinaryExpression('*',
      Identifier('b'),
      BinaryExpression('+',
        Identifier('c'),
        BinaryExpression('>',
          Identifier('d'),
          Identifier('e'))))]
), [
  'a<b * (c + (d > e))>',
]);

test(SpecializeTemplate(
  Identifier('a'), [
  BinaryExpression('&',
    StringLiteral('('),
    BinaryExpression('>',
      Identifier('b'),
      Identifier('c')))]
), [
  'a<("(" & b > c)>',
]);
