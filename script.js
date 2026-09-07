// script.js - simple todo app with localStorage persistence
(() => {
  // localStorage key used to persist tasks
  const STORAGE_KEY = 'todo.tasks.v1';

  // DOM elements
  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const listEl = document.getElementById('task-list');
  const countEl = document.getElementById('count');
  const filters = document.querySelectorAll('.filter-btn');
  const clearCompletedBtn = document.getElementById('clear-completed');

  // app state
  let tasks = []; // { id, text, completed }
  let filter = 'all'; // all | active | completed

  // helpers
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : [];
    } catch (e) {
      tasks = [];
      console.error('Could not load tasks', e);
    }
  };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  // render
  function render() {
    // filter tasks
    const visible = tasks.filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    });

    // build list
    listEl.innerHTML = '';
    visible.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');
      li.dataset.id = task.id;

      // checkbox
      const cbWrap = document.createElement('label');
      cbWrap.className = 'checkbox';
      cbWrap.title = task.completed ? 'Mark as active' : 'Mark as completed';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = task.completed;
      cb.setAttribute('aria-label', 'Toggle task completed');
      const checkmark = document.createElement('span');
      checkmark.className = 'checkmark';
      checkmark.textContent = '✓';
      cbWrap.appendChild(cb);
      cbWrap.appendChild(checkmark);

      // text
      const textDiv = document.createElement('div');
      textDiv.className = 'text';
      textDiv.tabIndex = 0;
      textDiv.textContent = task.text;
      textDiv.title = 'Double-click or press Enter to edit';

      // controls
      const controls = document.createElement('div');
      controls.className = 'controls-inline';

      const editBtn = document.createElement('button');
      editBtn.className = 'icon-btn';
      editBtn.title = 'Edit';
      editBtn.textContent = '✎';

      const delBtn = document.createElement('button');
      delBtn.className = 'icon-btn';
      delBtn.title = 'Delete';
      delBtn.textContent = '🗑';

      controls.appendChild(editBtn);
      controls.appendChild(delBtn);

      li.appendChild(cbWrap);
      li.appendChild(textDiv);
      li.appendChild(controls);
      listEl.appendChild(li);

      // events
      cb.addEventListener('change', () => {
        toggleTask(task.id);
      });

      delBtn.addEventListener('click', () => {
        deleteTask(task.id);
      });

      const startEdit = () => {
        const input = document.createElement('input');
        input.className = 'edit-input';
        input.value = task.text;
        textDiv.replaceWith(input);
        input.focus();
        // save on blur or Enter, cancel on Escape
        const finish = (saveChanges) => {
          if (saveChanges) {
            const v = input.value.trim();
            if (v) updateTask(task.id, { text: v });
          }
          input.replaceWith(textDiv);
        };
        input.addEventListener('blur', () => finish(true));
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') finish(true);
          if (e.key === 'Escape') finish(false);
        });
      };

      editBtn.addEventListener('click', startEdit);
      textDiv.addEventListener('dblclick', startEdit);
      textDiv.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') startEdit();
      });
    });

    // update counts
    const remaining = tasks.filter(t => !t.completed).length;
    countEl.textContent = `${remaining} item${remaining !== 1 ? 's' : ''} left`;
  }

  // actions
  function addTask(text) {
    const t = { id: uid(), text, completed: false };
    tasks.unshift(t); // newest first
    save();
    render();
  }

  function updateTask(id, changes) {
    const i = tasks.findIndex(t => t.id === id);
    if (i === -1) return;
    tasks[i] = { ...tasks[i], ...changes };
    save();
    render();
  }

  function toggleTask(id) {
    const t = tasks.find(t => t.id === id);
    if (!t) return;
    t.completed = !t.completed;
    save();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  }

  function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    save();
    render();
  }

  // init
  function setFilter(f) {
    filter = f;
    filters.forEach(btn => {
      const fval = btn.dataset.filter;
      const active = fval === f;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    render();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    addTask(v);
    input.value = '';
    input.focus();
  });

  filters.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });

  clearCompletedBtn.addEventListener('click', clearCompleted);

  // keyboard accessibility: Enter on focused Add input already works via the form submit
  // load and initial render
  load();
  render();

  // expose for debugging (optional)
  window.todoApp = {
    get tasks() { return tasks; },
    addTask, updateTask, deleteTask, clearCompleted, setFilter
  };
})();
