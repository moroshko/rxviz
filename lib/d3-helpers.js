export const areScalesSame = (scale1, scale2) => {
  if (scale1 === scale2) {
    return true;
  }

  const [domain1Min, domain1Max] = scale1.domain();
  const [domain2Min, domain2Max] = scale2.domain();
  const [range1Min, range1Max] = scale1.range();
  const [range2Min, range2Max] = scale2.range();

  return (
    domain1Min === domain2Min &&
    domain1Max === domain2Max &&
    range1Min === range2Min &&
    range1Max === range2Max
  );
};
