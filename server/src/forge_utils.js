import ForgeSDK from 'forge-apis';
import request from 'request';
import base64 from 'base-64';
import NgrokUtils from './ngrok_utils';
import {promisify} from 'es6-promisify';

class ForgeUtils {
  static FORGE_URL        = 'https://developer.api.autodesk.com';
  static DAS_URL          = 'https://developer.api.autodesk.com/da/us-east/v3';
  static CLIENT_ID        = process.env.FORGE_CLIENT_ID || '';
  static CLIENT_SECRET    = process.env.FORGE_CLIENT_SECRET || '';
  static ACTIVITY_ID      = process.env.FORGE_ACTIVITY_ID || 'Revit.RvtIOSketchItActivity2018+prod';
  static AUTH_SCOPE       = ['data:write', 'data:create', 'data:read', 'bucket:read', 'bucket:update', 'bucket:create', 'bucket:delete', 'viewables:read', 'code:all'];
  static BUCKET_KEY       = process.env.FORGE_BUCKET_KEY || '';
  static HOOK_WORKFLOW    = NgrokUtils.isLocalUrl() ? 'local-sketchit-workflow-id' : 'fixed-sketchit-workflow-id';
  static POLLING_DELAY    = 5000;
  static _oAuth2TwoLegged = null;

  static init () {
    this._oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(this.CLIENT_ID, this.CLIENT_SECRET, this.AUTH_SCOPE, true);
    return this._oAuth2TwoLegged.authenticate().then(cr => {
      return Promise.all([this.getOrCreateBucket(), this.createOrModifyWebhook()]);
    }).catch(err => {
      console.error(err);
    });
  };

  static getOrCreateBucket () {
    let BucketsApi = new ForgeSDK.BucketsApi();
    let bucketKey = this.BUCKET_KEY;

    return BucketsApi.getBucketDetails(bucketKey, null, this._oAuth2TwoLegged.getCredentials()).catch(err => {
      let policyKey = 'temporary';
      return BucketsApi.createBucket({bucketKey, policyKey}, {}, null, this._oAuth2TwoLegged.getCredentials());
    }).then(({body:{bucketKey}}) => {
      if (bucketKey !== this.BUCKET_KEY) {
        throw new Error('Could not find or create bucket!');
      }
    });
  };

  static createEmptyResource (objectName, access='write') {
    let ObjectsApi = new ForgeSDK.ObjectsApi();
    let bucketKey = this.BUCKET_KEY;
    return ObjectsApi.uploadObject(bucketKey, objectName, 0, '', {}, null, this._oAuth2TwoLegged.getCredentials());
  };

  static createSignedResource (objectName, access='read') {
    let ObjectsApi = new ForgeSDK.ObjectsApi();
    let bucketKey = this.BUCKET_KEY;
    return ObjectsApi.createSignedResource(bucketKey, objectName, {}, {access}, null, this._oAuth2TwoLegged.getCredentials()).then(({body:{signedUrl}}) => {
      return signedUrl;
    });
  };

  static createOrModifyWebhook () {
    let params = {
      url: this.FORGE_URL + '/webhooks/v1/systems/derivative/events/extraction.finished/hooks',
      headers: {
        Authorization: 'Bearer ' + this._oAuth2TwoLegged.getCredentials().access_token,
      },
      json: true
    };

    promisify(request.get)(params).then(({body:{data}}) => {
      return Promise.all(data.map((d) => {
        let hook = d.__self__;
        if (d.scope.workflow !== this.HOOK_WORKFLOW)
          return Promise.resolve(false);
        if (d.callbackUrl === NgrokUtils.getServerUrl() + '/translationcomplete')
          return Promise.resolve(true);

        console.log('deleting hook - ' + hook)
        return this.deleteWebhook(hook).then(_ => false);
      })).then(values => {
        if (!values.includes(true)) {
          this.createWebhook();
        }
      });
    });
  };

  static createWebhook () {
    let params = {
      url: this.FORGE_URL + '/webhooks/v1/systems/derivative/events/extraction.finished/hooks',
      headers: {
        Authorization: 'Bearer ' + this._oAuth2TwoLegged.getCredentials().access_token,
      },
      json: {
        callbackUrl: NgrokUtils.getServerUrl() + '/translationcomplete',
        scope: {
          workflow: this.HOOK_WORKFLOW
        }
      }
    };
    console.log('creating hook');
    return promisify(request.post)(params);
  };

  static deleteWebhook (hook) {
    let params = {
      url: this.FORGE_URL + '/webhooks/v1' + hook,
      headers: {
        Authorization: 'Bearer ' + this._oAuth2TwoLegged.getCredentials().access_token,
      }
    }
    return promisify(request.delete)(params);
  };

  static translate (objectName) {
    let DerivativesApi = new ForgeSDK.DerivativesApi();
    let urn = base64.encode('urn:adsk.objects:os.object:' + this.BUCKET_KEY + '/' + objectName);
    let input = {urn};
    let output = {
      formats: [
        {
          type: 'svf',
          views: ['2d', '3d']
        }
      ]
    };
    let misc = {
      workflow: this.HOOK_WORKFLOW
    }
    return DerivativesApi.translate({input, output, misc}, {}, null, this._oAuth2TwoLegged.getCredentials());
  };

  static getThumbnail (urn) {
    let DerivativesApi = new ForgeSDK.DerivativesApi();
    return DerivativesApi.getThumbnail(urn, {}, null, this._oAuth2TwoLegged.getCredentials())
                         .then(({body}) => new Buffer.from(body).toString('base64'))
                         .catch(_ => '');
  };

  static postWorkitem(payload) {
    let params = {
      url: this.DAS_URL + '/workitems',
      headers: {
        Authorization: 'Bearer ' + this._oAuth2TwoLegged.getCredentials().access_token,
      },
      json: payload
    }
    return promisify(request.post)(params).then(({body:{id}}) => id);
  };

  static getWorkitemStatus (id) {
    let params = {
      url: this.DAS_URL + '/workitems/' + id,
      headers: {
        'Authorization': 'Bearer ' + this._oAuth2TwoLegged.getCredentials().access_token,
      }
    };
    return promisify(request)(params).then(({body}) => JSON.parse(body).status);
  };
};

export default ForgeUtils;
