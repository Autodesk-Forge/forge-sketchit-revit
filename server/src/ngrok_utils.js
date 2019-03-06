import ngrok from 'ngrok';

class NgrokUtils {
  static _url = null;

  static getServerUrl () {
    return this._url;
  };

  static isLocalUrl () {
    return !process.env.THIS_URL;
  };

  static init (port) {
    return NgrokUtils.generateUrl(port).then(url => {
      this._url = url;
      console.log(url);
    });
  };

  static generateUrl (port) {
    let url = process.env.THIS_URL;
    if (url)
      return Promise.resolve(url);
    return ngrok.connect(port);
  };
};

export default NgrokUtils;
