const STORAGE_KEY = "task-manager.tasks";

let tasks = loadTasks();
let currentFilter = "all";
let editingId = null;

const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const priorityInput = document.getElementById("priority-input");
const dueInput = document.getElementById("due-input");
const list = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const itemsLeft = document.getElementById("items-left");
const clearBtn = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter");
const progressLabel = document.getElementById("progress-label");
const progressPercent = document.getElementById("progress-percent");
const progressFill = document.getElementById("progress-fill");

/* ---------- Storage ---------- */
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Could not read saved tasks:", err);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error("Could not save tasks:", err);
  }
}

/* ---------- Helpers ---------- */
function todayString() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ---------- Actions ---------- */
function addTask(title, priority, due) {
  tasks.unshift({
    id: Date.now().toString(),
    title,
    priority,
    due,
    completed: false,
  });
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.completed = !task.completed;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

function updateTitle(id, newTitle) {
  const title = newTitle.trim();
  const task = tasks.find((t) => t.id === id);
  if (task && title) task.title = title;
  editingId = null;
  saveTasks();
  render();
}

/* ---------- Rendering ---------- */
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = `task ${task.priority}${task.completed ? " done" : ""}`;
  li.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.dataset.action = "toggle";
  checkbox.setAttribute("aria-label", "Mark task complete");

  const body = document.createElement("div");
  body.className = "task-body";

  if (task.id === editingId) {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = task.title;
    editInput.maxLength = 120;
    editInput.dataset.action = "edit-input";
    body.appendChild(editInput);
    setTimeout(() => editInput.focus(), 0);
  } else {
    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.title;
    body.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "task-meta";
    let text = `${task.priority} priority`;
    if (task.due) {
      text += ` · due ${formatDate(task.due)}`;
      if (!task.completed && task.due < todayString()) {
        meta.classList.add("overdue");
        text += " (overdue)";
      }
    }
    meta.textContent = text;
    body.appendChild(meta);
  }

  const actions = document.createElement("div");
  actions.className = "task-actions";

  if (task.id === editingId) {
    actions.append(
      makeButton("Save", "save"),
      makeButton("Cancel", "cancel")
    );
  } else {
    actions.append(
      makeButton("Edit", "edit"),
      makeButton("Delete", "delete", "delete")
    );
  }

  li.append(checkbox, body, actions);
  return li;
}

function makeButton(label, action, extraClass = "") {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `icon-btn ${extraClass}`.trim();
  btn.textContent = label;
  btn.dataset.action = action;
  return btn;
}

function render() {
  const visible = tasks.filter((t) => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });

  list.innerHTML = "";
  visible.forEach((t) => list.appendChild(createTaskElement(t)));
  emptyState.hidden = visible.length > 0;

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const left = total - done;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  itemsLeft.textContent = `${left} ${left === 1 ? "task" : "tasks"} left`;
  progressLabel.textContent = `${done} of ${total} done`;
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
  clearBtn.hidden = done === 0;

  filterButtons.forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.filter === currentFilter)
  );
}

/* ---------- Events ---------- */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  addTask(title, priorityInput.value, dueInput.value);
  taskInput.value = "";
  dueInput.value = "";
  taskInput.focus();
});

list.addEventListener("click", (e) => {
  const target = e.target.closest("[data-action]");
  if (!target) return;
  const li = target.closest(".task");
  const id = li.dataset.id;

  switch (target.dataset.action) {
    case "toggle":
      toggleTask(id);
      break;
    case "delete":
      deleteTask(id);
      break;
    case "edit":
      editingId = id;
      render();
      break;
    case "cancel":
      editingId = null;
      render();
      break;
    case "save":
      updateTitle(id, li.querySelector(".edit-input").value);
      break;
  }
});

list.addEventListener("keydown", (e) => {
  if (!e.target.classList.contains("edit-input")) return;
  const id = e.target.closest(".task").dataset.id;
  if (e.key === "Enter") updateTitle(id, e.target.value);
  if (e.key === "Escape") {
    editingId = null;
    render();
  }
});

filterButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    render();
  })
);

clearBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  render();
});

render();
