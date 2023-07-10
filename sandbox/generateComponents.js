import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const NUMBER_OF_COMPONENTS = 10;

const generateSnapFile = async (path, component) => {
  const snapFile = `
  /** @type {import('../../types').UITeskitConfigFile} */
  export default {
    name: "${component}",
    url: "http://localhost:3000/${component}.html",
    skip: false,
    tests: [
      {
        type:'axe',
        description: 'Accessibility test 1',
        selector: '#app',
        config:{
          disableRules: ['color-contrast'],
        },
      },
      {
        type:'visual',
        description: 'Visual test 1',
        config:{
          threshold: 0.1,
          screenHeight: 1024,
          screenWidth: 1080,
          x: 0,
          y: 0,
        },
      }
    ]
  };
`;
  const fileName = component + ".ui-testkit.ts";

  await fs.promises.writeFile(path + fileName, snapFile);
};

const generateComponentHtml = async (path, component) => {
  const htmlFile = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${component}</title>
  </head>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 18px;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    #app {
      background-color: #f0f0f0;
      padding: 20px;
      border: 1px solid #ccc;
    }
  </style>
  <body>
    <div id="app">
      <h1>${component}</h1>
      <p>${component} content</p>
    </div>
  </body>
</html>
`;

  const fileName = component + ".html";

  await fs.promises.writeFile(path + fileName, htmlFile);
};

const generateComponents = async () => {
  const components = Array.from(Array(NUMBER_OF_COMPONENTS).keys()).map(
    (i) => `component1${i + 1}-ts`
  );

  const pathToComponents = path.join(__dirname, "public");

  for (const component of components) {
    await generateComponentHtml(pathToComponents + "/", component);
    await generateSnapFile(pathToComponents + "/", component);
  }
};

generateComponents();
