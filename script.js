class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        const taskInput = document.getElementById('taskInput');
        const addBtn = document.getElementById('addBtn');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const clearCompleted = document.getElementById('clearCompleted');

        addBtn.addEventListener('click', () => this.addTask());
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        clearCompleted.addEventListener('click', () => this.clearCompleted());
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const text = input.value.trim();
        
        if (!text) return;

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        input.value = '';
        this.saveAndRender();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveAndRender();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveAndRender();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(t => !t.completed);
        this.saveAndRender();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'pending': return this.tasks.filter(t => !t.completed);
            case 'completed': return this.tasks.filter(t => t.completed);
            default: return this.tasks;
        }
    }

    render() {
        const taskList = document.getElementById('taskList');
        const taskCount = document.getElementById('taskCount');
        const filteredTasks = this.getFilteredTasks();

        taskList.innerHTML = filteredTasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="task-checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       onchange="app.toggleTask(${task.id})">
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <button class="delete-btn" onclick="app.deleteTask(${task.id})">Delete</button>
            </li>
        `).join('');

        const pendingCount = this.tasks.filter(t => !t.completed).length;
        taskCount.textContent = `${pendingCount} task${pendingCount !== 1 ? 's' : ''} remaining`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.render();
    }
}

// Initialize the app
const app = new TodoApp();