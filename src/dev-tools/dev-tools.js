import React from 'react';
import ReactDOM from 'react-dom';

const localDevTools = require.context('./', false, /dev-tools\.local\.js/);
const localPath = localDevTools.keys()[0];
if (localPath) {
  localDevTools(localPath);
}

async function install() {
  function DevTools() {
    const msg = 'Hello from Dev Tools';
    console.log(msg);
    return msg;
  }

  const devToolsRoot = document.createElement('div');
  document.body.appendChild(devToolsRoot);
  ReactDOM.render(<DevTools />, devToolsRoot);
}

export { install };
