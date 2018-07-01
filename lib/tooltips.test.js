import { scaleLinear } from 'd3-scale';
import {
  defaultMainColor,
  defaultShapeColor,
  defaultObservableColor
} from './colors';
import {
  extractTooltips,
  getTooltipsModels,
  getSvgDimensions,
  getTooltipsToShow,
  hasHoverTooltip,
  addTooltip,
  removeTooltip
} from './tooltips';

const defaultTextStyle = {
  fontWeight: 'bold'
};

const scale = scaleLinear()
  .domain([0, 10000])
  .range([0, 1000]);

describe('extractTooltips', () => {
  it('returns an empty array if there is no tooltips', () => {
    const observables = [
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
          text: 'len is not defined'
        },
        startTime: 0,
        endTime: 2000,
        mainColor: defaultMainColor
      }
    ];

    expect(extractTooltips(observables, defaultTextStyle)).toEqual([]);
  });

  it('extracts tooltip from error', () => {
    const observables = [
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
          text: 'len is not defined',
          tooltip: {
            text: 'len is not defined',
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
    ];

    expect(extractTooltips(observables, defaultTextStyle)).toEqual([
      {
        observableIndex: 0,
        valueIndex: 'error',
        time: 2000,
        text: 'len is not defined',
        textStyle: {
          fontWeight: 'bold',
          fontFamily: 'monospace',
          whiteSpace: 'pre'
        }
      }
    ]);
  });

  it('extracts tooltips for single observable', () => {
    const observables = [
      {
        values: [
          {
            time: 1000,
            text: '...',
            color: defaultShapeColor,
            tooltip: {
              text: 'Multi\nline\ntooltip',
              textStyle: {
                fontSize: 10,
                fill: '#777'
              },
              backgroundColor: 'blue',
              persistent: true
            }
          },
          {
            time: 2000,
            text: '...',
            tooltip: {
              text: '12345678',
              textStyle: {
                fontSize: 200
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
    ];

    expect(extractTooltips(observables, defaultTextStyle)).toEqual([
      {
        observableIndex: 0,
        valueIndex: 0,
        time: 1000,
        text: 'Multi\nline\ntooltip',
        textStyle: {
          fontWeight: 'bold',
          fontSize: 10,
          fill: '#777'
        },
        backgroundColor: 'blue',
        persistent: true
      },
      {
        observableIndex: 0,
        valueIndex: 1,
        time: 2000,
        text: '12345678',
        textStyle: {
          fontWeight: 'bold',
          fontSize: 200
        }
      }
    ]);
  });

  it('extracts tooltips for multiple observables', () => {
    const observables = [
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
            color: '#456',
            tooltip: {
              text: 'first'
            }
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
            color: defaultShapeColor,
            tooltip: {
              text: 'second',
              textStyle: {
                whiteSpace: 'pre'
              }
            }
          },
          {
            time: 3000,
            isObservable: true,
            text: '',
            color: defaultObservableColor,
            tooltip: {
              text: 'third',
              textStyle: {
                fill: 'blue'
              }
            }
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
        mainColor: defaultMainColor
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
            color: '#333',
            tooltip: {
              text: 'fourth'
            }
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
            color: defaultShapeColor,
            tooltip: {
              text: 'fifth'
            }
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
          },
          {
            time: 5000,
            text: '5',
            color: defaultShapeColor,
            tooltip: {}
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
            color: defaultShapeColor,
            tooltip: {
              text: 'sixth',
              textStyle: {
                fontSize: 100,
                fill: 'green'
              },
              backgroundColor: '#123456'
            }
          }
        ],
        startTime: 5000,
        mainColor: '#333'
      }
    ];

    expect(extractTooltips(observables, defaultTextStyle)).toEqual([
      {
        observableIndex: 0,
        valueIndex: 1,
        time: 2000,
        text: 'first',
        textStyle: {
          fontWeight: 'bold'
        }
      },
      {
        observableIndex: 1,
        valueIndex: 0,
        time: 1000,
        text: 'second',
        textStyle: {
          fontWeight: 'bold',
          whiteSpace: 'pre'
        }
      },
      {
        observableIndex: 1,
        valueIndex: 1,
        time: 3000,
        text: 'third',
        textStyle: {
          fontWeight: 'bold',
          fill: 'blue'
        }
      },
      {
        observableIndex: 3,
        valueIndex: 2,
        time: 5000,
        text: 'fourth',
        textStyle: {
          fontWeight: 'bold'
        }
      },
      {
        observableIndex: 4,
        valueIndex: 0,
        time: 2000,
        text: 'fifth',
        textStyle: {
          fontWeight: 'bold'
        }
      },
      {
        observableIndex: 6,
        valueIndex: 0,
        time: 5000,
        text: 'sixth',
        textStyle: {
          fontWeight: 'bold',
          fontSize: 100,
          fill: 'green'
        },
        backgroundColor: '#123456'
      }
    ]);
  });
});

describe('getTooltipsModels', () => {
  it('calculates tooltips models', () => {
    const tooltips = [
      {
        observableIndex: 0,
        valueIndex: 0,
        time: 1000,
        text: '{\n  "first": "Misha",\n  "last": "Moroshko"\n}'
      },
      {
        observableIndex: 0,
        valueIndex: 1,
        time: 4000,
        text: 'This is a tooltip for "6"',
        textStyle: {
          fontSize: 50
        },
        backgroundColor: '#888'
      },
      {
        observableIndex: 1,
        valueIndex: 1,
        time: 9000,
        text: 'yo'
      }
    ];
    const dimensions = [
      {
        width: 200,
        height: 90
      },
      {
        width: 480,
        height: 50
      },
      {
        width: 200,
        height: 80
      }
    ];

    expect(
      getTooltipsModels({
        tooltips,
        dimensions,
        scale,
        marginLeft: 15,
        countsHeight: 10,
        observableHeight: 50,
        shapeSize: 40,
        arrowHeight: 30,
        arrowDistance: 10,
        paddingTop: 30,
        paddingRight: 50,
        paddingBottom: 60,
        paddingLeft: 20
      })
    ).toEqual([
      {
        x: -20,
        y: 95,
        width: 270,
        height: 180,
        text: '{\n  "first": "Misha",\n  "last": "Moroshko"\n}'
      },
      {
        x: 140,
        y: 95,
        width: 550,
        height: 140,
        text: 'This is a tooltip for "6"',
        textStyle: {
          fontSize: 50
        },
        backgroundColor: '#888'
      },
      {
        x: 780,
        y: 145,
        width: 270,
        height: 170,
        text: 'yo'
      }
    ]);
  });

  it('filters out tooltips with dimension of 0', () => {
    const tooltips = [
      {
        observableIndex: 0,
        valueIndex: 0,
        time: 4000,
        text: '{\n  "first": "Misha",\n  "last": "Moroshko"\n}',
        textStyle: {
          display: 'none'
        }
      },
      {
        observableIndex: 1,
        valueIndex: 2,
        time: 10000,
        text: 'This is a tooltip for "6"',
        textStyle: {
          display: 'none'
        }
      },
      {
        observableIndex: 2,
        valueIndex: 5,
        time: 12000,
        text: 'Hello',
        textStyle: {
          display: 'none'
        }
      }
    ];
    const dimensions = [
      {
        width: 0,
        height: 90
      },
      {
        width: 100,
        height: 0
      },
      {
        width: 0,
        height: 0
      }
    ];

    expect(
      getTooltipsModels({
        tooltips,
        dimensions,
        scale,
        marginLeft: 15,
        countsHeight: 10,
        observableHeight: 50,
        shapeSize: 40,
        arrowHeight: 30,
        arrowDistance: 10,
        paddingTop: 30,
        paddingRight: 50,
        paddingBottom: 60,
        paddingLeft: 20
      })
    ).toEqual([]);
  });
});

describe('getSvgDimensions', () => {
  it("doesn't modify the dimensions when there is no tooltips", () => {
    expect(
      getSvgDimensions({
        svgWidthWithoutTooltips: 100,
        svgHeightWithoutTooltips: 50,
        tooltipsModels: []
      })
    ).toEqual({ width: 100, height: 50 });
  });

  it("doesn't modify the dimensions when tooltips are within viz", () => {
    const tooltipsModels = [
      {
        x: 20,
        y: 55,
        width: 70,
        height: 100
      },
      {
        x: 10,
        y: 55,
        width: 75,
        height: 80
      }
    ];

    expect(
      getSvgDimensions({
        svgWidthWithoutTooltips: 100,
        svgHeightWithoutTooltips: 200,
        tooltipsModels
      })
    ).toEqual({ width: 100, height: 200 });
  });

  it('adjusts only the height when tooltips are outside the viz', () => {
    const tooltipsModels = [
      {
        x: 20,
        y: 55,
        width: 70,
        height: 100
      },
      {
        x: 10,
        y: 55,
        width: 75,
        height: 80
      }
    ];

    expect(
      getSvgDimensions({
        svgWidthWithoutTooltips: 80,
        svgHeightWithoutTooltips: 50,
        tooltipsModels
      })
    ).toEqual({ width: 80, height: 155 });
  });
});

describe('getTooltipsToShow', () => {
  it('keeps persistent tooltips', () => {
    const allTooltips = [
      {
        observableIndex: 1,
        valueIndex: 2,
        time: 1000,
        text: 'first tooltip',
        persistent: true
      },
      {
        observableIndex: 3,
        valueIndex: 4,
        time: 2000,
        text: 'second tooltip'
      },
      {
        observableIndex: 5,
        valueIndex: 6,
        time: 3000,
        text: 'third tooltip',
        persistent: true
      }
    ];

    expect(getTooltipsToShow([], allTooltips)).toEqual([
      {
        observableIndex: 1,
        valueIndex: 2,
        time: 1000,
        text: 'first tooltip',
        persistent: true
      },
      {
        observableIndex: 5,
        valueIndex: 6,
        time: 3000,
        text: 'third tooltip',
        persistent: true
      }
    ]);
  });

  it('keeps tooltips that are already in `tooltips`', () => {
    const tooltips = [
      {
        observableIndex: 3,
        valueIndex: 4,
        time: 2000,
        text: 'second tooltip',
        textStyle: {
          fill: 'red'
        }
      },
      {
        observableIndex: 7,
        valueIndex: 8,
        time: 4000,
        text: 'fourth tooltip'
      }
    ];
    const allTooltips = [
      {
        observableIndex: 1,
        valueIndex: 2,
        time: 1000,
        text: 'first tooltip'
      },
      {
        observableIndex: 3,
        valueIndex: 4,
        time: 2000,
        text: 'second tooltip',
        textStyle: {
          fill: 'red'
        }
      },
      {
        observableIndex: 5,
        valueIndex: 6,
        time: 3000,
        text: 'third tooltip'
      },
      {
        observableIndex: 7,
        valueIndex: 8,
        time: 4000,
        text: 'fourth tooltip'
      }
    ];

    expect(getTooltipsToShow(tooltips, allTooltips)).toEqual(tooltips);
  });
});

describe('hasHoverTooltip', () => {
  it('returns false if tooltip is not found', () => {
    const allTooltips = [
      {
        observableIndex: 1,
        valueIndex: 2,
        time: 1000,
        text: 'first tooltip'
      },
      {
        observableIndex: 3,
        valueIndex: 4,
        time: 2000,
        text: 'second tooltip',
        textStyle: {
          fill: 'red'
        },
        persistent: true
      }
    ];

    expect(hasHoverTooltip(8, 9, allTooltips)).toBe(false);
  });

  it('returns false if tooltip is found but it is persistent', () => {
    const allTooltips = [
      {
        observableIndex: 1,
        valueIndex: 2,
        time: 1000,
        text: 'first tooltip'
      },
      {
        observableIndex: 3,
        valueIndex: 4,
        time: 2000,
        text: 'second tooltip',
        textStyle: {
          fill: 'red'
        },
        persistent: true
      }
    ];

    expect(hasHoverTooltip(3, 4, allTooltips)).toBe(false);
  });

  it('returns true if tooltip is found and it is not persistent', () => {
    const allTooltips = [
      {
        observableIndex: 1,
        valueIndex: 2,
        time: 1000,
        text: 'first tooltip'
      },
      {
        observableIndex: 3,
        valueIndex: 4,
        time: 2000,
        text: 'second tooltip',
        textStyle: {
          fill: 'red'
        },
        persistent: true
      }
    ];

    expect(hasHoverTooltip(1, 2, allTooltips)).toBe(true);
  });
});

describe('addTooltip', () => {
  it('returns `tooltips` if tooltip is not found', () => {
    const tooltips = [
      {
        observableIndex: 1,
        valueIndex: 2,
        time: 1000,
        text: 'first tooltip'
      },
      {
        observableIndex: 3,
        valueIndex: 4,
        time: 2000,
        text: 'second tooltip',
        textStyle: {
          fill: 'red'
        },
        persistent: true
      }
    ];
    const allTooltips = [
      {
        observableIndex: 5,
        valueIndex: 6,
        time: 3000,
        text: 'third tooltip'
      },
      {
        observableIndex: 7,
        valueIndex: 8,
        time: 4000,
        text: 'fourth tooltip',
        textStyle: {
          fill: 'red'
        }
      }
    ];

    expect(addTooltip(11, 22, tooltips, allTooltips)).toEqual(tooltips);
  });

  it('add the tooltip if it is found', () => {
    const tooltips = [
      {
        observableIndex: 1,
        valueIndex: 2,
        time: 1000,
        text: 'first tooltip'
      },
      {
        observableIndex: 3,
        valueIndex: 4,
        time: 2000,
        text: 'second tooltip',
        textStyle: {
          fill: 'red'
        },
        persistent: true
      }
    ];
    const allTooltips = [
      {
        observableIndex: 5,
        valueIndex: 6,
        time: 3000,
        text: 'third tooltip'
      },
      {
        observableIndex: 7,
        valueIndex: 8,
        time: 4000,
        text: 'fourth tooltip',
        textStyle: {
          fill: 'red'
        }
      }
    ];

    expect(addTooltip(7, 8, tooltips, allTooltips)).toEqual([
      {
        observableIndex: 1,
        valueIndex: 2,
        time: 1000,
        text: 'first tooltip'
      },
      {
        observableIndex: 3,
        valueIndex: 4,
        time: 2000,
        text: 'second tooltip',
        textStyle: {
          fill: 'red'
        },
        persistent: true
      },
      {
        observableIndex: 7,
        valueIndex: 8,
        time: 4000,
        text: 'fourth tooltip',
        textStyle: {
          fill: 'red'
        }
      }
    ]);
  });
});

describe('removeTooltip', () => {
  it('returns `tooltips` if tooltip is not found', () => {
    const tooltips = [
      {
        observableIndex: 1,
        valueIndex: 2,
        time: 1000,
        text: 'first tooltip'
      },
      {
        observableIndex: 3,
        valueIndex: 4,
        time: 2000,
        text: 'second tooltip',
        textStyle: {
          fill: 'red'
        },
        persistent: true
      }
    ];

    expect(removeTooltip(11, 22, tooltips)).toEqual(tooltips);
  });

  it('removes the tooltip if it is found', () => {
    const tooltips = [
      {
        observableIndex: 1,
        valueIndex: 2,
        time: 1000,
        text: 'first tooltip'
      },
      {
        observableIndex: 3,
        valueIndex: 4,
        time: 2000,
        text: 'second tooltip',
        textStyle: {
          fill: 'red'
        },
        persistent: true
      }
    ];

    expect(removeTooltip(1, 2, tooltips)).toEqual([
      {
        observableIndex: 3,
        valueIndex: 4,
        time: 2000,
        text: 'second tooltip',
        textStyle: {
          fill: 'red'
        },
        persistent: true
      }
    ]);
  });
});
