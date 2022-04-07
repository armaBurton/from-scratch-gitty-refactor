# Gitty: Refactored

## Getting Started

Use your [Gitty](https://github.com/alchemycodelab/backend-gitty) deliverable as a starting point.

### Learning Objectives

- Convert Promises from `async`/`await` to `.then`
- Use `Promise.all` to run multiple Promises in parallel

### Description

For this deliverable, you need to refactor out **all `async`/`await` keywords** in your Gitty deliverable with the equivalent `.then` approach. Any `await` that's wrapped in a `try`/`catch` block will need to be replaced with `.catch`.

If you mocked the `authenticate` middleware in your tests for Gitty, you'll need to replace that with a mock of `utils/github.js` instead.

You also need to add a new route: `GET /api/v1/quotes`. This route is a public route that gets quotes from three different sources:

- <https://programming-quotes-api.herokuapp.com/quotes/random>
- <https://futuramaapi.herokuapp.com/api/quotes/1>
- <https://api.quotable.io/random>

It then sends a response in the shape of:

- `[{ author: <author's name>, content: <quote> }]`

**This route should use `Promise.all` for fetching the quotes**

### Acceptance Criteria

- Code does not include any `async`/`await` keywords (excluding tests)
- `GET /api/v1/quotes` returns an array of quote objects from the three different APIs
- `/api/v1/quotes` uses `Promise.all` for fetching the quotes from the various sources
- `middleware/authenticate.js` is **not** mocked in any tests (mock `utils/github.js` instead)
- STRETCH: Convert tests to use `.then`

### Rubric

| Task                                                                                                   | Points |
| ------------------------------------------------------------------------------------------------------ | ------ |
| All [original criteria](https://alchemycodelab.github.io/backend-gitty/#acceptance-criteria) still met |    2   |
| No `async`/`await` keywords/only uses `.then()`                                                        |    3   |
| `GET /api/v1/quotes` added and uses `Promise.all`                                                      |    3   |
| `utils/github.js` mocked in tests (and `authenticate` middleware NOT mocked)                           |    2   |