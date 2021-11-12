const activityContainer = document.querySelector('[data-lists]');
const newActivityForm = document.querySelector('[data-new-activity-form]');
const newActivityInput = document.querySelector('[data-new-activity-input]');
const deleteActBtn = document.querySelector('[data-delete-activity-button]');
const taskDisplayContainer = document.querySelector('[data-task-display-container]');
const taskTitle = document.querySelector('[data-task-title]');
const taskCount = document.querySelector('[data-task-count]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')

const LOCAL_STORAGE_LIST_ITEM = 'task.activities'
const LOCAL_STORAGE_LIST_SELECTED_ITEM = 'task.selectedActivities'
let activities = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_ITEM)) || [];
let selectedActivity = localStorage.getItem
(LOCAL_STORAGE_LIST_SELECTED_ITEM)

activityContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedActivity = e.target.dataset.listId
        saveAndAdd();
    }
})

tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = activities.find(list => list.id === selectedActivity)
        const selectedTask = selectedList.tasks.find(task => task.id ===
        e.target.id)
        selectedTask.complete = e.target.checked
        save();
        taskCountdown(selectedList);
    }
})

deleteActBtn.addEventListener('click', e => {
    activities = activities.filter(list => list.id !== selectedActivity)
    selectedActivity = null
    saveAndAdd()
})

newActivityForm.addEventListener('submit', e => {
    e.preventDefault()
    const activityName = newActivityInput.value
    if (activityName == null || activityName === '') return 
    const activity = createActivity(activityName)
    newActivityInput.value = null
    activities.push(activity)
    saveAndAdd()
})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if (taskName == null || taskName === '') return 
    const taski = createTask(taskName)
    newTaskInput.value = null
    const selectedList = activities.find(list => list.id === selectedActivity);
    selectedList.tasks.push(taski);
    saveAndAdd()
})

function createActivity(name) {
    return { id: Date.now().toString(), name: name, tasks: []}
}

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndAdd() {
    save();
    addActivity();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_ITEM, JSON.stringify(activities));
    localStorage.setItem(LOCAL_STORAGE_LIST_SELECTED_ITEM, selectedActivity);
}

function addActivity() {
    removeActivity(activityContainer);
    addActivityTask()
    const selectedAct = activities.find(list => list.id === selectedActivity);
    if (selectedActivity == null) {
        taskDisplayContainer.style.display = 'none'
    } else {
        taskDisplayContainer.style.display = '';
        taskTitle.innerText = selectedAct.name;
        taskCountdown(selectedAct);
        removeActivity(tasksContainer);
        createTasks(selectedAct);
    }
};

function createTasks(selectedAct) {
    selectedAct.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true);
        const cBox = taskElement.querySelector('input');
        cBox.id = task.id;
        const label = taskElement.querySelector('label');
        label.htmlFor = task.id;
        label.append(task.name);
        tasksContainer.appendChild(taskElement);
    })
}

function taskCountdown(selectedAct) {
    const incompleteTasks = selectedAct.tasks.filter(task => 
        !task.complete).length;
        const taskString = incompleteTasks === 1 ? "task" : "tasks";
        taskCount.innerText = `${incompleteTasks} ${taskString} remaining`
}

function addActivityTask() {
    activities.forEach(list => {
        const activityItem = document.createElement("li")
        activityItem.dataset.listId = list.id
        activityItem.classList.add("o-item")
        activityItem.innerText = list.name
        if (list.id === selectedActivity) {
            activityItem.classList.add("eg-item")
        }
        activityContainer.appendChild(activityItem)
    })
}

function removeActivity(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
};

addActivity();