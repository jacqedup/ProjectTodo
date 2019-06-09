class Task {
    constructor(taskName, taskDescription, dueDate, priority, isComplete) {
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isComplete = isComplete;
    }
}

// object that holds project as key and task array as value
const projectMap = new Map();

const body = document.querySelector("body");
const addProjectForm = document.querySelector(".addProject");
const projectList = document.querySelector(".projectList");
const projectName = document.querySelector(".projectName");
const addTaskBtn = document.querySelector(".add-task-btn");
const taskList = document.querySelector(".taskList");
const addTaskForm = document.querySelector(".task-form");
const submitTaskBtn = document.querySelector(".submit-btn");
const cancelTaskBtn = document.querySelector(".cancel-btn");
const editTaskForm = document.querySelector(".edit-task-form");
const submitEditTaskBtn = document.querySelector(".edit-submit-btn");
const cancelEditTaskBtn = document.querySelector(".edit-cancel-btn");
let currentTaskToEdit;

const generateProject = (project) => {
    // li template to add a project to sidebar
    let html = `
        <li class="nav-item">
            <a class="nav-link d-flex justify-content-between align-items-center project" href="#">${project}<i class="far fa-trash-alt delete"></i></a>
        </li>
        `;
    // add li template to project list ul in sidebar
    projectList.innerHTML += html;
    // if li is first child of project list ul, add "active" class to anchor tag and display add task button
    let projectLinks = document.querySelectorAll(".project");
    if (projectLinks.length === 1) {
        projectLinks[0].classList.add("active");
        projectName.textContent = project;
        addTaskBtn.style.display = "block";
    }
    // add project to projectMap with empty tasks array
    projectMap.set(project, []);
};

// add active class to project in sidebar and display associated tasks in main display
const activeProject = (event) => {
    // deactivate previous active project
    deactivateProject();
    // add "active" class to project in sidebar
    event.target.classList.add("active");
    // display project name in main display
    projectName.textContent = event.target.textContent;
    // display tasks associated with current active project
    displayActiveProjectTasks();
};

// remove active class from project in sidebar
const deactivateProject = () => {
    let project = document.querySelector(".active");
    // remove previous active project
    project.classList.remove("active");    
};

const showAlert = (message, className) => {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".form-card-body");
    const form = document.querySelector(".task-form-title");
    container.insertBefore(div, form);
    // Remove alert in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
};

const addTaskToActiveProject = (task) => {
    // get the active project name
    let project = projectName.textContent; 
    // get the project's task array from the projectMap
    let taskArray = projectMap.get(project);
    // add task parameter to the beginning of task array for that project
    taskArray.unshift(task);
};

// clear new task form fields 
const clearFields = () => {
    document.getElementById("task-name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("due-date").value = "";
    document.getElementById("priority").value = "choose priority";
};

const displayActiveProjectTasks = () => {
    // get the active project name
    let project = projectName.textContent; 
    // get the project's task array from the projectMap
    let taskArray = projectMap.get(project);
    let taskHTML = ``;
    let taskIndex = 0;
    taskArray.forEach((task) => {
        let completedTaskClassName = "";
        if(task.isComplete === true){
            completedTaskClassName = "completed-task";
        }
        // task card template 
        taskHTML += `
            <div class="card mt-2 task-card task ${completedTaskClassName}">
                <div class="card-body row">
                    <div class="card-content col-md-11">
                        <h5 class="card-title">${task.taskName}</h5>
                        <p class="card-text">${task.taskDescription}</p>
                        <span class="card-text" style="padding-right: 50px"><small class="text-muted">Due Date: ${task.dueDate}</small></span>
                        <span class="card-text"><small class="text-muted">Priority: ${task.priority}</small></span>
                    </div>
                    <div class="col-md-1">
                        <i class="far fa-edit text-primary" style="padding-right: 5px;" onclick="editTask(${taskIndex})"></i>
                        <i class="far fa-trash-alt text-danger" style="padding-right: 5px;" onclick="deleteTask(${taskIndex})"></i>
                        <i class="far fa-check-circle text-success" onclick="completeTask(${taskIndex})"></i>
                    </div>
                </div> 
            </div> 
        `;
        taskIndex++;
    });
    // add task to taskList
    taskList.innerHTML = taskHTML;
    // show task list
    showTaskList();
};

const showTaskList = () => {
    taskList.style.display = "block";
};

const hideTaskList = () => {
    taskList.style.display = "none";
};

const closeTaskForm = () => {
    addTaskForm.style.display = "none";
    body.classList.remove("overlay");
};

// function called onclick in task card template
const editTask = (taskIndex) => {
    // get the active project name
    let project = projectName.textContent; 
    // get active project task array
    let taskArray = projectMap.get(project);
    // task to be editted
    currentTaskToEdit = taskArray[taskIndex];
    // hide task list
    hideTaskList();
    // display overlay
    body.classList.add("overlay");
    // set input values to task at task index
    document.getElementById("edit-task-name").value = `${currentTaskToEdit.taskName}`;
    document.getElementById("edit-description").value = `${currentTaskToEdit.taskDescription}`;
    document.getElementById("edit-due-date").value = `${currentTaskToEdit.dueDate}`;
    document.getElementById("edit-priority").value = `${currentTaskToEdit.priority}`;
    // display edit task form
    editTaskForm.style.display = "block";   
};

// function called onclick in task card template
const deleteTask = (taskIndex) => {
    // get the active project name
    let project = projectName.textContent; 
    // get active project task array
    let taskArray = projectMap.get(project);
    // remove task at task index
    taskArray.splice(taskIndex, 1);
    // regenerate task list HTML after delete
    displayActiveProjectTasks();
};

//function called onclick in task card template
const completeTask = (taskIndex) => {
    // get the active project name
    let project = projectName.textContent; 
    // get active project task array
    let taskArray = projectMap.get(project);
    let task = taskArray[taskIndex];
    task.isComplete = true;
    // put completed task to end of array
    let deletedTaskArray = taskArray.splice(taskIndex, 1);
    taskArray.push(deletedTaskArray[0]);
    // regenerate task list HTML after delete
    displayActiveProjectTasks();
};
// event to add project to sidebar
addProjectForm.addEventListener("submit", (event) => {
    // prevent actual submit
    event.preventDefault();
    // get the value from add project input field using name attribute
    let project = addProjectForm.addProject.value.trim();
    // check if user typed something in add project input field
    if (project.length) {
        // add project to sidebar
        generateProject(project);
        // reset input field after adding a project
        addProjectForm.reset();
    }
});

// event to make a project active or to delete a project
projectList.addEventListener("click", (event) => {
    let projectLinks = document.querySelectorAll(".project");
    // check if a project is clicked and add "active" class
    if (event.target.classList.contains("project")) {
        activeProject(event);
        addTaskBtn.style.display = "block";
    }

    // check if trashcan was clicked
    if (event.target.classList.contains("delete")) {
        // delete li associated with clicked trashcan
        if (event.target.parentElement.classList.contains("active") && projectLinks.length > 1) {
            event.target.parentElement.parentElement.remove();
            projectLinks[0].classList.add("active");
            projectName.textContent = projectLinks[0].textContent;
            displayActiveProjectTasks();
        } else {
            event.target.parentElement.parentElement.remove();
            // set h1 in main display to "Project Name" when there is no project in sidebar
            if (projectLinks.length === 1) {
                taskList.remove();
                projectName.textContent = "Project Name";
                addTaskBtn.style.display = "none";
            }
        }
        // remove project from projectMap
        projectMap.delete(event.target.textContent);
    }
});

// event to display task form
addTaskBtn.addEventListener("click", () => { 
    // hide task list
    hideTaskList();
    // display overlay
    body.classList.add("overlay");
    // display add task form
    addTaskForm.style.display = "block";    
});

// event to add a task
submitTaskBtn.addEventListener("click", (event) => {
    // prevent actual submit
    event.preventDefault();
    // get form values
    let taskName = document.getElementById("task-name").value;
    let taskDescription = document.getElementById("description").value;
    let dueDate = document.getElementById("due-date").value;
    let priority = document.getElementById("priority").value;
    // validate task form
    if (taskName === "" || taskDescription === ""|| dueDate === ""|| priority === "choose priority") {
        showAlert("Please fill in all fields", "danger");
    } else {
        // instantiate a task
        let task = new Task(taskName, taskDescription, dueDate, priority, false);
        // add task to active project
        addTaskToActiveProject(task);
        // clear task form fields
        clearFields();
        closeTaskForm();
        // regenerate task card HTML to include newly added task in main display
        displayActiveProjectTasks();
    }
});

// event to hide task form
cancelTaskBtn.addEventListener("click", () => {
    closeTaskForm();
    showTaskList();
});

// event to edit a task
submitEditTaskBtn.addEventListener("submit", (event) => {
    // prevent actual submit
    event.preventDefault();
    // get  edit form values
    let editTaskName = document.getElementById("edit-task-name").value;
    let editTaskDescription = document.getElementById("edit-description").value;
    let editDueDate = document.getElementById("edit-due-date").value;
    let editPriority = document.getElementById("edit-priority").value;
    // validate task form
    if (editTaskName === "" || editTaskDescription === ""|| editDueDate === ""|| editPriority === "choose priority") {
        showAlert("Please fill in all fields", "danger");
    } else {
        // update task properties
        currentTaskToEdit.taskName = editTaskName;
        currentTaskToEdit.taskDescription = editTaskDescription;
        currentTaskToEdit.dueDate = editDueDate;
        currentTaskToEdit.priority = editPriority;
        // close edit task form
        editTaskForm.style.display = "none";
        body.classList.remove("overlay");
        // regenerate task card HTML to include newly added task in main display
        displayActiveProjectTasks();
    }
});

// event to hide edit task form
cancelEditTaskBtn.addEventListener("click", () => {
    // close edit task form
    editTaskForm.style.display = "none";
    body.classList.remove("overlay");
    showTaskList();
});