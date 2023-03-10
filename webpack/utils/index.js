const path = require("path");
const fs = require("fs");
const PUBLIC_PATH = path.resolve(__dirname, "../../", "public");
const ROOT_PATH = path.resolve(__dirname, "../../");

const libs = ["agora-rte-sdk", "agora-edu-core", "agora-common-libs"];

let ALIAS = libs.reduce((prev, cur) => {
  const libName = cur;

  const libPath = path.resolve(ROOT_PATH, `../${libName}/src`);

  const libExists = fs.existsSync(libPath);

  if (libExists) {
    prev[libName] = libPath;
  }

  return prev;
}, {});

const locateEnvFile = () => {
  const projectEnvPath = path.resolve(ROOT_PATH, ".env");
  if (fs.existsSync(projectEnvPath)) {
    return projectEnvPath;
  }
  const demoEnvPath = path.resolve("../../.env");
  if (fs.existsSync(demoEnvPath)) {
    return demoEnvPath;
  }
  console.warn("cannot locate env path");
  return ".env";
};

const locateModule = (path) => {
  return require.resolve(path);
};

module.exports = {
  PUBLIC_PATH,
  ROOT_PATH,
  ALIAS,
  locateEnvFile,
  locateModule,
};
