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

import ForgeUtils from './forge_utils';
import SocketUtils from './socket_utils';
import base64 from 'base-64';

class AppUtils {
  static _data = [];

  static init () {
    // setInterval(_ => this.getMissingThumbnails(), 3000);
  };

  static addJobDetails (fileId) {
    this._data.push({workitemId: '', fileId, thumbnail: ''});
  }

  static getFileId (workitemId) {
    let data = this._data.find(d => d.workitemId === workitemId);
    return data.fileId;
  }

  static getThumbnail (fileId) {
    let data = this._data.find(d => d.fileId === fileId);
    return data.thumbnail;
  }

  static setThumbnail (fileId, thumbnail) {
    let data = this._data.find(d => d.fileId === fileId);
    data.thumbnail = thumbnail;
  }

  static setWorkitemId (fileId, workitemId) {
    let data = this._data.find(d => d.fileId === fileId);
    data.workitemId = workitemId;
  }

  static getMissingThumbnails () {
    this._data.filter(d => d.thumbnail==='').forEach(({fileId}) => {
     let urn = base64.encode('urn:adsk.objects:os.object:' + ForgeUtils.BUCKET_KEY + '/' + fileId);
     ForgeUtils.getThumbnail(urn).then(thumbnail => {
        if (!thumbnail) return;
        this.setThumbnail(fileId, thumbnail);
        SocketUtils.emit(fileId, 'thumbnail');
      });
    });
  }
};

export default AppUtils;
