module.exports = ({type,ext,extSplit,folder}) => [
  "------------------------------",
  `Generating a new ${type}...`,
  "------------------------------",
  {
    // Add a new file
    type: "add",
    // Path for the new file
    path: `src/${type}s/{{pascalCase name}}/{{pascalCase name}}.${ext}`,
    // Handlebars template used to generate content of new file
    templateFile: `plop-templates/${folder}/Component.hbs`,
  },
  {
    type: "add",
    path: `src/${type}s/{{pascalCase name}}/{{pascalCase name}}.test.${extSplit}`,
    templateFile: `plop-templates/${folder}/Component.test.hbs`,
  },
  {
    type: "add",
    path: `src/${type}s/{{pascalCase name}}/{{pascalCase name}}.styles.${extSplit}`,
    templateFile: `plop-templates/${folder.split('/')[0]}/Component.styles.hbs`,
  },
  {
    type: "add",
    path: `src/${type}s/index.${extSplit}`,
    templateFile: "plop-templates/injectable-index.hbs",
    skipIfExists: true,
  },
  {
    type: "append",
    path: `src/${type}s/index.${extSplit}`,
    pattern: "/* PLOP_INJECT_IMPORT */",
    template: "import {{pascalCase name}} from './{{pascalCase name}}';",
  },
  {
    type: "append",
    path: `src/${type}s/index.${extSplit}`,
    pattern: "/* PLOP_INJECT_EXPORT */",
    template: "\t{{pascalCase name}},",
  },
];
