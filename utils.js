const actions  = require("./constants.js");
const config = require("./config.json");
const getFolder = (project) => {
    let folder = {
       react:config.extension&&config.extension.includes("js")?"React/Js":"React/Ts",
      "react-native":config.extension&&config.extension.includes("js")?"ReactNative/Js":"ReactNative/Ts",
    } 
    return folder[project];
}
const getExtension = (extension) => {
   return extension&&extension.includes("x") ? extension.split("x")[0] : extension;
}
const getStylesName = (project) => {
   let style = {
     react:"css",
     "react-native":`styles.${getExtension(config.extension)}`,
   }
   return style[project];
}
const getActionsBasedoNFrameWork = (type) => {
  let state = {
    type,
    ext:config.extension&&config.extension,
    extSplit:getExtension(config.extension),
    folder:getFolder(config.project),
    style:getStylesName(config.project),
  };  
  return state.extSplit && actions(state);
};

module.exports = getActionsBasedoNFrameWork;