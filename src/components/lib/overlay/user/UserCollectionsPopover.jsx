import Telescope from '../../index';
import React, {Component} from 'react';

import {Link} from 'react-router';
import onClickOutside from 'react-onclickoutside';
import Users from '../../../../lib/users';


const {
  logOut,
  dismissAppOverlay,
} = require('../../../../actions');

class UserCollectionsPopover extends Component {

  constructor(props) {
    super(props);
    ['onAddNewClick', 'onSubmitNewCollectionClick'].forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });

    this.state = this.initialState = {
      addNewItem: false,
      newFolder: null,
      showResult: false,
      value: '',
      step: 1
    };
  }

  onHelpIconClick() {

  }

  renderCollectionsHeader() {
    return (
      <div className="popover--header">
        <h3 className="popover--header--title">Add to Collection</h3>
        <a className="popover--header--icon" onClick={this.onHelpIconClick.bind(this)}>
          <span>
            <svg width="17px" height="17px" viewBox="0 0 17 17" version="1.1">
              <g id="Page-1" stroke="none" fill="none">
                <path
                  d="M8.36196,0 C3.75054,0 0,3.75054 0,8.36196 C0,12.97236 3.75054,16.72392 8.36196,16.72392 C12.97236,16.72392 16.72392,12.97236 16.72392,8.36196 C16.72392,3.75054 12.97236,0 8.36196,0 L8.36196,0 Z M9.38196,12.96726 C9.38196,13.20492 9.27928,13.42082 9.07698,13.60816 C8.8774,13.79312 8.61016,13.88696 8.2824,13.88696 C7.94478,13.88696 7.66666,13.79414 7.4562,13.60986 C7.24064,13.42286 7.1315,13.20628 7.1315,12.96726 L7.1315,12.5562 C7.1315,12.31718 7.24132,12.1006 7.4562,11.91326 C7.66666,11.73 7.94478,11.63718 8.2824,11.63718 C8.61016,11.63718 8.8774,11.73136 9.07698,11.91598 C9.27894,12.10332 9.38196,12.31922 9.38196,12.5562 L9.38196,12.96726 L9.38196,12.96726 Z M11.64704,6.80884 C11.51478,7.06758 11.3458,7.29538 11.14452,7.4868 C10.94698,7.67312 10.73142,7.84176 10.50328,7.98728 C10.28466,8.12634 10.07862,8.27696 9.89196,8.43472 C9.7087,8.58908 9.55502,8.7618 9.43534,8.94812 C9.3211,9.12628 9.26296,9.34864 9.26296,9.60908 L9.26296,9.86748 C9.26296,10.03884 9.17898,10.21802 9.01306,10.40196 C8.8451,10.58726 8.62036,10.68688 8.34632,10.6981 L8.28954,10.69946 C8.01108,10.69946 7.78464,10.6199 7.616,10.46214 C7.43512,10.29316 7.344,10.1031 7.344,9.89808 C7.344,9.41834 7.41064,9.01 7.54222,8.68326 C7.67312,8.35958 7.83496,8.0784 8.024,7.8472 C8.21202,7.61702 8.42418,7.41574 8.65402,7.24812 C8.87366,7.08968 9.0763,6.93226 9.25684,6.78198 C9.43126,6.6368 9.58154,6.48142 9.70292,6.32162 C9.81444,6.17372 9.86918,5.99454 9.86918,5.7749 C9.86918,5.41212 9.77092,5.1527 9.56794,4.98134 C9.36224,4.80726 9.07732,4.71886 8.72202,4.71886 C8.48538,4.71886 8.28206,4.73348 8.11818,4.76272 C7.95804,4.79094 7.81048,4.83854 7.67822,4.9045 C7.54766,4.9691 7.42492,5.05954 7.31272,5.17174 C7.19508,5.28938 7.07132,5.43796 6.94416,5.61408 C6.82992,5.7749 6.66026,5.89628 6.44062,5.97482 C6.21554,6.05642 5.96564,6.03432 5.70486,5.90954 C5.4706,5.79258 5.32746,5.63992 5.2785,5.45462 C5.23294,5.28462 5.23294,5.10612 5.27782,4.92558 C5.31114,4.77122 5.40328,4.5815 5.56036,4.34894 C5.7137,4.12114 5.93198,3.8998 6.21044,3.69002 C6.4872,3.48092 6.83808,3.29834 7.2522,3.1484 C7.66938,2.99778 8.1685,2.92128 8.73698,2.92128 C9.29764,2.92128 9.7835,3.00594 10.1813,3.17356 C10.58114,3.3422 10.90788,3.56694 11.15166,3.84234 C11.39476,4.1174 11.57394,4.43326 11.68478,4.78142 C11.79426,5.12584 11.85002,5.4859 11.85002,5.85106 C11.85002,6.22234 11.78168,6.545 11.64704,6.80884 L11.64704,6.80884 Z"
                  id="Imported-Layers" fill="#DDDAD9"/>
              </g>
            </svg>
          </span>
        </a>
      </div>
    );
  }

  renderCollectionsPanel() {
    const {model, currentUser} = this.props,
      {object} = model;

    return (
      <div>
        {this.renderCollectionsHeader()}
        <div>
          <Telescope.components.CollectionsResult
            userId={currentUser.id}
            savedPostId={object.savedPostId}
            onCollectedItemClick={this.onCollectedItemClick.bind(this)}/>
        </div>
      </div>
    );
  }

  renderAddNewForm() {
    return (
      <form id="newCollectionForm" className="collections-popover--form">
        <input autoFocus type="text"
               className="collections-popover--form--field input collections-input"
               value={this.state.value}
               onChange={(e) => {
                 this.setState({value: e.target.value});
               }}
               placeholder="Collection name (public)"
               ref="newCollectionInput"/>
        <button onClick={this.onSubmitNewCollectionClick}
                className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d simpleletiant_1Nl54 collections-popover--form--submit"
                type="submit">
          <div className="buttonContainer_wTYxi">Add</div>
        </button>
      </form>
    );
  }

  rendAddNewButton() {
    return (
      <a id="addNewCollectionButton" onClick={this.onAddNewClick} className="collections-popover--form-trigger">
        Add New
      </a>
    );
  }

  renderSuccessfully() {
    const {newFolder, exist} = this.state;

    return (
      <div>
        <div className="popover--header">
          <h3 className="popover--header--title">{exist ? 'Already added earlier!' : 'Done!'}</h3>
        </div>
        <div className="popover--message collections-popover--message">
          {`"${this.props.comp.object.title}" has been added to your collection`}
          <a className="margin_left4" onClick={this.onFolderItemClick.bind(this)}>
            {newFolder.name}
          </a>
        </div>
      </div>
    );
  }

  onFolderItemClick() {
    this.context.messages.dismissAllPopoverPosts();
    this.context.messages.dismissPopoverMenu();

    const {currentUser} = this.context,
      {newFolder} = this.state;
    this.context.messages.pushRouter(this.props.router, Users.getLinkObject('folderItem', currentUser, newFolder));
  }

  onAddNewClick(e) {
    e.preventDefault();
    this.setState({addNewItem: true});
  }

  onSubmitSaveCollectionClick(event, name) {
    event.preventDefault();

    const {comp} = this.props;
    const object = comp.object;

    const folder = {
      name: name,
      posts: [object.savedPostId],
      lastPost: object.savedPostId
    };
    this.context.actions.call('folders.new', folder, (error, result) => {
      if (!error) {
        this.setState({showResult: true, newFolder: result, step: 2});
      }
    });
  }

  onSubmitNewCollectionClick(event) {
    this.onSubmitSaveCollectionClick(event, this.state.value);
  }

  onCollectedItemClick(folder, exist) {
    //  folder = Folders.findOne(this.context.currentUser.telescope.folderBookmarkId);
    console.log(folder);

    let newState = {showResult: true, exist: exist, newFolder: {name: folder.name, _id: folder._id}, step: 2};

    // let alreadyAdded = Users.checkArticleInFolder(this.props.comp.object.savedPostId, folder)
    if (exist) {
      this.setState(newState);
    } else { // If not exist, insert it to the folder.
      folder.lastPost = this.props.comp.object.savedPostId;
      folder.userId = this.context.currentUser._id;
      this.setState(newState);
      this.context.actions.call('folders.insertPost', folder, (error, result) => {
        if (!!error) {
          this.context.messages.flash(this.context.intl.formatMessage({id: 'msg.error.folders.add.post'}), 'error');
        } else {
          console.log('done');
          // this.setState(newState);
        }
      });
    }
  }

  render() {
    const {model} = this.props,
      {position} = model;

    const top = position.top + position.height + 14;
    let left = (position.left + position.width / 2) - 80;

    let offX = 0;
    switch (this.state.step) {
      case 2:
        offX = 38;
        left = left + offX;
        break;
    }

    const popover = Users.getCollectionsPopover(left - 155, top, 365, 300, offX);

    return (
      <div id="userCollectionPanel" className={popover.className} style={popover.style}>
        {(this.state.showResult ? this.renderSuccessfully() : this.renderCollectionsPanel())}
      </div>
    );
  }

  handleClickOutside = evt => {
    this.props.dismissAppOverlayAction();
  };

}


const {connect} = require('react-redux');

function mapDispatchToProps(dispatch) {
  return {
    dismissAppOverlayAction: () => dispatch(dismissAppOverlay()),
  };
}

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
    currentUser: store.user
  };
}

export default connect(select, mapDispatchToProps)(onClickOutside(UserCollectionsPopover));

