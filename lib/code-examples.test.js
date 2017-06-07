import codeExamples from './code-examples';

it('has at least one code example', () => {
  expect(Object.keys(codeExamples).length).toBeGreaterThanOrEqual(1);
});

it('code examples have the right shape', () => {
  for (const exampleId in codeExamples) {
    const { name, code, timeWindow } = codeExamples[exampleId];

    expect(typeof name).toBe('string');
    expect(typeof code).toBe('string');
    expect(typeof timeWindow).toBe('number');
  }
});
