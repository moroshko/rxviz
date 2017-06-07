import sortBy from 'lodash.sortby';
import {
  defaultMainColor,
  defaultShapeColor,
  defaultObservableColor,
  colors
} from './colors';
import { isTimeout, updateData, getModel } from './data-parser';

const expectToEqual = (calculatedModel, expectedModel) => {
  expect(calculatedModel.observables).toEqual(expectedModel.observables);
  expect(sortBy(calculatedModel.connectors, 'time')).toEqual(
    expectedModel.connectors
  );
};

describe('isTimeout', () => {
  it('returns false if value is not an object', () => {
    expect(isTimeout(null)).toBe(false);
  });

  it('returns false if value is not meta', () => {
    expect(isTimeout({ timeout: true })).toBe(false);
  });

  it('returns false if value is meta but not timeout', () => {
    expect(isTimeout({ meta: true, something: 'else' })).toBe(false);
  });

  it('returns true if value is meta and timeout', () => {
    expect(isTimeout({ meta: true, timeout: true })).toBe(true);
  });
});

describe('updateData', () => {
  it('updates empty values with empty path', () => {
    const observable = {
      type: 'observable',
      values: [
        // Update here
      ]
    };
    const path = [];
    const value = {
      time: 1000,
      text: '1',
      textStyle: {
        fill: '#fff'
      },
      color: colors[1]
    };

    expect(updateData(observable, path, value)).toEqual({
      type: 'observable',
      values: [
        {
          time: 1000,
          text: '1',
          textStyle: {
            fill: '#fff'
          },
          color: colors[1]
        }
      ]
    });
  });

  it('updates non empty values with empty path', () => {
    const observable = {
      type: 'observable',
      values: [
        {
          time: 1000,
          text: '1',
          color: colors[1]
        }
        // Update here
      ]
    };
    const path = [];
    const value = {
      time: 3000,
      completed: true
    };

    expect(updateData(observable, path, value)).toEqual({
      type: 'observable',
      values: [
        {
          time: 1000,
          text: '1',
          color: colors[1]
        },
        {
          time: 3000,
          completed: true
        }
      ]
    });
  });

  it('updates values with simple path', () => {
    const observable = {
      type: 'observable',
      values: [
        {
          time: 1000,
          type: 'observable',
          values: [
            {
              time: 1000,
              text: '1'
            }
            // Update here
          ],
          color: colors[1]
        }
      ]
    };
    const path = [0];
    const value = {
      time: 2000,
      completed: true
    };

    expect(updateData(observable, path, value)).toEqual({
      type: 'observable',
      values: [
        {
          time: 1000,
          type: 'observable',
          values: [
            {
              time: 1000,
              text: '1'
            },
            {
              time: 2000,
              completed: true
            }
          ],
          color: colors[1]
        }
      ]
    });
  });

  it('updates values with deep path', () => {
    const observable = {
      type: 'observable',
      values: [
        {
          time: 1000,
          text: '1'
        },
        {
          time: 2000,
          type: 'observable',
          values: [
            {
              time: 2000,
              text: '2'
            },
            {
              time: 3000,
              text: '3'
            },
            {
              time: 4000,
              type: 'observable',
              values: [
                {
                  time: 4000,
                  type: 'observable',
                  values: [
                    {
                      time: 4000,
                      text: '4'
                    }
                    // Update here
                  ]
                }
              ]
            },
            {
              time: 6000,
              completed: true
            }
          ]
        }
      ]
    };
    const path = [1, 2, 0];
    const value = {
      time: 5000,
      completed: true
    };

    expect(updateData(observable, path, value)).toEqual({
      type: 'observable',
      values: [
        {
          time: 1000,
          text: '1'
        },
        {
          time: 2000,
          type: 'observable',
          values: [
            {
              time: 2000,
              text: '2'
            },
            {
              time: 3000,
              text: '3'
            },
            {
              time: 4000,
              type: 'observable',
              values: [
                {
                  time: 4000,
                  type: 'observable',
                  values: [
                    {
                      time: 4000,
                      text: '4'
                    },
                    {
                      time: 5000,
                      completed: true
                    }
                  ]
                }
              ]
            },
            {
              time: 6000,
              completed: true
            }
          ]
        }
      ]
    });
  });
});

describe('getModel', () => {
  it('returns model for non observable', () => {
    const data = 'non observable';

    expect(getModel({ data })).toEqual({
      observables: [],
      connectors: []
    });
  });

  it('returns model for empty observable', () => {
    const data = {
      type: 'observable',
      values: []
    };

    expect(getModel({ data })).toEqual({
      observables: [
        {
          values: [],
          startTime: 0,
          mainColor: defaultMainColor
        }
      ],
      connectors: []
    });
  });

  it('returns model for errored observable without tooltip', () => {
    const data = {
      type: 'observable',
      values: [
        {
          time: 1000,
          text: '1'
        },
        {
          time: 2000,
          error: true
        }
      ]
    };

    expect(getModel({ data })).toEqual({
      observables: [
        {
          values: [
            {
              time: 1000,
              text: '1',
              color: defaultShapeColor
            }
          ],
          error: {
            time: 2000
          },
          startTime: 0,
          endTime: 2000,
          mainColor: defaultMainColor
        }
      ],
      connectors: []
    });
  });

  it('returns model for errored observable with tooltip', () => {
    const data = {
      type: 'observable',
      values: [
        {
          time: 1000,
          text: '1'
        },
        {
          time: 2000,
          error: true,
          tooltip: {
            text: 'Something bad happened',
            textStyle: {
              fontFamily: 'monospace',
              whiteSpace: 'pre'
            }
          }
        }
      ]
    };

    expect(getModel({ data })).toEqual({
      observables: [
        {
          values: [
            {
              time: 1000,
              text: '1',
              color: defaultShapeColor
            }
          ],
          error: {
            time: 2000,
            tooltip: {
              text: 'Something bad happened',
              textStyle: {
                fontFamily: 'monospace',
                whiteSpace: 'pre'
              }
            }
          },
          startTime: 0,
          endTime: 2000,
          mainColor: defaultMainColor
        }
      ],
      connectors: []
    });
  });

  it('returns model for completed observable', () => {
    const data = {
      type: 'observable',
      values: [
        {
          time: 1000,
          text: '1',
          color: colors[1]
        },
        {
          time: 2000,
          text: '...',
          tooltip: {
            text: '12345678',
            textStyle: {
              fontSize: 10
            }
          }
        },
        {
          time: 3000,
          completed: true
        }
      ]
    };

    expect(getModel({ data })).toEqual({
      observables: [
        {
          values: [
            {
              time: 1000,
              text: '1',
              color: colors[1]
            },
            {
              time: 2000,
              text: '...',
              tooltip: {
                text: '12345678',
                textStyle: {
                  fontSize: 10
                }
              },
              color: defaultShapeColor
            }
          ],
          completed: {
            time: 3000,
            lastValueBeforeCompletedTime: 2000
          },
          startTime: 0,
          endTime: 3000,
          mainColor: defaultMainColor
        }
      ],
      connectors: []
    });
  });

  it('returns model for higher order observable', () => {
    const data = {
      type: 'observable',
      values: [
        {
          time: 1000,
          type: 'observable',
          values: [
            {
              time: 1000,
              text: '1'
            },
            {
              time: 3000,
              text: '3'
            }
          ],
          color: colors[1],
          tooltip: {
            text: 'This is observable'
          }
        },
        {
          time: 2000,
          type: 'observable',
          values: [
            {
              time: 2000,
              text: '2'
            },
            {
              time: 4000,
              text: '4'
            }
          ],
          color: 'blue'
        },
        {
          time: 3000,
          type: 'observable',
          values: [
            {
              time: 4000,
              completed: true
            }
          ],
          color: '#333'
        }
      ]
    };

    expectToEqual(getModel({ data }), {
      observables: [
        {
          values: [
            {
              time: 1000,
              isObservable: true,
              text: '',
              color: colors[1],
              tooltip: {
                text: 'This is observable'
              }
            },
            {
              time: 2000,
              isObservable: true,
              text: '',
              color: 'blue'
            },
            {
              time: 3000,
              isObservable: true,
              text: '',
              color: '#333'
            }
          ],
          startTime: 0,
          mainColor: defaultMainColor
        },
        {
          values: [
            {
              time: 1000,
              text: '1',
              color: defaultShapeColor
            },
            {
              time: 3000,
              text: '3',
              color: defaultShapeColor
            }
          ],
          startTime: 1000,
          mainColor: colors[1] /* Inherited color */
        },
        {
          values: [
            {
              time: 2000,
              text: '2',
              color: defaultShapeColor
            },
            {
              time: 4000,
              text: '4',
              color: defaultShapeColor
            }
          ],
          startTime: 2000,
          mainColor: 'blue' /* Inherited color */
        },
        {
          values: [],
          completed: {
            time: 4000
          },
          startTime: 3000,
          endTime: 4000,
          mainColor: '#333' /* Inherited color */
        }
      ],
      connectors: [
        {
          time: 1000,
          fromIndex: 0,
          toIndex: 1,
          color: colors[1]
        },
        {
          time: 2000,
          fromIndex: 0,
          toIndex: 2,
          color: 'blue'
        },
        {
          time: 3000,
          fromIndex: 0,
          toIndex: 3,
          color: '#333'
        }
      ]
    });
  });

  it('uses renderer to build the model', () => {
    const data = {
      type: 'observable',
      values: [
        {
          time: 1000,
          type: 'observable',
          values: [
            {
              time: 1000,
              value:
                '1' /* When renderer exists, values are passed, not text. */
            },
            {
              time: 2000,
              error: true
            }
          ]
        }
      ]
    };
    const renderer = ({ isObservable, isError, value }) => {
      if (isObservable) {
        return {
          text: 'OBS',
          color: 'blue'
        };
      }

      if (isError) {
        return {
          tooltip: {
            text: 'Error'
          }
        };
      }

      return {
        text: `Value: ${value}`,
        textStyle: {
          fontSize: 10
        }
      };
    };

    expectToEqual(getModel({ data, renderer }), {
      observables: [
        {
          values: [
            {
              time: 1000,
              isObservable: true,
              text: 'OBS',
              color: 'blue'
            }
          ],
          startTime: 0,
          mainColor: defaultMainColor
        },
        {
          values: [
            {
              time: 1000,
              text: 'Value: 1',
              textStyle: {
                fontSize: 10
              },
              color: defaultShapeColor
            }
          ],
          startTime: 1000,
          endTime: 2000,
          error: {
            error: true,
            time: 2000,
            tooltip: {
              text: 'Error'
            }
          },
          mainColor: 'blue' /* Inherited color */
        }
      ],
      connectors: [
        {
          time: 1000,
          fromIndex: 0,
          toIndex: 1,
          color: 'blue'
        }
      ]
    });
  });

  it('does not inherit main color when inheritMainColor is false', () => {
    const data = {
      type: 'observable',
      values: [
        {
          time: 1000,
          type: 'observable',
          values: [
            {
              time: 1000,
              text: '1'
            }
          ],
          color: colors[1]
        }
      ]
    };
    const inheritMainColor = false;

    expectToEqual(getModel({ data, inheritMainColor }), {
      observables: [
        {
          values: [
            {
              time: 1000,
              isObservable: true,
              text: '',
              color: colors[1]
            }
          ],
          startTime: 0,
          mainColor: defaultMainColor
        },
        {
          values: [
            {
              time: 1000,
              text: '1',
              color: defaultShapeColor
            }
          ],
          startTime: 1000,
          mainColor: defaultMainColor
        }
      ],
      connectors: [
        {
          time: 1000,
          fromIndex: 0,
          toIndex: 1,
          color: defaultMainColor
        }
      ]
    });
  });

  it('merges values when mergeThreshold exists', () => {
    const data = {
      type: 'observable',
      values: [
        {
          time: 1000,
          text: '1'
        },
        {
          time: 1010,
          text: '2'
        },
        {
          time: 1022,
          text: '3'
        },
        {
          time: 2000,
          text: '...',
          tooltip: {
            text: 'Four'
          }
        },
        {
          time: 2012,
          text: '5'
        }
      ]
    };
    const mergeThreshold = 100;

    expectToEqual(getModel({ data, mergeThreshold }), {
      observables: [
        {
          values: [
            {
              time: 1000,
              count: 3,
              text: '...',
              tooltip: {
                text: '1, 2, 3'
              },
              color: defaultShapeColor
            },
            {
              time: 2000,
              count: 2,
              text: '...',
              tooltip: {
                text: 'Four, 5'
              },
              color: defaultShapeColor
            }
          ],
          startTime: 0,
          mainColor: defaultMainColor
        }
      ],
      connectors: []
    });
  });

  it('returns model for deep higher order observable', () => {
    const data = {
      type: 'observable',
      values: [
        {
          time: 1000,
          type: 'observable',
          values: [
            {
              time: 1000,
              text: '1'
            },
            {
              time: 3000,
              type: 'observable',
              values: [
                {
                  time: 4000,
                  text: '4'
                },
                {
                  time: 4000,
                  completed: true
                }
              ]
            },
            {
              time: 5000,
              completed: true
            }
          ],
          color: '#123'
        },
        {
          time: 2000,
          type: 'observable',
          values: [
            {
              time: 2000,
              type: 'observable',
              values: [
                {
                  time: 2000,
                  text: '2'
                },
                {
                  time: 3000,
                  text: '3'
                },
                {
                  time: 3000,
                  completed: true
                }
              ],
              color: '#111'
            },
            {
              time: 4000,
              type: 'observable',
              values: [
                {
                  time: 4000,
                  text: '4'
                },
                {
                  time: 5000,
                  text: '5'
                }
              ],
              color: '#222'
            },
            {
              time: 5000,
              type: 'observable',
              values: [
                {
                  time: 5000,
                  text: '5'
                }
              ],
              color: '#333'
            },
            {
              time: 5000,
              completed: true
            }
          ],
          color: '#456'
        }
      ]
    };

    expectToEqual(getModel({ data }), {
      observables: [
        {
          values: [
            {
              time: 1000,
              isObservable: true,
              text: '',
              color: '#123'
            },
            {
              time: 2000,
              isObservable: true,
              text: '',
              color: '#456'
            }
          ],
          startTime: 0,
          mainColor: '#000000'
        },
        {
          values: [
            {
              time: 1000,
              text: '1',
              color: defaultShapeColor
            },
            {
              time: 3000,
              isObservable: true,
              text: '',
              color: defaultObservableColor
            }
          ],
          completed: {
            time: 5000,
            lastValueBeforeCompletedTime: 3000
          },
          startTime: 1000,
          endTime: 5000,
          mainColor: '#123'
        },
        {
          values: [
            {
              time: 2000,
              isObservable: true,
              text: '',
              color: '#111'
            },
            {
              time: 4000,
              isObservable: true,
              text: '',
              color: '#222'
            },
            {
              time: 5000,
              isObservable: true,
              text: '',
              color: '#333'
            }
          ],
          completed: {
            time: 5000,
            lastValueBeforeCompletedTime: 5000
          },
          startTime: 2000,
          endTime: 5000,
          mainColor: '#456'
        },
        {
          values: [
            {
              time: 2000,
              text: '2',
              color: defaultShapeColor
            },
            {
              time: 3000,
              text: '3',
              color: defaultShapeColor
            }
          ],
          completed: {
            time: 3000,
            lastValueBeforeCompletedTime: 3000
          },
          startTime: 2000,
          endTime: 3000,
          mainColor: '#111'
        },
        {
          values: [
            {
              time: 4000,
              text: '4',
              color: defaultShapeColor
            }
          ],
          completed: {
            time: 4000,
            lastValueBeforeCompletedTime: 4000
          },
          startTime: 3000,
          endTime: 4000,
          mainColor: defaultObservableColor /* Inherited color */
        },
        {
          values: [
            {
              time: 4000,
              text: '4',
              color: defaultShapeColor
            },
            {
              time: 5000,
              text: '5',
              color: defaultShapeColor
            }
          ],
          startTime: 4000,
          mainColor: '#222'
        },
        {
          values: [
            {
              time: 5000,
              text: '5',
              color: defaultShapeColor
            }
          ],
          startTime: 5000,
          mainColor: '#333'
        }
      ],
      connectors: [
        {
          time: 1000,
          fromIndex: 0,
          toIndex: 1,
          color: '#123'
        },
        {
          time: 2000,
          fromIndex: 0,
          toIndex: 2,
          color: '#456'
        },
        {
          time: 2000,
          fromIndex: 2,
          toIndex: 3,
          color: '#111'
        },
        {
          time: 3000,
          fromIndex: 1,
          toIndex: 4,
          color: defaultObservableColor /* Inherited color */
        },
        {
          time: 4000,
          fromIndex: 2,
          toIndex: 5,
          color: '#222'
        },
        {
          time: 5000,
          fromIndex: 2,
          toIndex: 6,
          color: '#333'
        }
      ]
    });
  });
});
