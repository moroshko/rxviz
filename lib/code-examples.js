export default {
  combination: {
    name: 'Combination',
    childExamples: [
      {
        id: 'fork-join',
        name: 'Fork Join',
        code: ``,
        timeWindow: 5000
      },
      {
        id: 'zip',
        name: 'Zip',
        code: ``,
        timeWindow: 5000
      }
    ]
  },
  conditional: {
    name: 'Conditional',
    childExamples: [
      {
        id: 'default-empty',
        name: 'Default Empty',
        code: ``,
        timeWindow: 5000
      },
      {
        id: 'default empty',
        name: 'Every',
        code: ``,
        timeWindow: 5000
      }
    ]
  },
  creation: {
    name: 'Creations',
    childExamples: [
      {
        id: 'create',
        name: 'Create',
        code: ``,
        timeWindow: 5000
      },
      {
        id: 'of',
        name: 'Of',
        code: ``,
        timeWindow: 5000
      }
    ]
  },
  'error-handling': {
    name: 'Error Handling',
    childExamples: [
      {
        id: 'catch-error',
        name: 'Catch Error',
        code: ``,
        timeWindow: 5000
      },
      {
        id: 'retry',
        name: 'Retry',
        code: ``,
        timeWindow: 5000
      }
    ]
  },
  multicasting: {
    name: 'Multicasting',
    childExamples: [
      {
        id: 'publish',
        name: 'Publish',
        code: ``,
        timeWindow: 5000
      },
      {
        id: 'multicast',
        name: 'Multicast',
        code: ``,
        timeWindow: 5000
      }
    ]
  },
  filtering: {
    name: 'Filtering',
    childExamples: [
      {
        id: 'debounce-time',
        name: 'Debounce Time',
        code: ``,
        timeWindow: 5000
      },
      {
        id: 'distinct-until-changed',
        name: 'Distinct Until Changed',
        code: ``,
        timeWindow: 5000
      }
    ]
  },
  transformation: {
    name: 'Transformation',
    childExamples: [
      {
        id: 'buffer',
        name: 'Buffer',
        code: ``,
        timeWindow: 5000
      },
      {
        id: 'map',
        name: 'Map',
        code: ``,
        timeWindow: 5000
      }
    ]
  },
  utility: {
    name: 'Utility',
    childExamples: [
      {
        id: 'tap',
        name: 'Tap',
        code: ``,
        timeWindow: 5000
      },
      {
        id: 'let',
        name: 'Let',
        code: ``,
        timeWindow: 5000
      }
    ]
  },
  recipes: {
    name: 'Recipes',
    childExamples: [
      {
        id: 'http-polling',
        name: 'HTTP Polling',
        code: ``,
        timeWindow: 5000
      },
      {
        id: 'game-loop',
        name: 'Game Loop',
        code: ``,
        timeWindow: 5000
      }
    ]
  },
  custom: {
    name: 'Custom',
    code: `// Write any JavaScript you want, just make sure that
               // the last expression is an Rx.Observable
               const {  } = Rx;
               const {  } = RxOperators;`,
    timeWindow: 10000
  }
};
