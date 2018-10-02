import react, { Component } from 'react';

class alex extends Component {
  render() {
    return (
      <div className="alex">
        {this.props.children}
      </div>
    );
  }
}

export default alex;