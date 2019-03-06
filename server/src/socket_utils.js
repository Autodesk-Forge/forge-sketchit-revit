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
