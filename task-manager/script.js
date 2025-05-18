const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Load tasks from localStorage on page load
window.addEventListener("DOMContentLoaded", loadTasks);

// Add Task
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const task = { text: taskText, completed: false };
  addTaskToDOM(task);
  saveTaskToLocalStorage(task);

  taskInput.value = "";
});

// Add task to DOM
function addTaskToDOM(task) {
  const li = document.createElement("li");

  const taskTextSpan = document.createElement("span");
  taskTextSpan.textContent = task.text;
  taskTextSpan.classList.add("task-text");
  li.appendChild(taskTextSpan);

  if (task.completed) {
    li.classList.add("completed");
  }

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "✔️";
  completeBtn.classList.add("complete");

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.classList.add("delete");

  const btnContainer = document.createElement("span");
  btnContainer.classList.add("actions");
  btnContainer.appendChild(completeBtn);
  btnContainer.appendChild(deleteBtn);

  li.appendChild(btnContainer);
  taskList.appendChild(li);

  


  // Complete task
  completeBtn.addEventListener("click", () => {
    li.classList.toggle("completed");
    updateTaskStatus(task.text, li.classList.contains("completed"));
  });

  // Delete task
  deleteBtn.addEventListener("click", () => {
    li.remove();
    deleteTaskFromLocalStorage(task.text);
  });

  // Edit task on double click
  taskTextSpan.addEventListener("dblclick", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;
    input.className = "edit-input";

    li.replaceChild(input, taskTextSpan);
    input.focus();

    input.addEventListener("blur", () => {
      const newText = input.value.trim();
      if (newText && newText !== task.text) {
        updateTaskText(task.text, newText);
        task.text = newText;
        taskTextSpan.textContent = newText;
      }
      li.replaceChild(taskTextSpan, input);
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        input.blur();
      }
    });
  });
}

// Save task to localStorage
function saveTaskToLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => addTaskToDOM(task));
}

// Update task completion status in localStorage
function updateTaskStatus(text, completed) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updated = tasks.map(task =>
    task.text === text ? { ...task, completed } : task
  );
  localStorage.setItem("tasks", JSON.stringify(updated));
}

// Delete task from localStorage
function deleteTaskFromLocalStorage(text) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const filtered = tasks.filter(task => task.text !== text);
  localStorage.setItem("tasks", JSON.stringify(filtered));
}

// Update task text in localStorage
function updateTaskText(oldText, newText) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updated = tasks.map(task =>
    task.text === oldText ? { ...task, text: newText } : task
  );
  localStorage.setItem("tasks", JSON.stringify(updated));
}
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const listItems = document.querySelectorAll("#taskList li");

  listItems.forEach(li => {
    const text = li.querySelector(".task-text").textContent.toLowerCase();
    li.style.display = text.includes(searchTerm) ? "flex" : "none";
  });
});
const clearAllBtn = document.getElementById("clearAllBtn");

clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    localStorage.removeItem("tasks");
    taskList.innerHTML = "";
  }
});
