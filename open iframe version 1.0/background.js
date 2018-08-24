var COMMANDS = {
  'open-this-tab': {
    label: '在当前窗口打开',
    handler: function(url, tab) {
      chrome.tabs.update(tab.id, {url: url});
    }
  },

  'open-new-tab': {
    label: '在新页面打开',
    handler: function(url, tab) {
      chrome.tabs.create({url: url});
    }
  },

  'open-new-window': {
    label: '在新窗口打开',
    handler: function(url, tab) {
      chrome.windows.create({url: url});
    }
  },

  'open-new-incognito-window': {
    label: '在隐私模式下打开窗口',
    handler: function(url, tab) {
      chrome.windows.create({url: url, incognito: true});
    }
  },

  'copy-url': {
    label: '复制框架地址',
    handler: function(url, tab) {
      var bufferNode = document.createElement('textarea');
      document.body.appendChild(bufferNode);
      bufferNode.value = url;
      bufferNode.focus();
      bufferNode.selectionStart = 0;
      bufferNode.selectionEnd = url.length;
      document.execCommand('copy');
      document.body.removeChild(bufferNode);
    },
    insertSeparatorBefore: true
  },
  'show-url':{
	  label: '查看框架地址',
	  handler:function(url,tab){
		alert(url);
	  }
   }
}

chrome.runtime.onInstalled.addListener(function() {
  for (var commandId in COMMANDS) {
    var command = COMMANDS[commandId];
	console.log(commandId);
    if (command.insertSeparatorBefore) {
      chrome.contextMenus.create({
        type: 'separator',
        contexts: ['frame'],
        // ID should not be required (http://crbug.com/154644)
        id: commandId + '-separator'
      });
    }

    chrome.contextMenus.create({
      title: command.label,
      contexts: ['frame'],
      id: commandId
    });
  }
});

chrome.contextMenus.onClicked.addListener(function(clickData, tab) {
  var url = clickData.frameUrl || clickData.pageUrl;
  var handler = COMMANDS[clickData.menuItemId].handler;

  handler(url, tab);
});
