/* eslint-disable prettier/prettier */
const plopConfig = require("./plopConfig");
const config = require("./config.json");
const getActionsBasedoNFrameWork = require("./utils");
const isCorrectExtension = (value) => {
  return (value) => {
    if (!["ts", "tsx", "js", "jsx"].includes(value))
      return `\n${value} is not a correct extension please try to use \n1-js\n2-ts\n3-jsx\n4-tsx`;
    return true;
  };
};
const isCorrectFramework = (value) => {
  return (value) => {
    if (!["react", "react-native"].includes(value))
      return `\n${value} is not supported library or framework for this package please try to use \n1-react\n2-react-native`;
    return true;
  };
};
const isProjectAdded = () => {
  return () => {
    if (config && config.project && config.extension) {
      return true;
    }
    return `\n Please add project and extension first by running \n npm run generate project (react/react-native) (jsx/tsx/js/ts)`;
  };
};
const dynamic_generator =
  config && config.project && config.project === "react-native"
    ? "screen"
    : "page";
module.exports = (plop) => {
  let extSplit = config.extension.includes("x") ? config.extension.split("x")[0] : config.extension;
  plopConfig.helpers(plop);
  plop.setGenerator("project", {
    prompts: [
      {
        type: "input",
        name: "framework/library",
        message: "Select the framework/library",
        default: plopConfig.defaultFramework,
        validate: isCorrectFramework("framework/library"),
        //default: plopConfig.defaultFramework,
        //choices: () => plopConfig.frameworks,
      },
      {
        type: "input",
        name: "extension",
        default: plopConfig.defaultExtension,
        message: "Select the extension",
        validate: isCorrectExtension("extension"),
        //default: plopConfig.defaultFramework,
        //choices: () => plopConfig.frameworks,
      },
    ],
    actions: [
      {
        type: "framework/library",
      },
      {
        type: "extension",
      },
    ],
  });

  plop.setGenerator("component", {
    description: "Create a component",
    // User input prompts provided as arguments to the template
    prompts: [
      {
        // Raw text input
        type: "input",
        // Variable name for this input
        name: "name",
        // Prompt to display on command line
        message: "What is your component name?",
        validate: isProjectAdded(),
      },
    ],
    actions: getActionsBasedoNFrameWork(`component`),
  });
  plop.setGenerator(`${dynamic_generator}`, {
    description: `Create a ${
      dynamic_generator.charAt(0).toUpperCase() + dynamic_generator.slice(1)
    }`,
    // User input prompts provided as arguments to the template
    prompts: [
      {
        // Raw text input
        type: "input",
        // Variable name for this input
        name: "name",
        // Prompt to display on command line
        message: `What is your ${
          dynamic_generator.charAt(0).toUpperCase() + dynamic_generator.slice(1)
        } name?`,
        validate: isProjectAdded(),
      },
    ],
    actions: getActionsBasedoNFrameWork(dynamic_generator),
  });
  plop.setGenerator("service", {
    description: "Create service",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your service name?",
      },
      {
        type: "confirm",
        name: "isParams",
        default: false,
        message: "Do you want to use Params inside your service?",
      },
      {
        type: "input",
        name: "extension",
        message: "Select the extension",
        validate: isCorrectExtension("extension"),
      },
      {
        type: "list",
        name: "type",
        message: "Select the type of service you want to create ?",
        default: plopConfig.defaultServiceType,
        choices: () => plopConfig.availableTypes(),
      },
    ],
    actions: [
      "------------------------------",
      "Generating a new service...",
      "------------------------------",
      {
        type: "add",
        path: "src/services/{{camelCase name}}.{{extension}}",
        templateFile: "plop-templates/service.hbs",
      },
      {
        type: "add",
        path: "src/services/index.{{extension}}",
        templateFile: "plop-templates/injectable-index.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "src/services/index.{{extension}}",
        pattern: "/* PLOP_INJECT_IMPORT */",
        template:
          "import {{camelCase name}}{{camelCase type}} from './{{camelCase name}}';",
      },
      {
        type: "append",
        path: "src/services/index.{{extension}}",
        pattern: "/* PLOP_INJECT_EXPORT */",
        template: "\t{{camelCase name}}{{camelCase type}},",
      },
    ],
  });
  plop.setGenerator("hook", {
    description: "Create Hook",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your hook name?",
      },
      {
        type: "input",
        name: "extension",
        message: "Select the extension",
        validate: isCorrectExtension("extension"),
      },
    ],
    actions: [
      "------------------------------",
      "Generating a new hook...",
      "------------------------------",
      {
        type: "add",
        path: "src/hooks/{{camelCase name}}.{{extension}}",
        templateFile: "plop-templates/hook.hbs",
      },
      {
        type: "add",
        path: "src/hooks/index.{{extension}}",
        templateFile: "plop-templates/injectable-index.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "src/hooks/index.{{extension}}",
        pattern: "/* PLOP_INJECT_IMPORT */",
        template: "import {{camelCase name}} from './{{camelCase name}}';",
      },
      {
        type: "append",
        path: "src/hooks/index.{{extension}}",
        pattern: "/* PLOP_INJECT_EXPORT */",
        template: "\t{{camelCase name}},",
      },
    ],
  });
  plop.setGenerator("reducer", {
    description: "Create reducer",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your reducer name?",
      }
    ],
    actions: [
      "------------------------------",
      "Generating a new reducer...",
      "------------------------------",
      {
        type: "add",
        path: `src/store/{{camelCase name}}/types.${extSplit}`,
        templateFile: "plop-templates/Store/StoreModule/StoreModule.types.hbs",
      },
      {
        type: "add",
        path: `src/store/{{camelCase name}}/action.${extSplit}`,
        templateFile: "plop-templates/Store/StoreModule/StoreModule.action.hbs",
      },
      {
        type: "add",
        path: `src/store/{{camelCase name}}/reducer.${extSplit}`,
        templateFile:
          "plop-templates/Store/StoreModule/StoreModule.reducer.hbs",
      },
      {
        type: "add",
        path: `src/store/index.${extSplit}`,
        templateFile: "plop-templates/Store/injectable-index.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: `src/store/index.${extSplit}`,
        pattern: "/* PLOP_INJECT_IMPORT */",
        template:
          "import {{pascalCase name}}Reducer from './{{camelCase name}}/reducer';",
      },
      {
        type: "append",
        path: `src/store/index.${extSplit}`,
        pattern: "/* PLOP_IMPORT_USE */",
        template: "\t{{pascalCase name}}Reducer,",
      },
    ],
  });
};
