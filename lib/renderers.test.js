import { defaultRenderer } from './renderers';

describe('defaultRenderer', () => {
  it('returns {} if isObservable is true', () => {
    expect(defaultRenderer({ isObservable: true })).toEqual({});
  });

  it('adds tooltip if isError is true', () => {
    expect(defaultRenderer({ isError: true, value: 'Oh no!' })).toEqual({
      tooltip: {
        text: 'Oh no!'
      }
    });
  });

  it('sets text to "..." and adds tooltip if value is a plain object', () => {
    expect(
      defaultRenderer({
        value: {
          point: {
            x: 4,
            y: 9
          },
          color: '#123456'
        }
      })
    ).toEqual({
      text: '...',
      tooltip: {
        text: `{
  "point": {
    "x": 4,
    "y": 9
  },
  "color": "#123456"
}`,
        textStyle: { fontFamily: 'monospace', whiteSpace: 'pre' }
      }
    });
  });

  it("stringifies text and doesn't add tooltip if the stringified text is no longer than 3 characters", () => {
    expect(defaultRenderer({ value: 12 })).toEqual({ text: '12' });
  });

  it('sets text to "..." and adds tooltip if the stringified text is longer than 3 characters', () => {
    expect(defaultRenderer({ value: 1234 })).toEqual({
      text: '...',
      tooltip: {
        text: '1234'
      }
    });
  });
});
