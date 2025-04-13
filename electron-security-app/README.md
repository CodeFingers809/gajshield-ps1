# electron-security-app

## Overview
This project is an Electron application designed for security purposes. It provides a user-friendly interface and robust functionality to enhance security measures.

## Project Structure
```
electron-security-app
├── src
│   ├── main
│   │   └── main.ts
│   ├── renderer
│   │   ├── index.html
│   │   └── index.ts
│   └── shared
│       └── types.ts
├── tests
│   └── main.spec.ts
├── .gitignore
├── electron-builder.json
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd electron-security-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```

## Usage
- The main process is defined in `src/main/main.ts`, which initializes the application.
- The renderer process is handled in `src/renderer/index.ts`, where user interactions are processed.
- Shared types can be found in `src/shared/types.ts` to ensure consistency across the application.

## Testing
Unit tests for the main process are located in `tests/main.spec.ts`. To run the tests, use:
```bash
npm test
```

## License
This project is licensed under the MIT License. See the LICENSE file for more details.