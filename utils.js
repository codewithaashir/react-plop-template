const actions  = require("./constants.js");
const config = require("./config.json");
const getFolder = (project) => {
    let folder = {
       react:config.extension.includes("js")?"React/Js":"React/Ts",
      "react-native":config.extension.includes("js")?"ReactNative/Js":"ReactNative/Ts",
    } 
    return folder[project];
}
const getActionsBasedoNFrameWork = (type) => {
  let state = {
    type,
    ext:config.extension,
    extSplit:config.extension.includes("x") ? config.extension.split("x")[0] : config.extension,
    folder:getFolder(config.project),
  };  
  return actions(state);
};

module.exports = getActionsBasedoNFrameWork;