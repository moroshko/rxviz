export default {
  wrap: {
    marginLeft: 10,
    borderRadius: 0
  },
  /*
    `react-numeric-input` overrides
      style['input'].borderRadius
    with
      style['input:not(.form-control)'].borderRadius
  */
  'input:not(.form-control)': {
    fontSize: 14,
    fontFamily: 'Roboto, sans-serif',
    padding: '9px 10px 9px 0',
    width: 70,
    textAlign: 'center',
    color: '#eeeff0',
    backgroundColor: 'transparent',
    border: '1px solid #a6adb9',
    borderRadius: 0
  },
  'input:focus': {
    border: '1px solid #fff',
    outline: 'none'
  },
  btn: {
    background: 'transparent',
    boxShadow: 'none',
    border: 0
  },
  'btn:hover': {
    background: 'transparent'
  },
  'btn:active': {
    background: 'transparent',
    boxShadow: 'none'
  },
  btnUp: {
    top: 0
  },
  arrowUp: {
    borderBottomColor: '#a6adb9',
    borderWidth: '0px 0.8ex 1.2ex 0.8ex',
    margin: '-0.3ex 0px 0px -0.86ex'
  },
  btnDown: {
    bottom: 7
  },
  arrowDown: {
    borderTopColor: '#a6adb9',
    borderWidth: '1.2ex 0.8ex 0 0.8ex',
    margin: '-0.3ex 0px 0px -0.86ex'
  }
};
