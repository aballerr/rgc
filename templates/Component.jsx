import react, { Component } from 'react';

class REACT_TEMPLATE extends Component {
  render() {
    return (
      <div className="REACT_TEMPLATE_CLASSNAME">
        {this.props.children}
      </div>
    );
  }
}

export default REACT_TEMPLATE;