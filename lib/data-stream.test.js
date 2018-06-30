import { Observable, interval } from 'rxjs';
import { groupBy } from 'rxjs/operators';
import lolex from 'lolex';
import { isTimeout } from './data-parser';
import { getEmptyObservableData, getDataStream } from './data-stream';

const clock = lolex.install();

const processObservable = ({ observable$, timeout, timeToRun }) =>
  new Promise(resolve => {
    const data$ = getDataStream({ observable$, timeout });
    let items = [];

    data$.subscribe(
      item => {
        items.push(item);

        if (isTimeout(item.value)) {
          resolve({ items });
        }
      },
      error => resolve({ items, error }),
      () => resolve({ items })
    );

    /*
      We add 1 tick here because data$'s complete handler
      is called 1 tick after observable$ is completed.
      Same with the error handler.
     */
    clock.tick(timeToRun + 1);
  });

describe('getEmptyObservableData', () => {
  it('returns empty observable values', () => {
    expect(getEmptyObservableData()).toEqual({
      type: 'observable',
      values: []
    });
  });
});

describe('getDataStream', () => {
  it('handles Observable that emits various types of items and completes', () => {
    const func = () => 1;
    const obj = new Object();

    return processObservable({
      observable$: Observable.create(observer => {
        setTimeout(() => observer.next(null), 100);
        setTimeout(() => observer.next(undefined), 200);
        setTimeout(() => observer.next(1), 300);
        setTimeout(() => observer.next(-5.6), 400);
        setTimeout(() => observer.next(NaN), 500);
        setTimeout(() => observer.next(''), 600);
        setTimeout(() => observer.next('hello'), 700);
        setTimeout(() => observer.next(func), 800);
        setTimeout(() => observer.next(Math.min), 900);
        setTimeout(() => observer.next(obj), 1000);
        setTimeout(() => observer.complete(), 1100);
      }),
      timeout: 1200,
      timeToRun: 1200
    }).then(result => {
      expect(result).toEqual({
        items: [
          { isObservable: false, path: [], value: { time: 100, value: null } },
          {
            isObservable: false,
            path: [],
            value: { time: 200, value: undefined }
          },
          { isObservable: false, path: [], value: { time: 300, value: 1 } },
          { isObservable: false, path: [], value: { time: 400, value: -5.6 } },
          { isObservable: false, path: [], value: { time: 500, value: NaN } },
          { isObservable: false, path: [], value: { time: 600, value: '' } },
          {
            isObservable: false,
            path: [],
            value: { time: 700, value: 'hello' }
          },
          { isObservable: false, path: [], value: { time: 800, value: func } },
          {
            isObservable: false,
            path: [],
            value: { time: 900, value: Math.min }
          },
          { isObservable: false, path: [], value: { time: 1000, value: obj } },
          {
            path: [],
            value: { time: 1100, completed: true }
          }
        ]
      });
    });
  });

  it('handles Observable that completes itself but not its children Observables', () => {
    return processObservable({
      observable$: Observable.create(observer => {
        setTimeout(() => {
          observer.next(interval(1000));
          observer.complete();
        }, 1000);
      }),
      timeout: 5000,
      timeToRun: 5000
    }).then(result => {
      expect(result).toEqual({
        items: [
          {
            isObservable: true,
            path: [],
            value: { time: 1000, type: 'observable', values: [] }
          },
          { path: [], value: { completed: true, time: 1000 } },
          { isObservable: false, path: [0], value: { time: 2000, value: 0 } },
          { isObservable: false, path: [0], value: { time: 3000, value: 1 } },
          { isObservable: false, path: [0], value: { time: 4000, value: 2 } },
          { value: { meta: true, timeout: true } }
        ]
      });
    });
  });

  it('handles Observable that errors with a string error', () => {
    return processObservable({
      observable$: Observable.create(observer => {
        setTimeout(() => observer.next('A'), 100);
        setTimeout(() => observer.next('B'), 200);
        setTimeout(() => observer.error('oops'), 300);
      }),
      timeout: 1000,
      timeToRun: 300
    }).then(result => {
      expect(result).toEqual({
        items: [
          { isObservable: false, path: [], value: { time: 100, value: 'A' } },
          { isObservable: false, path: [], value: { time: 200, value: 'B' } },
          { path: [], value: { time: 300, error: 'oops' } }
        ],
        error: undefined
      });
    });
  });

  it('handles Observable that errors with a ReferenceError', () => {
    return processObservable({
      observable$: Observable.create(observer => {
        setTimeout(
          () => observer.error(new ReferenceError('len is not defined')),
          100
        );
      }),
      timeout: 1000,
      timeToRun: 100
    }).then(result => {
      expect(result).toEqual({
        items: [
          {
            path: [],
            value: { time: 100, error: 'len is not defined' }
          }
        ],
        error: undefined
      });
    });
  });

  it('handles Observable that errors without specifying an error', () => {
    return processObservable({
      observable$: Observable.create(observer => {
        setTimeout(() => observer.next('A'), 100);
        setTimeout(() => observer.error(), 200);
      }),
      timeout: 1000,
      timeToRun: 200
    }).then(result => {
      expect(result).toEqual({
        items: [
          { isObservable: false, path: [], value: { time: 100, value: 'A' } },
          { path: [], value: { time: 200, error: true } }
        ],
        error: undefined
      });
    });
  });

  it('handles a higher order Observable that errors', () => {
    return processObservable({
      observable$: Observable.create(observer => {
        let i = 0;

        setInterval(() => {
          if (i === 3) {
            observer.error('oh no!');
          } else {
            observer.next(i++);
          }
        }, 100);
      }).pipe(groupBy(n => n % 2)),
      timeout: 800,
      timeToRun: 500
    }).then(result => {
      expect(result).toEqual({
        items: [
          {
            isObservable: true,
            path: [],
            value: { time: 100, type: 'observable', values: [] }
          },
          { isObservable: false, path: [0], value: { time: 100, value: 0 } },
          {
            isObservable: true,
            path: [],
            value: { time: 200, type: 'observable', values: [] }
          },
          { isObservable: false, path: [1], value: { time: 200, value: 1 } },
          { isObservable: false, path: [0], value: { time: 300, value: 2 } },
          { path: [0], value: { error: 'oh no!', time: 400 } },
          { path: [1], value: { error: 'oh no!', time: 400 } },
          { path: [], value: { error: 'oh no!', time: 400 } }
        ],
        error: undefined
      });
    });
  });

  it('handles Observable that times out', () => {
    return processObservable({
      observable$: interval(100),
      timeout: 230,
      timeToRun: 230
    }).then(result => {
      expect(result).toEqual({
        items: [
          { isObservable: false, path: [], value: { time: 100, value: 0 } },
          { isObservable: false, path: [], value: { time: 200, value: 1 } },
          { value: { meta: true, timeout: true } } // path is not used for meta values, so can be whatever.
        ]
      });
    });
  });

  it('handles higher order Observable', () => {
    return processObservable({
      observable$: Observable.create(observer => {
        let secondLast = 1,
          last = 0;

        setInterval(() => {
          const next = secondLast + last;

          observer.next(next);

          secondLast = last;
          last = next;
        }, 100);
      }).pipe(groupBy(n => Math.floor(Math.log10(n)))),
      timeout: 1500,
      timeToRun: 1500
    }).then(result => {
      expect(result).toEqual({
        items: [
          {
            isObservable: true,
            path: [],
            value: { time: 100, type: 'observable', values: [] }
          },
          { isObservable: false, path: [0], value: { time: 100, value: 1 } },
          { isObservable: false, path: [0], value: { time: 200, value: 1 } },
          { isObservable: false, path: [0], value: { time: 300, value: 2 } },
          { isObservable: false, path: [0], value: { time: 400, value: 3 } },
          { isObservable: false, path: [0], value: { time: 500, value: 5 } },
          { isObservable: false, path: [0], value: { time: 600, value: 8 } },
          {
            isObservable: true,
            path: [],
            value: { time: 700, type: 'observable', values: [] }
          },
          { isObservable: false, path: [1], value: { time: 700, value: 13 } },
          { isObservable: false, path: [1], value: { time: 800, value: 21 } },
          { isObservable: false, path: [1], value: { time: 900, value: 34 } },
          { isObservable: false, path: [1], value: { time: 1000, value: 55 } },
          { isObservable: false, path: [1], value: { time: 1100, value: 89 } },
          {
            isObservable: true,
            path: [],
            value: { time: 1200, type: 'observable', values: [] }
          },
          { isObservable: false, path: [2], value: { time: 1200, value: 144 } },
          { isObservable: false, path: [2], value: { time: 1300, value: 233 } },
          { isObservable: false, path: [2], value: { time: 1400, value: 377 } },
          { isObservable: false, path: [2], value: { time: 1500, value: 610 } },
          { value: { meta: true, timeout: true } }
        ]
      });
    });
  });

  it('handles deep higher order Observable', () => {
    const first$ = Observable.create(observer => {
      setTimeout(() => {
        observer.next(1);
        observer.complete();
      }, 1000);
    });

    const second$ = Observable.create(observer => {
      observer.next(2);

      setTimeout(() => observer.complete(), 500);
    });

    const third$ = Observable.create(observer => {
      setTimeout(() => observer.next(second$), 1000);
    });

    const fourth$ = Observable.create(observer => {
      setTimeout(() => observer.next(4), 1000);
      setTimeout(() => observer.next(first$), 4000);
    });

    const fifth$ = Observable.create(observer => {
      setTimeout(() => observer.next(third$), 3000);
    });

    const sixth$ = Observable.create(observer => {
      setTimeout(() => observer.next(fifth$), 1000);
      setTimeout(() => observer.next(fourth$), 2000);
      setTimeout(() => observer.complete(), 3000);
    });

    return processObservable({
      observable$: sixth$,
      timeout: 8000,
      timeToRun: 8000
    }).then(result => {
      expect(result).toEqual({
        items: [
          {
            isObservable: true,
            path: [],
            value: { time: 1000, type: 'observable', values: [] }
          },
          {
            isObservable: true,
            path: [],
            value: { time: 2000, type: 'observable', values: [] }
          },
          { path: [], value: { completed: true, time: 3000 } },
          { isObservable: false, path: [1], value: { time: 3000, value: 4 } },
          {
            isObservable: true,
            path: [0],
            value: { time: 4000, type: 'observable', values: [] }
          },
          {
            isObservable: true,
            path: [0, 0],
            value: { time: 5000, type: 'observable', values: [] }
          },
          {
            isObservable: false,
            path: [0, 0, 0],
            value: { time: 5000, value: 2 }
          },
          { path: [0, 0, 0], value: { completed: true, time: 5500 } },
          {
            isObservable: true,
            path: [1],
            value: { time: 6000, type: 'observable', values: [] }
          },
          {
            isObservable: false,
            path: [1, 1],
            value: { time: 7000, value: 1 }
          },
          { path: [1, 1], value: { completed: true, time: 7000 } },
          { value: { meta: true, timeout: true } }
        ]
      });
    });
  });
});
