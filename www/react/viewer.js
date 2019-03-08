/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

import React from 'react';
import ReduxUtils from '../utils/redux_utils';
import RequestUtils from '../utils/request_utils';
import base64 from 'base-64';

class Viewer extends React.Component {
  componentDidMount () {
    RequestUtils.getRequest('/bucket').then(bucket => {
      this.myBucket = bucket;
    }),

    RequestUtils.getRequest('/token').then(token => {
      let options = {
        env: 'AutodeskProduction',
        getAccessToken: (onGetAccessToken) => {
                var accessToken = token.access_token;
                var expireTimeSeconds = 60 * 30;
                onGetAccessToken(accessToken, expireTimeSeconds);
        }
      };
      let documentId = 'urn:' + base64.encode('urn:adsk.objects:os.object:' + this.myBucket + '/' + this.props.modelName);
      Autodesk.Viewing.Initializer(options, () => {
        let viewerApp = new Autodesk.Viewing.ViewingApplication('forge-viewer');
        viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D);
        viewerApp.loadDocument(documentId, (doc) => {
          let viewables = viewerApp.bubble.search({'type':'geometry'});
          if (viewables.length === 0) {
            console.error('Document contains no viewables.');
            return;
          }
          viewerApp.selectItem(viewables[0], null, console.error);
        }, console.error);
      });
    });
  };

  render () {
    return (
      <div id='viewer'>
        <div id='forge-viewer' />
        <div id='forge-logo'>
          <img id='logo-size' src='../res/forge-logo.png' alt='Autodesk Forge' />
        </div>
      </div>
    );
  };
};

let mapStateToProps = (state, ownProps) => {
  return {
    modelName: state.modelData.name
  };
};

export default ReduxUtils.connect(mapStateToProps)(Viewer);
