import {
  defaultMainColor,
  defaultShapeColor,
  defaultObservableColor,
  colors
} from './colors';

it('defaultShapeColor is exported', () => {
  expect(typeof defaultShapeColor).toBe('string');
});

it('defaultObservableColor is exported', () => {
  expect(typeof defaultObservableColor).toBe('string');
});

it('defaultMainColor is exported', () => {
  expect(typeof defaultMainColor).toBe('string');
});

it('colors is exported', () => {
  expect(Array.isArray(colors)).toBe(true);
  expect(colors.length).toBeGreaterThan(5);
});
