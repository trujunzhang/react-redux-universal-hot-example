import Telescope from '../index';
import React, {Component} from 'react';

import TextareaAutosize from 'react-textarea-autosize';
import onClickOutside from 'react-onclickoutside';

import AppTable from '../../../lib/appTable';

import Users from '../../../lib/users';

const {
  dismissAppOverlay,
} = require('../../../actions');

class SubmitFlagPopover extends Component {

  constructor(props) {
    super(props);
    this.state = this.initialState = {
      value: '',
      showError: false,
      isEventCalling: false
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.showError === true) {
      this.setState({showError: false});
    }
  }

  onSubmitFlagClick(event) {
    event.preventDefault();

    if (this.state.isEventCalling) {
      return;
    }
    this.setState({isEventCalling: true});

    const {currentUser, model} = this.props,
      object = model.object;

    // this.context.actions.call('flags.new', {
    //   postId: object.postId,
    //   authorId: object.authorId,
    //   reason: this.state.value,
    //   userId: currentUser._id,
    //   type: Flags.config.TYPE_POST
    // }, (error, result) => {
    //   if (!!error) {
    //     this.context.messages.flash(this.context.intl.formatMessage({id: "msg.error.flag.submitted"}), "error");
    //   } else {
    //     this.context.messages.dismissPopoverMenu();
    //     this.context.messages.flash(this.context.intl.formatMessage({id: "msg.success.flag.submitted"}), "success");
    //   }
    //   this.setState({isEventCalling: false});
    // });
  }

  render() {
    const {model} = this.props,
      {position, object} = model,
      {isEventCalling} = this.state,
      top = position.top + position.height + 4,
      left = (position.left + position.width / 2) + 70;

    const popover = Users.getCollectionsPopover(left, top, 300, 226, 0, 'v-bottom-center');

    return (
      <div className={popover.className} style={popover.style}>
        <form className="popover_1ijp3" id="submit-flag-form">
          <p className="featured_2W7jd default_tBeAo base_3CbW2">
            Flag
            <span className="productTitle_3NeF0">{object.title}</span>
          </p>
          {this.state.showError && <div className="errorMessage_2lxEG">Form can't be blank.</div>}
          <TextareaAutosize
            useCacheForDOMMeasurements
            minRows={3}
            maxRows={10}
            value={this.state.value}
            onChange={(e) => {
              this.setState({value: e.target.value});
            }}
            placeholder="Why should this be removed?"/>
          <button
            disabled={isEventCalling}
            className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf"
            onClick={this.onSubmitFlagClick.bind(this)}>
            <div className="buttonContainer_wTYxi">Submit</div>
          </button>
        </form>
      </div>
    );
  }

  handleClickOutside = evt => {
    this.props.dispatch(dismissAppOverlay());
  };

}

const {connect} = require('react-redux');
export default connect()(onClickOutside(SubmitFlagPopover));
