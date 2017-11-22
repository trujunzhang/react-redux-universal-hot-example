import React, {PropTypes} from 'react';

/**
 * @return {null}
 */
const MailTo = ({className = '', title = '', email, value = ''}) => {
  if (!!email) {
    return (
      <a className={className} title={title ? title : email} href={'mailto:' + email}>{value ? value : email}</a>
    );
  }
  return (<strong>{'-'}</strong>);
};

MailTo.propTypes = {
  className: PropTypes.string
};

MailTo.defaultProps = {
  className: 'black'
};


export default MailTo;
