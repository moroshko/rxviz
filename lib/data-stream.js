import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import isUndefined from 'lodash.isundefined';
import isFunction from 'lodash.isfunction';

const isObservable = value => !!value && isFunction(value.subscribe);

export const getEmptyObservableData = () => ({
  type: 'observable',
  values: []
});

const getError = error => {
  if (error && typeof error.message === 'string') {
    return error.message;
  }

  if (isUndefined(error)) {
    return true;
  }

  return error;
};

export const getDataStream = ({ observable$, timeout }) => {
  return Observable.create(observer => {
    let subscriptions = [],
      timeoutId;
    const start = Date.now();

    const unsubscribeFromAll = () => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };

    /*
      `path` is a series of value indices that leads to the observable where
      our value resides. It is used to insert our value into the JSON object
      that represents the snapshot.

      Example:

      ----A---*-----*---------------------------------   <-- path = [] points
              |     |                                        to this observable
              +---C---D---*---E--|
                    |     |
                    +--F------|                          <-- path = [2] points
                          |                                  to this observable
                          +---F---G---H---*-----------
                                          |
                                          +---I---J---   <-- path = [1, 2, 3] points
                                                             to this observable

      `path` has nothing to do with `observableIndex`.
      The algorithm that `getModel()` implements is responsible for
      deciding where to draw the observables (i.e. setting the `observableIndex`s).
      The observable above, for example, could be drawn like this:

      ----A---*-----*---------------------------------
              |     |
              +---C---D---*---E--|
                    |     |
                    |     +---F---G---H---*-----------
                    |                     |
                    |                     +---I---J---
                    |
                    +--F------|

      Note that, observables' `path`s did not change,
      but some `observableIndex`s did!
     */
    const subscribe = (obs$, path) => {
      const subscription = obs$
        .pipe(
          scan(
            (acc, value) => ({
              value,
              index: acc.index + 1
            }),
            { index: -1 }
          )
        )
        .subscribe(
          ({ value, index }) => {
            const isValueObservable = isObservable(value);

            observer.next({
              value: {
                time: Date.now() - start,
                ...(isValueObservable ? getEmptyObservableData() : { value })
              },
              path,
              isObservable: isValueObservable
            });

            if (isValueObservable) {
              subscribe(value, path.concat(index));
            }
          },
          error => {
            observer.next({
              value: {
                time: Date.now() - start,
                error: getError(error)
              },
              path
            });

            /*
              This is just a convenient method to signal RxViz to stop
              the animation.
              `setTimeout` is needed here because, if we have a higher order
              Observable that errors, and we call .error() immediately,
              not all inner Observables will report errors to RxViz.
              This is because we report errors to RxViz using .next(), and
              once .error() is called, the observer won't emit .next() anymore.
              Having a `setTimeout` here makes sure that that all .next() errors
              are emitted before calling .error().
             */
            setTimeout(() => {
              observer.error();
            });
          },
          () => {
            observer.next({
              value: {
                time: Date.now() - start,
                completed: true
              },
              path
            });

            /*
              `setTimeout` is required here because, we need to make sure that
              `clearTimeout` is called AFTER the timeout timer is set,
              and, if observable$ completes immediately, this complete() handler
              will be invoked BEFORE the timeout timer is set.
              Also, `subscription.closed` for this completed subscription
              won't be `true` at this point. We need to wait until the next
              tick to make sure its value is updated.
             */
            setTimeout(() => {
              if (subscriptions.every(subscription => subscription.closed)) {
                clearTimeout(timeoutId);
                observer.complete();
              }
            });
          }
        );

      subscriptions.push(subscription);
    };

    subscribe(observable$, []);

    timeoutId = setTimeout(() => {
      /*
        We call observer.next() rather than observer.complete() here, because
        we'd like to differentiate between observable$ completion and timeout
        completion. In both cases, in RxViz, we cancel the animation progress.
        But, on timeout, we also transition to RxVizSnapshot where we don't
        render the grey axis. Unfortunately, observer.complete() doesn't accept
        any arguments.
       */
      observer.next({
        value: {
          meta: true,
          timeout: true
        }
        // path is not used for meta values, so can be whatever.
      });
      unsubscribeFromAll();
      clearTimeout(timeoutId);
    }, timeout);

    return () => {
      unsubscribeFromAll();
      clearTimeout(timeoutId);
    };
  });
};
