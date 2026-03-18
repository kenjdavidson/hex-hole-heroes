# Contributing to Hex Hole Heroes

Thank you for your interest in contributing! Please read this guide before opening a pull request.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating you agree to abide by its terms.

## Development Setup

1. **Fork** the repository and clone your fork.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Run tests to confirm everything is working:
   ```bash
   npm test
   ```

## Making Changes

- Create a feature branch from `main`: `git checkout -b feat/your-feature`
- Follow the existing TypeScript and React patterns in `src/`.
- Add or update tests for any behaviour you change.
- Ensure all tests pass: `npm test`
- Ensure the project builds: `npm run build`

## Pull Request Guidelines

- Keep PRs focused on a single concern.
- Reference any related issues in the PR description.
- Provide a clear description of **what** changed and **why**.
- All CI checks (lint, test, build) must pass before merging.
- At least one maintainer review is required before merging.

## License Agreement

By submitting a pull request you agree that your contributions will be licensed under the [CC BY-NC 4.0](LICENSE) license that covers this project's source code.

> **Note:** The Hex Hole Heroes game design, rules, and name are proprietary and are **not** covered by the open-source license.
