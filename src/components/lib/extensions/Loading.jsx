import React, {PropTypes, Component} from 'react';

const Loading = ({color}) => {
  return (
    <div className={color === 'white' ? 'spinner white' : 'spinner'}>
      <div className="bounce1"/>
      <div className="bounce2"/>
      <div className="bounce3"/>
    </div>
  );
};

Loading.propTypes = {
  color: PropTypes.string
};

Loading.defaultProps = {
  color: 'black'
};


export default Loading;
