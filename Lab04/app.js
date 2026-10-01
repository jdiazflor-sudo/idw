const form = document.querySelector('#task-form');
const inputTitulo = document.querySelector('#input-titulo');
const inputCurso = document.querySelector('#input-curso');
const inputFecha = document.querySelector('#input-fecha');
const alertDiv = document.querySelector('#alert-container');
const list = document.querySelector('#task-list');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'todas'; // Estado inicial del filtro visual

function showAlert(message, type = 'danger') {
    alertDiv.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
    setTimeout(() => { alertDiv.innerHTML = ''; }, 4000);
}
function renderTasks() {
    list.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pendientes') return !task.completada;
        if (currentFilter === 'completadas') return task.completada;
        return true; 
    });

    if (filteredTasks.length === 0) {
        list.innerHTML = `<li class="list-group-item text-center text-muted">No hay tareas en esta categoría.</li>`;
        return;
    }

    filteredTasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completada ? 'list-group-item-success' : ''}`;

        li.innerHTML = `
            <div>
                <span class="${task.completada ? 'text-decoration-line-through text-muted' : ''}">
                    <strong>${task.titulo}</strong> [<em>${task.curso}</em>] - Vence: ${task.fechaEntrega}
                </span>
            </div>
            <div>
                <button class="btn btn-sm ${task.completada ? 'btn-secondary' : 'btn-success'} me-2" onclick="toggleTask(${task.id})">
                    ${task.completada ? 'Pendiente' : 'Completar'}
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Eliminar</button>
            </div>
        `;
        list.appendChild(li);
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const titulo = inputTitulo.value.trim();
    const curso = inputCurso.value.trim();
    const fechaEntrega = inputFecha.value;

    if (!titulo || !curso || !fechaEntrega) {
        showAlert('Error: Ningún campo debe estar vacío.');
        return;
    }

    const fechaActual = new Date().toISOString().split('T')[0];
    if (fechaEntrega <= fechaActual) {
        showAlert('Error: La fecha de entrega debe ser posterior a la fecha actual.');
        return;
    }

    const nuevaTarea = {
        id: Date.now(),
        titulo,
        curso,
        fechaEntrega,
        completada: false
    };

    tasks.push(nuevaTarea);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    form.reset();
    showAlert('¡Tarea agregada correctamente!', 'success');
    renderTasks();
});
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        renderTasks();
    });
});

function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completada: !task.completada } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

document.addEventListener('DOMContentLoaded', renderTasks);