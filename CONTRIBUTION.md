# Contributing to Puppeteer UI TestKit

Thank you for your interest in contributing to Puppeteer UI TestKit! We welcome contributions from the community to help improve and enhance the package. This guide outlines the process of contributing and getting started with development.

## Getting Started

To get started with development, follow these steps:

1. **Fork the Repository**: Start by forking the Puppeteer UI TestKit repository to your GitHub account. This will create a copy of the repository under your account.

2. **Clone the Repository**: Clone the forked repository to your local development environment using the following command:

   ```bash
   git clone https://github.com/your-username/puppeteer-ui-testkit.git

   ```

3. **Install Dependencies**: Navigate to the cloned repository directory and install the required dependencies using npm:

   ```bash
   cd puppeteer-ui-testkit
   npm install
   ```

   Please note that Puppeteer UI TestKit requires Node.js version 20 or later. Ensure that you have Node.js 20 installed before running the npm install command.

4. **Sandbox Folder**: The repository includes a sandbox folder that contains dummy testkit config files. You can use these files to test your feature or changes. Modify or create new testkit config files as needed.

5. **Build and Run**: To build the package and start make sure everything installed correctly, run the following command:

   ```bash
   npm run build
   npm run start
   ```

   This will build the package and run the visual testkits from the sandbox folder.

6. **Run tests**: To run the unit tests, run the following command:

   ```bash
   npm run test
   ```

   To run the visual tests, run the following command:

   ```bash
   npm run test:visual
   ```

   or

   ```bash
   npm run start
   ```

   You can also run all tests using the following command:

   ```bash
    npm run test:all
   ```

   Running the tests ensures that your changes do not introduce any regressions and adhere to the project's quality standards.

### Contributing

When you are ready to contribute your changes or new features, please follow these steps:

1. **Create a Branch**: Create a new branch for your changes. This will help you keep your changes isolated from the main branch.

   ```bash
   git checkout -b my-new-feature
   ```

2. **Development**: Make your desired changes to the codebase. Write clean, concise, tested and well-documented code following the project's coding conventions and guidelines.

3. **Commit Changes**: Commit your changes to the branch. Please ensure that you follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) format for your commit messages.

   ```bash
    git commit -m "feat: add new feature"
   ```

   Please note that the commit message format is important as it is used to generate the changelog.

4. **Push Changes**: Push your changes to the remote repository.

   ```bash
    git push origin my-new-feature
   ```

5. **Create Pull Request**: Open a pull request (PR) from your branch to the main branch of the main Puppeteer UI TestKit repository. Provide a clear and descriptive title and description for your PR, explaining the changes you have made and their purpose.

Once your PR is submitted, the maintainers of Puppeteer UI TestKit will review your changes. They may provide feedback, request modifications, or discuss any necessary adjustments. Once the changes are reviewed and approved, they will be merged into the main repository.

Thank you for your contribution! Your efforts are appreciated, and they help make Puppeteer UI TestKit better for everyone.
