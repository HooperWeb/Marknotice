// Generated by CoffeeScript 1.9.1
(function() {
  var callBitcoinApi, checkBitcoin, createNewMark, displayNotice, exports, initBackground;

  exports = this;

  exports.markid = localStorage["marknoticeid"];

  exports.url = 'https://www.okcoin.cn/market.do';

  exports.apiUrl = 'https://www.okcoin.cn/api/v1/ticker.do?symbol=btc_cny';

  displayNotice = function(data) {
    var current;
    current = data.ticker.last;
    return chrome.bookmarks.update(exports.markid, {
      title: current
    });
  };

  callBitcoinApi = function() {
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open("GET", exports.apiUrl, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        return displayNotice(JSON.parse(xhr.responseText));
      }
    };
    return xhr.send();
  };

  checkBitcoin = function() {
    return chrome.bookmarks.search('https://www.okcoin.cn/market.do', function(bmk) {
      if (bmk[0]) {
        localStorage["marknoticeid"] = exports.markid = bmk[0].id;
        return chrome.tabs.create({
          url: chrome.extension.getURL('/assets/intro_exsit.html')
        });
      } else {
        return createNewMark();
      }
    });
  };

  createNewMark = function() {
    var newMark;
    newMark = {
      parentId: '1',
      title: 'Bitcoin',
      url: exports.url
    };
    chrome.bookmarks.create(newMark, function(r) {
      localStorage["marknoticeid"] = exports.markid = r.id;
      return callBitcoinApi();
    });
    return chrome.tabs.create({
      url: chrome.extension.getURL('/assets/intro.html')
    });
  };

  initBackground = function() {
    if (exports.markid) {
      chrome.bookmarks.get(exports.markid, function(bookmark) {
        if (!bookmark) {
          return localStorage.removeItem(exports.markid);
        }
      });
      checkBitcoin();
    } else {
      checkBitcoin();
    }
    return setInterval(callBitcoinApi, 30 * 1000);
  };

  addEventListener("load", initBackground, false);

}).call(this);
