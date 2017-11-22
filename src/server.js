import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import Html from './helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';

import {match} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {ReduxAsyncConnect, loadOnServer} from 'redux-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import {Provider} from 'react-redux';
import getRoutes from './routes';

const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});

// Parse Server.
const ParseServer = require('parse-server').ParseServer;
const resolve = path.resolve;
const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

const projectRootPath = path.resolve(__dirname, '../');

const commonConfigure = {
  appName: 'Politicl',
  appId: 'YTlrBqSp0MzkqIfZjG1Lz4L8BAu1XfqlMFJ4da3bSFu72tN0eK514AumUY',
  clientKey: 'ZiHvJBUePePH68qAiBibBcm2mBRUCNeyskUJSgQpegBrxroneecaFWk7sM',
  restAPIKey: '4shwgAUTeUJAK2vkLcMQ40wUnvUFDncG6Ne6q9PIgWvBITTbob3FSMS9Ay',
  javascriptKey: '4ri90zKbBxY92YlxE8HasDhaZWEGsADvrryWERpDehPaLaTZEXG33sI9NG',
  masterKey: 'M0h4dP1VPBPBAtMsWrw6DyNDkqwR24sRn81hkAxp7iJsniODMyXiC8PT70',
  cloud: process.env.CLOUD_CODE_MAIN || projectRootPath + '/cloud/main.js',
  liveQuery: {
    classNames: []
  },
  verifyUserEmails: true,
  emailAdapter: {
    module: 'parse-server-mailgun',
    options: {
      // The address that your emails come from
      fromAddress: 'trujunzhang@gmail.com>',
      // Your domain from mailgun.com
      domain: 'sandbox25f368c4b2da4621af07cf4276682fd6.mailgun.org',
      // Your API key from mailgun.com
      apiKey: 'key-330783da3fa3ebc4e72d8ffae7c50b70',
      // The template section
      templates: {
        passwordResetEmail: {
          subject: 'Forgot Your Password on Politicl?',
          pathPlainText: resolve(projectRootPath, 'email-templates/password_reset_email.txt'),
          pathHtml: resolve(projectRootPath, 'email-templates/password_reset_email.html'),
          callback: function (user) {
            return {
              username: user.get('username'),
            };
          }
          // Now you can use {{firstName}} in your templates
        },
        verificationEmail: {
          subject: 'Verify Your Email for Politicl.com',
          pathPlainText: resolve(projectRootPath, 'email-templates/verification_email.txt'),
          pathHtml: resolve(projectRootPath, 'email-templates/verification_email.html'),
          callback: function (user) {
            return {
              username: user.get('username'),
              homepage: 'https://politicl.com',
              token: user.get('_email_verify_token'),
            };
          }
          // Now you can use {{firstName}} in your templates
        },
        verifyRemoveUser: {
          subject: 'Verify Your Request for Account Deletion',
          pathPlainText: resolve(projectRootPath, 'email-templates/verifyRemoveUser.txt'),
          pathHtml: resolve(projectRootPath, 'email-templates/verifyRemoveUser.html')
        }
      }
    }
  }
};


let parseConfig = {
  publicServerURL: 'https://politicl-uapp.herokuapp.com/',
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  // appId: process.env.APP_ID || 'myAppId',
  // clientKey: process.env.CLIENT_KEY || '',
  // masterKey: process.env.MASTER_KEY || '',
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
};

if (__DEVELOPMENT__) {
  parseConfig = {
    publicServerURL: 'http://localhost:3000/',
    databaseURI: 'mongodb://localhost:28018/Politicl-backend',
    serverURL: 'http://localhost:3000/parse',
  };
}

const api = new ParseServer({
  ...commonConfigure,
  ...parseConfig
});

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);


app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

app.use(Express.static(path.join(__dirname, '..', 'static')));

app.get('/wanghao', (req, res) => {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on trujunzhang!');
});

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, {target: targetUrl});
});

app.use('/ws', (req, res) => {
  proxy.web(req, res, {target: targetUrl + '/ws'});
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  const client = new ApiClient(req);
  const memoryHistory = createHistory(req.originalUrl);
  const store = createStore(memoryHistory, client);
  const history = syncHistoryWithStore(memoryHistory, store);

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  match({history, routes: getRoutes(store), location: req.originalUrl}, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );

        res.status(200);

        global.navigator = {userAgent: req.headers['user-agent']};

        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component}
                                        store={store}/>));
      });
    } else {
      res.status(404).send('Not found');
    }
  });
});

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
