import Telescope from '../../index'
import React, {Component} from 'react';

const AppCareers = () => {
  return (
    <div className="constraintWidth_ZyYbM container_3aBgK">
      <section>
        <h1 className="s-h1 m-centered">
          Careers
        </h1>
        <p className="s-p">
          Unfortunately, we do not have any openings at the moment. But if you're interested in working with us, feel
          free to send us your CV at <Telescope.components.MailTo email="careers@politicl.com"/>. We'll get in touch
          with you for any suitable openings in the future.
        </p>
        <p className="s-p">
          Team Politicl
        </p>
      </section>
      <Telescope.components.AppFooter/>
    </div>
  )
};

export default AppCareers;


