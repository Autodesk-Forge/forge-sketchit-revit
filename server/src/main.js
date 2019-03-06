import express from 'express';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import shortid from 'shortid';
import ForgeSDK from 'forge-apis';
import base64 from 'base-64';
import ForgeUtils from './forge_utils';
import NgrokUtils from './ngrok_utils';
import SocketUtils from './socket_utils';
import AppUtils from './app_utils';

let app =  express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/../../www'));
app.use('/node_modules', express.static(__dirname + '/../../node_modules'));
app.use(favicon(__dirname + '/../../www/res/favicon.png'));
app.set('views', __dirname + '/../../www');
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.get('/*', (req, res, next) => {
  let url = req.path.substring(1);
  if (!url) {
    res.render('index');
    return;
  }
  next();
});

app.get('/token', (req, res) => {
  let url = ForgeUtils.DAS_URL;
  let clientId = ForgeUtils.CLIENT_ID;
  let clientSecret = ForgeUtils.CLIENT_SECRET;
  let authScope    = ForgeUtils.AUTH_SCOPE;
  let oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(clientId, clientSecret, authScope, true);

  oAuth2TwoLegged.authenticate().then(token => {
    res.json(token);
  });
});

app.get('/bucket', (req, res) => {
  let bucket = ForgeUtils.BUCKET_KEY;
  res.json(bucket);
});

app.get('/thumbnail', (req, res) => {
  let {fileId} = req.query;
  let thumbnail = AppUtils.getThumbnail(fileId);
  res.json({found: thumbnail!=='',  thumbnail});
});

app.get('/download', (req, res) => {
  let {fileId} = req.query;
  ForgeUtils.createSignedResource(fileId).then(signedUrl => {
    res.json({found: true,  signedUrl});
  }).catch(_ => {
    res.json({found: false, signedUrl: ''});
  });
});

app.post('/workitemcomplete', (req, res) => {
  let {status, id} = req.body;
  let fileId = AppUtils.getFileId(id);
  console.log(status, '- generated ' + fileId)
  if (status === 'success') {
    ForgeUtils.translate(fileId);
    SocketUtils.emit(fileId, 'workitem');
  }
  res.json({status, id, fileId});
});

app.post('/translationcomplete', (req, res) => {
  let {hook, payload} = req.body;
  let urn = payload.URN;
  let fileId = base64.decode(urn).replace('urn:adsk.objects:os.object:' + ForgeUtils.BUCKET_KEY + '/', '');

  ForgeUtils.getThumbnail(urn).then(thumbnail => {
    AppUtils.setThumbnail(fileId, thumbnail);
    SocketUtils.emit(fileId, 'thumbnail');
  });

  console.log('success', '- translated ' + fileId)
  res.sendStatus(200);
});

app.post('/create', (req, res) => {
  let {elements} = req.body;
  let fileId = shortid.generate() + '.rvt';
  AppUtils.addJobDetails(fileId);

  ForgeUtils.createEmptyResource(fileId).then(_ => {
    return ForgeUtils.createSignedResource(fileId, 'write');
  }).then(signedUrl => {
    let payLoad = {
      activityId: ForgeUtils.ACTIVITY_ID,
      arguments: {
        sketchItInput: {
          url: 'data:application/json,'+JSON.stringify(elements)
        },
        onComplete: {
          verb: 'post',
          url: NgrokUtils.getServerUrl() + '/workitemcomplete'
        },
        result: {
          verb: 'put',
          url: signedUrl
        }
      }
    };
    return ForgeUtils.postWorkitem(payLoad);
  }).then(id => {
    console.log('posted -', id);
    AppUtils.setWorkitemId(fileId, id);
  }).catch(err => {
    console.log(err)
  });
  res.json({fileId});
});


app.set('port', process.env.PORT || 3000);

let server = app.listen(app.get('port'), () => {
  console.log('Server listening on port ' + server.address().port);
});


NgrokUtils.init(app.get('port')).then(_ => {
  ForgeUtils.init();
}).then(_ => {
  AppUtils.init();
}).then(_ => {
  SocketUtils.init(server);
});
