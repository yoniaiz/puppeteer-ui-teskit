# Puppeteer UI TestKit

Puppeteer UI TestKit is an open-source npm package designed to simplify the testing of UI visual regression and accessibility using Puppeteer and axe-core. With this package, developers can easily incorporate automated visual regression and accessibility tests into their web application testing workflows.

## Features

- **Visual Regression Testing**: Puppeteer UI TestKit provides an intuitive interface to capture and compare screenshots of web pages, enabling developers to identify visual differences and regressions between different versions of their UI.
- **Accessibility Testing**: The package integrates with axe-core, a powerful accessibility testing engine, allowing developers to automatically test their web pages for accessibility issues. Puppeteer UI TestKit provides a simple way to generate accessibility reports and identify any potential violations.
- **Puppeteer Integration**: Puppeteer is a popular Node.js library that provides a high-level API for controlling headless Chrome or Chromium browsers. Puppeteer UI TestKit leverages Puppeteer's capabilities to interact with web pages, capture screenshots, and perform automated UI tests.

## Getting started

To get started with Puppeteer UI TestKit, follow these simple steps:

1. **Installation**: Install the package using npm or yarn:

```bash
npm install -D puppeteer-ui-testkit
```

2. **Create a Test File**: Create a new file with the following pattern: `[name].ui-testkit.ts` or `[name].ui-testkit.js`. This file will contain the configuration for your tests.

3. **Export Test Configuration**: In the test file, export a default configuration object that defines the tests you want to run. The configuration object should follow the `TestkitConfigFile` interface:

```typescript
import { TestkitConfigFile } from 'puppeteer-ui-testkit';

const config: TestkitConfigFile = {
  name: 'button-component',
  url: 'http://localhost:3000/button.html',
  tests: [
    // Define your tests here
  ],
};

export default config;
```

Or for javascript

```javascript
/** @type {import('puppeteer-ui-testkit').UITeskitConfigFile} */
const config: TestkitConfigFile = {
  name: "button-component",
  url: "http://localhost:3000/button.html",
  tests: [
    // Define your tests here
  ]
};

export default config;
```

4. **Define Tests**: Inside the tests array of the configuration object, define the tests you want to run. There are two types of tests: `AxeTest` for accessibility testing and `VisualTest` for visual regression testing. Each test should include a type, description, and other relevant properties based on the test type.

```typescript
const config: TestkitConfigFile = {
  // ...
  tests: [
    {
      type: 'axe',
      description: 'Accessibility test 1',
      selector: '#app',
      config: {
        disableRules: ['color-contrast'],
      },
    },
    {
      type: 'visual',
      description: 'Visual test 1',
      config: {
        threshold: 0.1,
        screenHeight: 1024,
        screenWidth: 1080,
        x: 0,
        y: 0,
      },
    },
    // Add more tests as needed
  ],
};
```

5. **Create a Test Script**: Define a new script in the **scripts** section of your `package.json` file. This script will run the Puppeteer UI TestKit. For example:

```json
{
  "scripts": {
    "test:ui-testkit": "puppeteer-ui-testkit"
  }
}
```

6. **Run Tests**: Execute the test script using the package manager of your choice:

```bash
npm run test:ui-testkit
```

The tests will be executed based on the provided configuration, and the results will be displayed in the command line.

- For visual tests, Puppeteer UI TestKit will save the snapshots under a folder named `__visual-snapshots__`, which will be created in the same directory where the configuration file is located. The screenshots will be saved as PNG files with the following naming convention: `[configuration name]_[test description].ui-testkit.png`.

- If there is a mismatch between the saved snapshot and the newly captured snapshot, Puppeteer UI TestKit will present three options in the command line:

  - Option 1: Update the screenshot with the newly captured one.
  - Option 2: Show the diff between the saved snapshot and the newly captured snapshot, allowing you to choose to update or skip the screenshot.
  - Option 3: Skip updating the screenshot.

- In the CI environment, any visual test mismatches will cause the tests to fail, ensuring that any changes to the UI are properly reviewed.

These steps will enable you to define, execute, and manage your UI tests using Puppeteer UI TestKit, including visual regression tests with snapshot comparisons.

## Configuration file options

| Option | Description |
| ------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url    |             | (string, optional): The URL of the page to test. If specified, Puppeteer will navigate to this URL before running the tests. This allows you to test specific web pages or web applications. |
| name   |             | (string): The name of the test configuration. It helps identify and distinguish different test configurations.                                                                               |
| skip   |             | (boolean, optional): Specifies whether to skip running the tests in this configuration. If set to true, the tests will be skipped when executed.                                             |
| tests  |             | (array of objects): An array of individual test objects. Each test object represents a specific test to be performed.                                                                        |

The tests array includes two types of tests: AxeTest for accessibility testing and VisualTest for visual regression testing. Here's an explanation of the options for each test type:

### AxeTest Configuration Options

| Option              | Description |
| ------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                |             | (string): The type of the test, which should be set to 'axe' for accessibility testing.                                                                                                       |
| description         |             | (string): The description of the test. It provides a brief explanation of what the test is checking.                                                                                          |
| selector            |             | (string): The selector of the element on which to run axe-core for accessibility testing. It allows you to focus the accessibility checks on specific elements or areas of the page.          |
| config              |             | (object, optional): Additional configuration options for axe-core.                                                                                                                            |
| config/disableRules |             | (array of strings): An array of rule IDs to disable during accessibility testing. You can specify specific rule IDs that you want to skip.                                                    |
| config/exclude      |             | (array of strings): An array of CSS selectors representing elements to exclude from accessibility testing. Elements matching these selectors will be ignored during the accessibility checks. |

### VisualTest Configuration Options

| Option              | Description |
| ------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| type                |             | (string): The type of the test, which should be set to 'visual' for visual regression testing                                                                                        |
| description         |             | (string): The description of the test. It provides a brief explanation of what the test is checking.                                                                                 |
| config              |             | (object, optional): Additional configuration options for screenshot capture and comparison                                                                                           |
| config/threshold    |             | (number): The threshold for visual difference comparison. It represents the maximum allowed difference between two screenshots. Smaller values indicate stricter comparison criteria |
| config/screenWidth  |             | (number): The width of the screenshot to capture. By default, it captures the full page width.                                                                                       |
| config/screenHeight |             | (number): The height of the screenshot to capture. By default, it captures the full page height                                                                                      |
| config/x            |             | (number): The x-coordinate of the screenshot area to capture. It allows you to specify a specific region of the page.                                                                |
| config/y            |             | (number): The y-coordinate of the screenshot area to capture. It allows you to specify a specific region of the page.                                                                |

The configuration file allows you to define multiple tests by adding additional test objects to the tests array. Each test can be customized based on its type (AxeTest or VisualTest) and the specific options provided.

By utilizing these configuration options, you can create comprehensive test suites that cover both accessibility and visual regression aspects of your web application, enabling you to identify and address potential issues effectively.

## CLI Options

Puppeteer UI TestKit provides several command-line interface (CLI) options to customize the test execution. Here's an explanation of each CLI option:

| Flag             | Description |
| ---------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-u`, `--update` |             | This option allows you to update the saved snapshots with newly captured screenshots. When this option is specified, Puppeteer UI TestKit will update the snapshots instead of performing a comparison.                                                         |
| `-r`,`--remove`  |             | With this option, you can remove any unused snapshots. Unused snapshots refer to the ones that are no longer associated with any tests in the test configuration file.                                                                                          |
| `--headless`     |             | (boolean): This option specifies whether to run the browser in headless mode. By default, it is set to `true`, meaning the browser will run in headless mode. You can set it to `false` if you want to run the browser with a visible UI.                       |
| `-p`, `--port`   |             | (number): This option allows you to specify the port on which the test server should run. It is used when you pass a static path to start the server. The default port is `3002`, but you can provide a different port number.                                  |
| --statics        |             | (string): Use this option to specify the path to the static files that should be served by the test server. Puppeteer UI TestKit will serve these static files during the test execution.                                                                       |
| --folder         |             | (string): This option sets the folder containing the UI testkit config files. By default, it is set to the current directory (`.`), but you can provide a different folder path if your configuration files are located elsewhere.                              |
| --file           |             | (string): With this option, you can specify a file pattern to run. Puppeteer UI TestKit will only execute the test files that match the provided file pattern.                                                                                                  |
| --threshold      |             | (number): This option allows you to set the threshold for passing visual tests. The threshold represents the maximum allowed difference between snapshots. The default threshold is `0.01`, but you can adjust it based on your desired comparison sensitivity. |

You can use these CLI options to fine-tune your test execution, customize the test server, specify file patterns, and configure other test parameters according to your specific testing requirements.

## CI

When running Puppeteer UI TestKit in a Continuous Integration (CI) environment, mismatches between snapshots will cause the tests to fail. However, the newly captured snapshots that caused the mismatches will be saved. This allows you to add a CI step to save the snapshots and open a pull request to review the changes. Here's an example of how you can achieve this using GitHub Actions:

```yaml
name: CI

on:
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
      - uses: actions/checkout@v3
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Extract branch name
        shell: bash
        run: echo "branch=${GITHUB_HEAD_REF:-${GITHUB_REF#refs/heads/}}" >> $GITHUB_OUTPUT
        id: extract_branch

      - run: npm ci
      - run: npm test

      - name: commit failed snapshots and open PR to current branch on test failure
        if: ${{ failure() }}
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'fix: broken visual tests'
          branch: 'fix-broken-visual-tests'
          branch-suffix: timestamp
          base: ${{ steps.extract_branch.outputs.branch }}
```

In this example, the GitHub Actions workflow is triggered on pull requests targeting the main branch. If any visual tests fail, a new branch named 'fix-broken-visual-tests' is created. The failed snapshots are committed to this branch, and a pull request is opened to review the changes.

By incorporating this CI step into your workflow, you can easily identify and review any failed visual tests, making it convenient to address any necessary updates or fixes.

This example uses: https://github.com/peter-evans/create-pull-request.

## Contributing

Contributions to Puppeteer UI TestKit are welcome! Whether you want to report a bug, propose a new feature, or submit a pull request, please refer to the contribution guidelines for more information.

## License

Puppeteer UI TestKit is released under the MIT License. Feel free to use, modify, and distribute this package according to the terms of the license.

## Acknowledgments

Puppeteer UI TestKit is built upon the efforts of the Puppeteer and axe-core communities. We would like to express our gratitude for their excellent work and contributions, which have made this package possible.

- [Puppeteer](https://pptr.dev/)
- [Axe-core](https://github.com/dequelabs/axe-core)
- [Puppeteer Axe-core](https://www.npmjs.com/package/@axe-core/puppeteer)
