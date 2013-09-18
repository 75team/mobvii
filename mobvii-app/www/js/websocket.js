function MyWebSocket(url) {
  this.url = url;
  CustEvent.createEvents(this);
}
MyWebSocket.prototype = (function () {
  var conn = null;
  return {
    send: function (data) {
      conn.send(data);
    },
    connect: function (url) {
      var me = this;
      url = url || this.url;
      if (typeof MozWebSocket == 'function') {
        conn = new MozWebSocket(url);
      } else {
        conn = new WebSocket(url);
      }
      conn.onmessage = function (evt) {
        me.fire('message', {
          data: evt.data
        });
      };
      conn.onclose = function () {
        me.fire('close');
      };
      conn.onopen = function () {
        me.fire('open');
      };
    },
    disconnect: function () {
      conn.close();
    }
  };
})();
