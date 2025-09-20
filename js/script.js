const form = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const todoList = document.getElementById("todo-list");
const filter = document.getElementById("filter");
const canvas = document.getElementById("glitter");
const ctx = canvas.getContext("2d");

let tasks = [];
let particles = [];

// Resize canvas full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = {
    text: taskInput.value,
    date: dateInput.value,
    completed: false,
    id: Date.now()
  };
  tasks.push(task);
  renderTasks();
  form.reset();
});

// Render tasks
function renderTasks() {
  todoList.innerHTML = "";
  const filterValue = filter.value;

  tasks
    .filter(task => {
      if (filterValue === "active") return !task.completed;
      if (filterValue === "completed") return task.completed;
      return true;
    })
    .forEach(task => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `
        <span>${task.text} (${task.date})</span>
        <div>
          <button onclick="toggleTask(${task.id})">✅</button>
          <button onclick="deleteTask(${task.id})">❌</button>
        </div>
      `;
      todoList.appendChild(li);
    });
}

// Toggle task status
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  renderTasks();
  if (task.completed) triggerGlitter();
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

filter.addEventListener("change", renderTasks);

// Glitter effect
function triggerGlitter() {
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: 0,
      size: Math.random() * 5 + 2,
      speed: Math.random() * 3 + 1,
      color: `hsl(${Math.random() * 360}, 80%, 70%)`
    });
  }
}

function animateGlitter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, index) => {
    p.y += p.speed;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    if (p.y > canvas.height) particles.splice(index, 1);
  });
  requestAnimationFrame(animateGlitter);
}
animateGlitter();
