import Rx from 'rxjs';

const evalInContext = (code, context) => {
  const scope = Object.keys(context)
    .map(key => `let ${key} = this.${key};\n`)
    .join('');

  const codeToEvaluate = `${scope}${code}`;

  // Note that arrow function won't work here because we explicitely set `this` to `context`.
  return function() {
    return eval(codeToEvaluate); // eslint-disable-line no-eval
  }.call(context);
};

export const getObservableFromCode = code => {
  let observable$;

  try {
    observable$ = evalInContext(code, { Rx });
  } catch (e) {
    return {
      error: e.message
    };
  }

  if (!(observable$ instanceof Rx.Observable)) {
    return {
      error: 'Last expression must be an Observable'
    };
  }

  return {
    observable$
  };
};
