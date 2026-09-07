Todo List app

This repository contains a small single-page Todo List application built with plain HTML, CSS, and JavaScript.

Features
- Add tasks via the input and Add button (or press Enter).
- Mark tasks completed/uncompleted with the checkbox.
- Edit tasks inline (double-click text or press Edit button).
- Delete tasks.
- Filter tasks: All / Active / Completed.
- Clear all completed tasks.
- Tasks are persisted in localStorage so they remain after page reloads.
- Basic accessibility and responsive layout.

Files
- index.html — app HTML markup.
- styles.css — app styles.
- script.js — application logic and localStorage persistence.
- README.md — this file.

localStorage
The app uses the key `todo.tasks.v1` in localStorage to save the list of tasks as a JSON array. Structure of each task:

{
  "id": "unique-id",
  "text": "task description",
  "completed": false
}

Usage
1. Open index.html in a browser (or host via a static file server).
2. Add tasks using the input field and press Enter or click Add.
3. Use filters and task controls to manage your todo list.

Notes
- No build step or external dependencies.
- If you want a feature added (drag-and-drop, due dates, animations), open an issue or request a PR with the desired enhancement.
