const path = require('path');
const ROOT_PATH = path.resolve(__dirname, '../../');
const fs = require('fs');
const locateEnvFile = () => {
  const demoEnvPath = path.resolve(ROOT_PATH, '../../.env');
  if (fs.existsSync(demoEnvPath)) {
    return demoEnvPath;
  }
  console.warn('cannot locate env path');
  return '.env';
};

module.exports = {
  ROOT_PATH,
  locateEnvFile,
};
