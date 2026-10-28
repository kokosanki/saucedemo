# Sauce Demo – Playwright test automation

[![Playwright Tests](https://github.com/kokosanki/saucedemo/actions/workflows/playwright.yml/badge.svg)](https://github.com/kokosanki/saucedemo/actions/workflows/playwright.yml)

End-to-end tests for [Sauce Demo](https://www.saucedemo.com), a demo shop made for practising test automation. I'm a frontend developer moving into QA, and this is where I learn and show how I work.

**Stack:** Playwright · TypeScript · GitHub Actions

## Approach

- **Page Object Model** – locators and page actions live in `pages/`
- **Test data kept outside the tests** – in `data/`
- **Independent tests** – each one logs in itself, so they can run in parallel
- **Results of every run** – see the [Actions tab](https://github.com/kokosanki/saucedemo/actions): each run has a per-test summary and a downloadable HTML report

The test files are in `tests/`, and test names describe the expected behaviour.

## Run it

```bash
npm ci
npx playwright install --with-deps
cp .env.example .env    # fill in the values
npm test
```

The credentials are the public demo ones shown on the [Sauce Demo login page](https://www.saucedemo.com). Other commands (UI mode, debug, report, typecheck) are in the `scripts` section of `package.json`.
