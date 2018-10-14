import React from 'react';
import PropTypes from 'prop-types';
import './PureComponent.css';

const PureComponent = ({ children }) => (
  <div className="pureComponent">
    {children}
  </div>
);

PureComponent.propTypes = {};
export default PureComponent;
