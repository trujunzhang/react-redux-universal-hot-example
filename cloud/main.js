Parse.Cloud.define('hello', function (request, response) {
  // Requires two packages to make this happen.
  // const Image = require("parse-image");

  response.success('Hello world, politicl backend!');
});

function getQueryInstance(modelType) {
  switch (modelType) {
    case 'posts':
      return new Parse.Query('posts');
    case 'topics':
      return new Parse.Query('topics');
    case 'comments':
      return new Parse.Query('comments');
    case 'folders':
      return new Parse.Query('folders');
    case 'users':
      return new Parse.Query('users');
    case 'flags':
      return new Parse.Query('flags');
  }
}

function filterByModelType(modelType, fieldName, queryValue) {
  const query = getQueryInstance(modelType);
  query.equalTo(fieldName, queryValue);
  return query;
}

const Posts = {config: {}};

Posts.config.STATUS_PENDING = 1;
Posts.config.STATUS_APPROVED = 2; // it means that the posts are published.
Posts.config.STATUS_REJECTED = 3;
Posts.config.STATUS_SPAM = 4; // it means that the posts are moved to trash, the same as STATUS_DRAFT.
Posts.config.STATUS_DELETED = 5;
Posts.config.STATUS_REMOVED = 7; // Articles have been removed from the database, It means that no data to show.
Posts.config.STATUS_UI_ALERT = 8; // Special status, just for the posts that no permission to view.

Posts.config.PUBLISH_STATUS = [
  Posts.config.STATUS_PENDING,
  Posts.config.STATUS_APPROVED,
  Posts.config.STATUS_REJECTED,
  Posts.config.STATUS_SPAM
];


Parse.Cloud.define('statisticPosts', function (request, response) {

  var publishCountQuery = getQueryInstance('posts').containedIn('status', Posts.config.PUBLISH_STATUS).count();

  var statisticCountQueries = [publishCountQuery];
  var queryStatus = [
    Posts.config.STATUS_APPROVED,
    Posts.config.STATUS_PENDING,
    Posts.config.STATUS_REJECTED,
    Posts.config.STATUS_SPAM,
    Posts.config.STATUS_DELETED
  ];
  queryStatus.map(function (status) {
    statisticCountQueries.push(getQueryInstance('posts').equalTo('status', status).count());
  });

  Parse.Promise.when(statisticCountQueries).then(function (result) {
    var s = 0;
    var returnData = {
      'allCount': result[s++],
      'publishCount': result[s++],
      'pendingCount': result[s++],
      'rejectedCount': result[s++],
      'draftCount': result[s++],
      'trashCount': result[s++],
    };

    response.success(returnData);

  }, function (error) {
    response.error(error);
  });

});

const Topics = {
  config: {}
};
Topics.config.STATUS_APPROVED = 1;
Topics.config.STATUS_DELETED = 2;
Topics.config.STATUS_FILTER = 3;

Topics.config.PUBLISH_STATUS = [
  Topics.config.STATUS_APPROVED,
  Topics.config.STATUS_FILTER,
];


Parse.Cloud.define('statisticTopics', function (request, response) {

  var publishCountQuery = getQueryInstance('topics').containedIn('status', Topics.config.PUBLISH_STATUS).count();

  var statisticCountQueries = [publishCountQuery];
  var queryStatus = [
    Topics.config.STATUS_APPROVED,
    Topics.config.STATUS_FILTER,
    Topics.config.STATUS_DELETED,
  ];
  queryStatus.map(function (status) {
    statisticCountQueries.push(getQueryInstance('topics').equalTo('status', status).count());
  });

  Parse.Promise.when(statisticCountQueries).then(function (result) {
    var s = 0;
    var returnData = {
      'allCount': result[s++],
      'publishCount': result[s++],
      'filterCount': result[s++],
      'trashCount': result[s++],
    };

    response.success(returnData);

  }, function (error) {
    response.error(error);
  });

});

const Comments = {};
Comments.config = {};

Comments.config.STATUS_PENDING = 1;
Comments.config.STATUS_APPROVED = 2; // it means that the comments are published.
Comments.config.STATUS_REJECTED = 3;
Comments.config.STATUS_SPAM = 4; // it means that the comments are moved to trash, the same as STATUS_DRAFT.
Comments.config.STATUS_DELETED = 5; // it means that the current status is trash.

Comments.config.STATUS_REMOVED = 7; // Articles have been removed from the database, It means that no data to show.

Comments.config.PUBLISH_STATUS = [
  Comments.config.STATUS_PENDING,
  Comments.config.STATUS_APPROVED,
  Comments.config.STATUS_REJECTED
];

function getCommentsCountQuery(request) {
  var query = getQueryInstance('comments');

  const postId = request.params.postId;
  if (!!postId) {
    query.equalTo('postId', postId);
  }
  return query;
}

Parse.Cloud.define('statisticComments', function (request, response) {

  var publishCountQuery = getCommentsCountQuery(request).containedIn('status', Comments.config.PUBLISH_STATUS).count();

  var statisticCountQueries = [publishCountQuery];
  var queryStatus = [
    Comments.config.STATUS_APPROVED,
    Comments.config.STATUS_PENDING,
    Comments.config.STATUS_SPAM,
    Comments.config.STATUS_DELETED,
  ];
  queryStatus.map(function (status) {
    statisticCountQueries.push(getCommentsCountQuery(request).equalTo('status', status).count());
  });

  Parse.Promise.when(statisticCountQueries).then(function (result) {
    var s = 0;
    var returnData = {
      'allCount': result[s++],
      'publishCount': result[s++],
      'pendingCount': result[s++],
      'spamCount': result[s++],
      'trashCount': result[s++],
    };

    response.success(returnData);

  }, function (error) {
    response.error(error);
  });

});


const Flags = {};
Flags.config = {};

Flags.config.STATUS_SUBMITTED = 1;
Flags.config.STATUS_APPROVED = 2;
Flags.config.STATUS_DELETED = 3;

Flags.config.TYPE_POST = 1;
Flags.config.TYPE_COMMENT = 2;

Parse.Cloud.define('statisticFlags', function (request, response) {


  var statisticCountQueries = [];
  var queryStatus = [
    {
      key: 'status',
      value: Flags.config.STATUS_SUBMITTED
    },
    {
      key: 'status',
      value: Flags.config.STATUS_APPROVED
    },
    {
      key: 'status',
      value: Flags.config.STATUS_DELETED
    },
    {
      key: 'type',
      value: Flags.config.TYPE_POST
    },
    {
      key: 'type',
      value: Flags.config.TYPE_COMMENT
    }
  ];
  queryStatus.map(function (object) {
    statisticCountQueries.push(getQueryInstance('flags').equalTo(object.key, object.value).count());
  });

  Parse.Promise.when(statisticCountQueries).then(function (result) {
    var s = 0;
    var returnData = {
      'allCount': result[s++],
      'publishCount': result[s++],
      'trashCount': result[s++],
      'postsCount': result[s++],
      'commentsCount': result[s++],
    };

    response.success(returnData);

  }, function (error) {
    response.error(error);
  });

});


const Users = {};
Users.config = {};

Users.config.TYPE_EMAIL = 1;
Users.config.TYPE_TWITTER = 2;
Users.config.TYPE_FACEBOOK = 3;
Users.config.TYPE_GOOGLE = 4;
Users.config.TYPE_GITHUB = 5;
Users.config.TYPE_LINKEDIN = 6;


Parse.Cloud.define('statisticUsers', function (request, response) {

  var statisticCountQueries = [
    getQueryInstance('users').equalTo('isAdmin', true).count(),
    getQueryInstance('users').equalTo('loginType', Users.config.TYPE_TWITTER).count(),
    getQueryInstance('users').equalTo('loginType', Users.config.TYPE_FACEBOOK).count(),
    getQueryInstance('users').equalTo('loginType', Users.config.TYPE_EMAIL).count(),
  ];

  Parse.Promise.when(statisticCountQueries).then(function (result) {
    var s = 0;
    var returnData = {
      'adminCount': result[s++],
      'twitterCount': result[s++],
      'facebookCount': result[s++],
      'emailCount': result[s++],
    };

    response.success(returnData);

  }, function (error) {
    response.error(error);
  });

});


Parse.Cloud.define('countPostsForTopics', function (request, response) {
  const modelIds = request.params.modelIds;
  var statisticCountQueries = modelIds.map(function (id) {
    return getQueryInstance('posts').containedIn('topics', [id]).count();
  });

  Parse.Promise.when(statisticCountQueries).then(function (result) {
    var returnData = {};
    result.map(function (value, index) {
      returnData[modelIds[index]] = value;
    });

    response.success(returnData);

  }, function (error) {
    response.error(error);
  });

});


Parse.Cloud.define('countPostsForUsers', function (request, response) {
  const modelIds = request.params.modelIds;
  var statisticCountQueries = modelIds.map(function (id) {
    return getQueryInstance('posts').equalTo('userId', id).count();
  });

  Parse.Promise.when(statisticCountQueries).then(function (result) {
    var returnData = {};
    result.map(function (value, index) {
      returnData[modelIds[index]] = value;
    });

    response.success(returnData);

  }, function (error) {
    response.error(error);
  });

});

/**
 * How to delete an parse object:
 *   1. New Ways to Delete Objects
 *      http://blog.parse.com/learn/engineering/deleting-objects/
 */
Parse.Cloud.define('emptyPostsTrash', function (request, response) {
  const selectedTableRowIds = request.params.rowIds;
  const length = selectedTableRowIds.length;

  var query = getQueryInstance('posts');
  query.equalTo('status', Posts.config.STATUS_DELETED);
  if (length > 0) {
    query.containedIn('objectId', selectedTableRowIds);
  }

  query.find().then(function (results) {
    return Parse.Object.destroyAll(results).then(function () {
      return results.length;
    });
  }).then(function (data) {
    response.success(data);
    // Done
  }, function (error) {
    response.error(error);
    // Error
  });

});

/**
 * How to delete an parse object:
 *   1. New Ways to Delete Objects
 *      http://blog.parse.com/learn/engineering/deleting-objects/
 */
Parse.Cloud.define('emptyCommentsTrash', function (request, response) {
  const selectedTableRowIds = request.params.rowIds;
  const length = selectedTableRowIds.length;

  var query = getQueryInstance('comments');
  query.equalTo('status', Comments.config.STATUS_DELETED);
  if (length > 0) {
    query.containedIn('objectId', selectedTableRowIds);
  }

  query.find().then(function (results) {
    return Parse.Object.destroyAll(results).then(function () {
      return results.length;
    });
  }).then(function (data) {
    response.success(data);
    // Done
  }, function (error) {
    response.error(error);
    // Error
  });

});


Parse.Cloud.define('emptyTopicsTrash', function (request, response) {
  const selectedTableRowIds = request.params.rowIds;
  const length = selectedTableRowIds.length;

  var query = getQueryInstance('topics');
  query.equalTo('status', Topics.config.STATUS_DELETED);
  if (length > 0) {
    query.containedIn('objectId', selectedTableRowIds);
  }

  query.find().then(function (results) {
    return Parse.Object.destroyAll(results).then(function () {
      return results.length;
    });
  }).then(function (data) {
    response.success(data);
    // Done
  }, function (error) {
    response.error(error);
    // Error
  });

});

Parse.Cloud.define('emptyFlagsTrash', function (request, response) {
  const selectedTableRowIds = request.params.rowIds;
  const length = selectedTableRowIds.length;

  var query = getQueryInstance('flags');
  query.equalTo('status', Flags.config.STATUS_DELETED);
  if (length > 0) {
    query.containedIn('objectId', selectedTableRowIds);
  }
  query.find().then(function (results) {
    return Parse.Object.destroyAll(results).then(function () {
      return results.length;
    });
  }).then(function (data) {
    response.success(data);
    // Done
  }, function (error) {
    response.error(error);
    // Error
  });

});


Parse.Cloud.define('countPostsForLoggedUser', function (request, response) {
  const userId = request.params.userId;

  var statisticCountQueries = [];
  const userInstanceWithoutData = Parse.User.createWithoutData(userId);
  statisticCountQueries.push(
    getQueryInstance('posts').containedIn('usersUpvote', [userInstanceWithoutData]).count()
  );
  statisticCountQueries.push(
    getQueryInstance('posts').containedIn('usersDownvote', [userInstanceWithoutData]).count()
  );
  statisticCountQueries.push(
    getQueryInstance('posts').equalTo('userId', userId).count()
  );

  Parse.Promise.when(statisticCountQueries).then(function (result) {
    var s = 0;
    var returnData = {
      'USER_PROFILE_LEFT_SIDE_UPVOTE': result[s++],
      'USER_PROFILE_LEFT_SIDE_DOWNVOTE': result[s++],
      'USER_PROFILE_LEFT_SIDE_SUBMITTED_ARTICLES': result[s++]
    };

    response.success(returnData);

  }, function (error) {
    response.error(error);
  });

});


// https://gist.github.com/fform/0b07b4aff75da3c1cd54
Parse.Cloud.define('newsletterAddEmail', function (request, response) {
  const email = request.params.email;

  const mailChimpAPIKey = 'e57f99758c06afdb0b0cf255cbf05d0c-us9';
  // const mailChimpAPIKey = "f310b04dd837986aa1a991b1d41e0685-us9";
  const mailChimpListId = 'a742857c8c';
  var mailchimpData = {
    user: mailChimpAPIKey,
    apikey: mailChimpAPIKey,
    email_address: email,
    status: 'subscribed',
  };

  var dataCenter = mailChimpAPIKey.split('-')[1];
  var url = 'https://' + dataCenter + '.api.mailchimp.com/3.0/lists/' + mailChimpListId + '/members';

  Parse.Cloud.httpRequest({
    method: 'POST',
    url: url,
    header: {
      'Content-Type': 'application/json',
      'Authorization': 'apikey ' + mailChimpAPIKey
      // "Authorization": "user " + mailChimpAPIKey
    },
    body: JSON.stringify(mailchimpData),
    success: function (httpResponse) {
      debugger;
      console.log(httpResponse.text);
      console.log('Success');
    },
    error: function (httpResponse) {
      debugger;
      console.error('Request failed with response code ' + httpResponse.status);
      console.error(httpResponse.text);

      response.error('Mailchimp subscribe failed with response code ' + httpResponse.status);
    }
  });

});


/**
 *
 */
Parse.Cloud.afterDelete('posts', function (request) {
  var query = getQueryInstance('comments');
  query.equalTo('postId', request.object.id);

  query.find().then(function (comments) {
    return Parse.Object.destroyAll(comments);
  }).then(function (success) {
    // The related comments were deleted
  }, function (error) {
    console.error('Error deleting related comments ' + error.code + ': ' + error.message);
  });
});


Parse.Cloud.define('removeUsersVotingForPosts', function (request, response) {
  const userId = request.params.userId;
  const isUpvote = request.params.isUpvote;

  const userInstanceWithoutData = Parse.User.createWithoutData(userId);

  var updatePosts = [];
  var query = getQueryInstance('posts');
  if (isUpvote === true) {
    query.containedIn('usersUpvote', [userInstanceWithoutData]);
  } else {
    query.containedIn('usersDownvote', [userInstanceWithoutData]);
  }

  query.find({
    success: function (posts) {
      for (var i = 0; i < posts.length; i++) {
        if (isUpvote === true) {
          posts[i].remove('usersUpvote', userInstanceWithoutData);
        } else {
          posts[i].remove('usersDownvote', userInstanceWithoutData);
        }
        updatePosts.push(posts[i]);
      }
    }
  }).then(function () {
    return Parse.Object.saveAll(updatePosts);
  });
});


Parse.Cloud.define('removeUsersSubmittedPosts', function (request, response) {
  const userId = request.params.userId;
  var query = getQueryInstance('posts');
  query.equalTo('userId', userId);

  query.find().then(function (posts) {
    return Parse.Object.destroyAll(posts);
  });
});
/**
 * https://stackoverflow.com/questions/32768731/in-cloud-code-call-a-parse-cloud-run-function-more-than-once-in-series
 *
 * After delete the 'User'.
 * 1. Delete all posts by 'userId'.
 * 2. Delete all voting contains 'userId'
 *
 */
Parse.Cloud.afterDelete(Parse.User, function (request, response) {
  var userId = request.object.id;

  // Array of promises for each call to fetchImage
  var promises = [];

  // Populate the promises array for each of the URLs
  promises.push(Parse.Cloud.run('removeUsersVotingForPosts', {'userId': userId, 'isUpvote': true}));
  promises.push(Parse.Cloud.run('removeUsersVotingForPosts', {'userId': userId, 'isUpvote': false}));
  promises.push(Parse.Cloud.run('removeUsersSubmittedPosts', {'userId': userId}));

  // Fulfilled when all of the fetchImage promises are resolved
  Parse.Promise.when(promises)
    .then(function () {
        // arguments is a built-in javascript variable
        // will be an array of fulfilled promises
        response.success(arguments);
      },
      function (error) {
        response.error('Error: ' + error.code + ' ' + error.message);
      }
    );
});

/**
 *
 */
Parse.Cloud.afterDelete('commentsxxx', function (request) {
  var query = getQueryInstance('posts');
  query.equalTo('postId', request.object.id);

  query.find().then(function (posts) {

  }).then(function (success) {
    // The related comments were deleted
  }, function (error) {
    console.error('Error deleting related comments ' + error.code + ': ' + error.message);
  });
});

const cloudEmailTemplateSubjects = {
  'verifyRemoveUser': 'Verify Your Request for Account Deletion'
};

Parse.Cloud.define('sendEmails', function (request, response) {
  const templateName = request.params.templateName;
  const toEmail = request.params.toEmail;
  const variables = request.params.variables;

  const subject = cloudEmailTemplateSubjects[templateName];
  const fromEmail = 'contact@politicl.com';

  // Get access to Parse Server's cache
  const {AppCache} = require('parse-server/lib/cache');
  // Get a reference to the MailgunAdapter
  // NOTE: It's best to do this inside the Parse.Cloud.define(...) method body and not at the top of your file with your other imports. This gives Parse Server time to boot, setup cloud code and the email adapter.
  const MailgunAdapter = AppCache.get('YTlrBqSp0MzkqIfZjG1Lz4L8BAu1XfqlMFJ4da3bSFu72tN0eK514AumUY').userController.adapter;

  debugger;

  // Invoke the send method with an options object
  const promise = MailgunAdapter.send({
    templateName: templateName,
    // Optional override of your configuration's subject
    subject: subject,
    fromAddress: fromEmail,
    // Optional override of the adapter's fromAddress
    recipient: toEmail,
    variables: variables,
    // {{alert}} will be compiled to 'New posts'
    // variables: {alert: 'New posts'},// {{alert}} will be compiled to 'New posts'
    // Additional message fields can be included with the "extra" option
    // See https://nodemailer.com/extras/mailcomposer/#e-mail-message-fields for an overview of what can be included
    extra: {
      attachments: [/* include attachment objects */],
      replyTo: 'reply-to-address'
    }
  });

  promise.then(function (value) {
    response.success(value);
  }, function (err) {
    response.error(err.stack);
  });

});

