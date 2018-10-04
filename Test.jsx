import React, { Component } from 'react';
import './Test.css';

class Test extends Component {
  render() {
    return (
      <div className="test">
        {this.props.children}
      </div>
    );
  }
}

export default Test;
