export default {
  'basic-interval': {
    name: 'Basic interval',
    code: `Rx.Observable
  .interval(1000)
  .take(4)
`,
    timeWindow: 5000
  },
  'random-error': {
    name: 'Random error',
    code: `Rx.Observable
  .create(observer => {
    let n = 1;

    setInterval(() => {
      if (Math.random() < 0.8 && n < 9) {
        observer.next(n * n);
        n += 1;
      } else {
        observer.error('Oh no...');
      }
    }, 1000);
  })
`,
    timeWindow: 10000
  },
  'chess-board-diagonal': {
    name: 'Chess board diagonal',
    code: `const columns$ = Rx.Observable
  .of('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h');

const rows$ = Rx.Observable
  .interval(1000)
  .map(n => n + 1);

Rx.Observable
  .zip(columns$, rows$, (column, row) => \`\${column}\${row}\`)
`,
    timeWindow: 9000
  },
  'higher-order-observable': {
    name: 'Higher order Observable',
    code: `Rx.Observable
  .interval(1000)
  .groupBy(n => n % 2)
`,
    timeWindow: 10000
  },
  'grouped-fibonacci': {
    name: 'Grouped Fibonacci',
    code: `Rx.Observable
  .create(observer => {
    let secondLast = 1, last = 0;

    setInterval(() => {
      const next = secondLast + last;

      observer.next(next);

      secondLast = last;
      last = next;
    }, 1000);
  })
  .delay(100)
  .groupBy(n => Math.floor(Math.log10(n)))
`,
    timeWindow: 15000
  },
  'today-is': {
    name: 'Today is...',
    code: `const sentence = new Date().toString().toUpperCase();
const words = sentence.split(' ');
const delay = 1000;

const wordDelay = i =>
  i === 0
    ? delay
    : (words[i - 1].length + 1) * delay;

const wordStart = i =>
  i < words.length
    ? Rx.Observable
        .of(i)
        .delay(wordDelay(i))
    : Rx.Observable
        .empty()
        .delay(wordDelay(i));

const wordObservable = word => {
  const letters = word.split('');

  return Rx.Observable
    .interval(delay)
    .take(letters.length)
    .map(i => letters[i]);
};

Rx.Observable
  .range(0, words.length + 1)
  .concatMap(wordStart)
  .map(i => wordObservable(words[i]))
`,
    timeWindow: 17000
  },
  'custom-operator': {
    name: 'Custom operator',
    code: `Rx.Observable.prototype.sqrt = function sqrt() {
  return Rx.Observable.create(observer =>
    this.subscribe(
      value => {
        const result = Math.sqrt(value);

        if (typeof value !== 'number' || isNaN(result)) {
          observer.error(\`Square root of \${value} doesn't exist\`);
        } else {
          observer.next(result);
        }
      },
      err => observer.error(err),
      () => observer.complete()
    )
  );
};

Rx.Observable
  .interval(1000)
  .sqrt()
`,
    timeWindow: 12000
  },
  'mouse-move': {
    name: 'Mouse move',
    code: `Rx.Observable
  .fromEvent(document, 'mousemove')
  .map(event => event.clientX)
  .throttleTime(300)

// Move your mouse left and right after pressing Visualize.
`,
    timeWindow: 10000
  },
  'pause-and-resume': {
    name: 'Pause and resume',
    code: `const pauseResume$ = Rx.Observable
  .fromEvent(document, 'click')
  .scan(acc => !acc, true)
  .startWith(true);

const counter$ = Rx.Observable
  .interval(1000)
  .map(n => n + 1)
  .startWith(0);

const empty$ = Rx.Observable.empty();

pauseResume$
  .switchMap(resume => resume ? counter$ : empty$)

// Click to pause, then click to resume.
`,
    timeWindow: 20000
  },
  custom: {
    name: 'Custom',
    code: `/*
  Write any JavaScript you want, just make sure that
  the last expression is an Rx.Observable
 */
 `,
    timeWindow: 10000
  }
};
