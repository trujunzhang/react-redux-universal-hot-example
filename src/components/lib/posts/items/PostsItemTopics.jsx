import React, {Component} from 'react';
import Topics from '../../../../lib/topics';
import AppTable from '../../../../lib/appTable';

class PostsItemTopics extends Component {

  constructor(props, context) {
    super(props);

    const {post} = props;
    let topics = Topics.getTopicsForPost(this.props),
      topicsSize = topics.length,
      firstTopic = topicsSize > 0 ? topics[0] : '',
      tagsMoreCount = topicsSize > 0 ? topicsSize - 1 : 0;

    this.state = {
      topics,
      topicsSize,
      firstTopic,
      tagsMoreCount
    };
  }

  /**
   * issue 14
   * 1) All banned topics should be added to a database
   * 2) Scraper should not use any words from the banned topics database in the articles tags/topics.
   * 3) No user should be able to add the banned topics/tags on Submit an Article page.
   * @returns {XML}
   */
  render() {
    const {
      topics,
      topicsSize,
      firstTopic,
      tagsMoreCount
    } = this.state;

    if (topicsSize !== 0) {
      return (
        <div className="associations_2dmvY">
          <div>
            <span
              className="button_2I1re smallSize_1da-r secondaryText_PM80d greySolidColor_270pZ solidletiant_2wWrf"
              onClick={this.onTagClick.bind(this)}>
              <div className="buttonContainer_wTYxi" title={firstTopic.name}>
                {firstTopic.name.substr(0, 16) + (firstTopic.name.length > 16 ? '..' : '')}
              </div>
            </span>
            {tagsMoreCount > 0 && (
              <span ref="moreTopicsButton"
                    className="moreAssociations_28e7H"
                    id="moreTopicsButton"
                    onClick={(evt) => {
                      const otherTopics = topics.slice(1);
                      this.props.onMoreTopicsClick(evt, otherTopics);
                    }}>
                <span className="secondaryText_PM80d subtle_1BWOT base_3CbW2 margin_left4">
                  {`+${tagsMoreCount}`}
                </span>
              </span>
            )}
          </div>
        </div>
      );
    }

    return null;
  }

  onTagClick(e) {
    e.preventDefault();

    const {
      topicsSize,
      firstTopic,
      tagsMoreCount
    } = this.state;

    if (!!firstTopic) {
      AppTable.pushForTopic(this.props, firstTopic);
    }

    e.stopPropagation();
  }
}

export default PostsItemTopics;
