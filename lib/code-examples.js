export default {
  'basic-interval': {
    name: 'Basic interval',
    code: `const { interval } = Rx.sources;
const { take } = Rx.operators;

interval(1000).pipe(take(4));
`,
    timeWindow: 5000
  },
  'random-error': {
    name: 'Random error',
    code: `const { Observable } = Rx.sources;
const { take } = Rx.operators;
Observable.create(observer => {
  let n = 1;
  const intervalId = setInterval(() => {
    if (Math.random() < 0.8 && n < 9) {
      observer.next(n * n);
      n += 1;
    } else {
      observer.error('Oh no...');
    }
  }, 1000);

  return () => clearInterval(intervalId);
  })
`,
    timeWindow: 10000
  },
  'chess-game': {
    name: 'Chess game',
    code: `const { of, interval } = Rx.sources;
const { zip, map } = Rx.operators;
const timer$ = interval(1000);
const pieces$ = of('', '♞', '', '♞', '♘', '♞');
const columns$ = of('e', 'c', 'g', 'd', 'e', 'f');
const rows$ = of('4', '6', '4', '4', '2', '3');
timer$.pipe(
  zip(
    pieces$,
    columns$,
    rows$
  ),
  map(([timer, piece, column, row]) => {
    return \`\${piece}\${column}\${row}\`
  })
);
`,
    timeWindow: 7000
  },
  'higher-order-observable': {
    name: 'Higher order Observable',
    code: `const { interval } = Rx.sources;
const { groupBy } = Rx.operators;

interval(1000).pipe(groupBy(n => n % 2));
`,
    timeWindow: 10000
  },
  'grouped-fibonacci': {
    name: 'Grouped Fibonacci',
    code: `
const { interval } = Rx.sources;
const { scan, pluck, groupBy } = Rx.operators;

interval(1000).pipe(
  scan(
    ({ secondLast, last }) => ({
      secondLast: last,
      last: last + secondLast
    }),
    { secondLast: 0, last: 1 }
  ),
  pluck("secondLast"),
  groupBy(n => Math.floor(Math.log10(n)))
);
    
`,
    timeWindow: 15000
  },
  'today-is': {
    name: 'Today is...',
    code: `
const { of, interval, range, EMPTY } = Rx.sources;
const { delay, take, map, concatMap } = Rx.operators;
const sentence = new Date().toString().toUpperCase();
const words = sentence.split(' ');
const delayMS = 1000;

const wordDelay = i =>
  i === 0
    ? delayMS
    : (words[i - 1].length + 1) * delayMS;

const wordStart = i =>
  i < words.length
    ? of(i).pipe(delay(wordDelay(i)))
    : EMPTY.pipe(delay(wordDelay(i)))

const wordObservable = word => {
  const letters = word.split('');

  return interval(delay).pipe(
    take(letters.length),
    map(i => letters[i])
  );
};

range(0, words.length + 1).pipe(
  concatMap(wordStart),
  map(i => wordObservable(words[i]))
)
`,
    timeWindow: 17000
  },
  'custom-operator': {
    name: 'Custom operator',
    code: `const { Observable, interval } = Rx.sources;

const sqrt = source$ => Observable.create(observer =>
  source$.subscribe(
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

interval(1000).pipe(sqrt)
    
`,
    timeWindow: 12000
  },
  'mouse-move': {
    name: 'Mouse move',
    code: `const { fromEvent } = Rx.sources;
const { map, throttleTime } = Rx.operators;

fromEvent(document, 'mousemove').pipe(
  map(event => event.clientX),
  throttleTime(300)
)

// Move your mouse over the right hand pane
// after clicking Visualize.
`,
    timeWindow: 10000
  },
  'input-element': {
    name: 'Input element',
    code: `const input = document.createElement('input');

input.setAttribute('placeholder', 'Type something');

/*
  \`output\` represents the right hand pane.
  You can prepend/append elements to it.
 */
output.prepend(input);

input.focus();
const { fromEvent } = Rx.sources;
const { map, filter } = Rx.operators;
fromEvent(input, 'keydown').pipe(
  map(e => e.key),
  filter(key => key !== ' ')
)
  
`,
    timeWindow: 20000
  },
  'pause-and-resume': {
    name: 'Pause and resume',
    code: `const { fromEvent, timer, EMPTY } = Rx.sources;
const { scan, startWith, map, filter, switchMap } = Rx.operators;

const pauseResume$ = fromEvent(document, 'click').pipe(
  scan(acc => !acc, true),
  startWith(true)
);

const counter$ = timer(0, 1000);

const empty$ = EMPTY

pauseResume$.pipe(
  switchMap(resume => resume ? counter$ : empty$)
)
// Click to pause and resume over the right hand pane
// after clicking Visualize.
`,
    timeWindow: 20000
  },
  custom: {
    name: 'Custom',
    code: `/*
  Write any JavaScript you want, just make sure that
  the last expression is an Rx.Observable
 */
const {} = Rx.sources;
const {} = Rx.operators;
 `,
    timeWindow: 10000
  }
};
