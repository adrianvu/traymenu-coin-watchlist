const {app, Tray, Menu, BrowserWindow} = require('electron');
const path = require('path');
const request = require('request');

const iconPath = path.join(__dirname, 'icon.png');
let appIcon = null;
let win = null;

var menuTemplate = [];
function refreshData() {
  appIcon.setTitle("Refreshing...");
  var count = 0;
  request('https://api.coinmarketcap.com/v2/ticker/?limit=10', function (error, response, body) {
    body = JSON.parse(body);
    var menuTemplate = []
    for (var key in body.data) {
        if (body.data.hasOwnProperty(key)) {
            var item = {
              label: body.data[key].symbol + ': ' + body.data[key].quotes.USD.price,
              type: 'normal',
            }
            menuTemplate.push(item);    
            if (count==0) appIcon.setTitle(body.data[key].symbol+': ' + body.data[key].quotes.USD.price);
            count++;
        }
        if (count == 9) {
          menuTemplate.push({label: 'Refresh Data',type: 'normal', selector: 'refreshData'});
          menuTemplate.push({label: 'Quit',type: 'normal', accelerator: 'Command+Q', selector: 'terminate:'})
          var contextMenu = Menu.buildFromTemplate(menuTemplate);
          appIcon.setContextMenu(contextMenu);
        }
    } 
  });
}

app.on('ready', function(){
  win = new BrowserWindow({show: false});
  appIcon = new Tray(iconPath);
  appIcon.setToolTip('Crypto Watchlist');
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Fetching Data ...',
      type: 'radio',
      checked: false
    }
  ]);
  appIcon.setContextMenu(contextMenu);
  refreshData();

  setInterval(function() {
    refreshData();
  }, 60000);
  
});