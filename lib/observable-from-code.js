import * as RxSources from 'rxjs';
import * as RxOperators from 'rxjs/operators';

const Rx = {
  sources: RxSources,
  operators: RxOperators
};
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

export const getObservableFromCode = (code, context) => {
  let observable$;

  try {
    observable$ = evalInContext(code, {
      ...context,
      Rx,
      RxOperators,
      RxSources
    });
  } catch (e) {
    return {
      error: e.message
    };
  }

  if (!(observable$ instanceof RxSources.Observable)) {
    return {
      error: 'Last expression must be an Observable'
    };
  }

  return {
    observable$
  };
};
