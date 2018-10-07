import React, { Component } from 'react';

class Test extends Component {
  render() {
    return (
      <div className="Test">
        {this.props.children}
      </div>
    );
  }
}

export default Test;
