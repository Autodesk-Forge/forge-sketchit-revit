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

import socketio from 'socket.io';

class SocketUtils {
  static _sockets = [];

  static init (server) {
    let io =  socketio.listen(server);

    io.on('connection', socket => {
      this._sockets.push(socket);
    });

    io.on('disconnect', socket => {
      this._sockets = this._sockets.filter(s => s !== socket);
    });
  };

  static emit (fileId, msg) {
    this._sockets.forEach(socket => socket.emit(fileId, msg));
  };
};

export default SocketUtils;
