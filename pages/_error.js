import { Component } from 'react';
import Error from '../components/Error';

export default class extends Component {
  static getInitialProps({ res }) {
    return {
      statusCode: res ? res.statusCode : null
    };
  }

  render() {
    const { statusCode } = this.props;

    return <Error statusCode={statusCode} />;
  }
}
