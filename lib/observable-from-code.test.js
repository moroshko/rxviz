import { Observable } from 'rxjs';
import { getObservableFromCode } from './observable-from-code';

const expectError = code => {
  const result = getObservableFromCode(code);

  expect(typeof result.error).toBe('string');
};

const expectObservable = code => {
  const result = getObservableFromCode(code);

  expect(result.error).toBeUndefined();
  expect(result.observable$).toBeInstanceOf(Observable);
};

it('returns an error when there is a syntax error', () => {
  expectError('syntax error here');
});

it('returns an error when there is no code', () => {
  expectError(' ');
});

it('returns an error when the last expression is not an Observable', () => {
  expectError('5');
});

it('handles a simple Observable', () => {
  expectObservable('Rx.interval(1000)');
});

it('handles a higher order Observable', () => {
  expectObservable('Rx.interval(1000).pipe(RxOperators.groupBy(x => x % 2))');
});

it('handles multiple statements', () => {
  expectObservable(
    `const first$ = Rx.Observable.create(observer => {
      setTimeout(() => observer.next('1'), 1000);
      setTimeout(() => observer.complete(), 3000);
    });
    const second$ = Rx.Observable.create(observer => {
      setTimeout(() => observer.next('A'), 2000);
      setTimeout(() => observer.complete(), 4000);
    });
    first$.pipe(RxOperators.merge(second$));

  `
  );
});
