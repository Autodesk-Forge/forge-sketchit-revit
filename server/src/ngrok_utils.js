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

import ngrok from 'ngrok';

class NgrokUtils {
  static _url = null;

  static getServerUrl () {
    return this._url;
  };

  static isLocalUrl () {
    return !process.env.FORGE_WEBHOOK_URL;
  };

  static init (port) {
    return NgrokUtils.generateUrl(port).then(url => {
      this._url = url;
      console.log(url);
    });
  };

  static generateUrl (port) {
    let url = process.env.FORGE_WEBHOOK_URL;
    if (url)
      return Promise.resolve(url);
    return ngrok.connect(port);
  };
};

export default NgrokUtils;
