# HydroSim

HydroSim is an interactive web application that helps students, engineers and technicians learn how to correctly install hydro-acoustic (under-water) monitoring stations.  The app combines concise textual guides, video tutorials, smooth in-page animations and an adaptive quiz engine so users can practise theoretical knowledge before heading into the field.

---

## Table of contents
1. [Features](#features)
2. [Project structure](#project-structure)
3. [Getting started](#getting-started)
   * [Prerequisites](#prerequisites)
   * [Installation](#installation)
   * [Running the app](#running-the-app)
4. [Testing](#testing)
5. [Scripts & useful commands](#scripts--useful-commands)
6. [Contributing](#contributing)
7. [License](#license)

---

## Features
* **Multi-tab interface** – switch seamlessly between theory, video materials and practice quizzes.
* **Client-side authentication** – simple registration/login backed by `localStorage` so visitors can save progress without a backend.
* **Quiz engine** – timer, progress bar, automatic scoring and animated feedback.
* **Smooth animations** – custom scroll easing & fade-in effects implemented in vanilla JS (`animations.js`).
* **100 % static** – no build step required; deploy the `index.html` directly to any static host (GitHub Pages, Netlify, S3…).
* **Automated tests**:
  * **Unit tests** with Jest + jsdom (coverage reports in `/coverage`).
  * **End-to-end tests** with Selenium WebDriver (see `selenium_tests.py`).

---

## Project structure
```
HydroSim/
├── index.html            # single-page application entry point
├── styles.css            # main stylesheet
├── script.js             # UI logic for tabs & quizzes
├── animations.js         # helper functions for scrolling / fade-ins
├── auth.js               # registration / login helpers
├── quiz.js               # richer quiz engine (timer + progress)
├── users.json            # sample seed data (not used in production)
├── selenium_tests.py     # E2E tests
├── coverage/             # Jest coverage reports (generated)
├── testing_protocol.md   # human-readable test protocol
├── package.json          # npm scripts & dev-dependencies (Jest, Selenium, Babel)
├── requirements.txt      # Python deps for Selenium tests
└── …
```

---

## Getting started

### Prerequisites <a name="prerequisites"></a>
* **Node.js** ≥ 14 (to run unit tests and manage JS dev tooling)
* **npm** (bundled with Node) or **yarn/pnpm**
* **Python 3.8+** (only if you plan to execute the Selenium test suite)
* **Google Chrome** + matching **chromedriver** (for Selenium)

### Installation <a name="installation"></a>
Clone the repo and install the JavaScript dev-dependencies:
```bash
# 1. Clone
$ git clone https://github.com/your-org/HydroSim.git
$ cd HydroSim

# 2. Install JS dependencies
$ npm install

# 3. (Optional) Prepare a Python venv for Selenium
$ python3 -m venv venv
$ source venv/bin/activate   # On Windows: venv\Scripts\activate
$ pip install -r requirements.txt
```

### Running the app <a name="running-the-app"></a>
Because HydroSim is a completely static site you have two quick options:
1. **Open `index.html` directly** – just double-click the file or drag it into your browser.
2. **Serve it locally** (recommended for same-origin policies):
   ```bash
   # using a tiny npm package
   npx http-server -p 8080 .
   # or with the built-in Python HTTP server
   python -m http.server 8080
   ```
   Then visit `http://localhost:8080` in your browser.

---

## Testing  <a name="testing"></a>

### Unit tests (Jest)
```bash
npm test              # runs Jest once and prints coverage summary
npm run test:watch    # re-runs tests on file changes
```
Coverage reports will be written to the `coverage/` directory; open `coverage/lcov-report/index.html` to view an interactive report.

### End-to-End tests (Selenium)
Ensure chromedriver is available on your `PATH` (the npm `chromedriver` package is already installed as a dev-dependency).
```bash
# activate the previously created venv first, if used
python selenium_tests.py
```
By default the test script points to a local path for `index.html`.  Update it if your project lives elsewhere or serve the app on `localhost` and change the URL accordingly.

---

## Scripts & useful commands
| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `npm test`           | Run Jest test suite                    |
| `npm run test:watch` | Launch Jest in watch mode              |
| `npm run coverage`   | *(implicit)* coverage report, part of `npm test` |
