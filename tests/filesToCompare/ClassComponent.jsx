import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ClassComponent.css';

class ClassComponent extends Component {
  render() {
    return (
      <div className="classComponent">
        {this.props.children}
      </div>
    );
  }
}

ClassComponent.propTypes = {};
export default ClassComponent;
