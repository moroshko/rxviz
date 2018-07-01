import { scaleLinear } from 'd3-scale';
import { areScalesSame } from './d3-helpers';

describe('areScalesSame', () => {
  it('returns true for === scales', () => {
    const scale = scaleLinear()
      .domain([0, 10])
      .range([0, 20]);

    expect(areScalesSame(scale, scale)).toBe(true);
  });

  it('returns true if domains and ranges are the same', () => {
    const scale1 = scaleLinear()
      .domain([0, 10])
      .range([0, 20]);
    const scale2 = scaleLinear()
      .domain([0, 10])
      .range([0, 20]);

    expect(areScalesSame(scale1, scale2)).toBe(true);
  });

  it('returns false if domains are different', () => {
    const scale1 = scaleLinear()
      .domain([0, 10])
      .range([0, 20]);
    const scale2 = scaleLinear()
      .domain([0, 50])
      .range([0, 20]);

    expect(areScalesSame(scale1, scale2)).toBe(false);
  });

  it('returns false if ranges are different', () => {
    const scale1 = scaleLinear()
      .domain([0, 10])
      .range([0, 20]);
    const scale2 = scaleLinear()
      .domain([0, 10])
      .range([10, 20]);

    expect(areScalesSame(scale1, scale2)).toBe(false);
  });
});
