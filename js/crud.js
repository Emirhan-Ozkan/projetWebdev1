import { getTasks } from "./data-access.js";
import { addTaskServer } from "./data-access.js";
import { removeTask } from "./data-access.js";
import { saveTask } from "./data-access.js";

let todo;
let doing;
let done;

const addTodo = document.querySelector("#addTodoBtn");
const addDoing = document.querySelector("#addDoingBtn");
const addDone = document.querySelector("#addDoneBtn");

const dialog = document.querySelector("#task-dialog");
let listConcerned = "";
let method = "";
let taskConcerned = {}

const saveBtn = document.querySelector("#task-dialog__save-btn");
const cancelBtn = document.querySelector("#task-dialog__cancel-btn")

const taskTitle = document.querySelector("#task-dialog__task-title");
const taskDesc = document.querySelector("#task-dialog__task-description");

export function initTasks() {

    todo = document.querySelector("#cards-todo");
    doing = document.querySelector("#cards-doing");
    done = document.querySelector("#cards-done");

    getTasks()
    .then(function(tasks){
        sortTasks(tasks, todo, "todo");
        sortTasks(tasks, doing, "doing");
        sortTasks(tasks, done, "done");
        refresh();
    })
    .catch(function(error){
        console.error("Erreur, nous n'avons pas pu récuperer les données !");
    })

    addTodo.addEventListener("click", () => {
        listConcerned = "todo";
        method = "create";
        dialog.showModal();
    });
    addDoing.addEventListener("click", () => {
        listConcerned = "doing";
        method = "create";
        dialog.showModal();
    });
    addDone.addEventListener("click", () => {
        listConcerned = "done";
        method = "create";
        dialog.showModal();
    });

    saveBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (method == "create") {
            createTask(listConcerned);
        }
        else {
            updateTask();
        }
        dialog.close();
    });
    cancelBtn.addEventListener("click", () => dialog.close());
}

function sortTasks(tasks, correspondingList, listName) {
    /* Seulement pour l'UI (ne change pas le back-end */
    tasks
        .filter(task => task.list === listName)
        .sort((a, b) => a.priority - b.priority)
        .map(task => correspondingList.append(addTask(task)));
}


function addTask(task) {
    const div = document.createElement("div");
    const titleP = document.createElement("p");
    const descP = document.createElement("p");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");

    titleP.textContent = task.title;
    descP.textContent = task.description;

    div.classList.add("task");
    div.classList.add("card");
    titleP.classList.add("todo__title");
    titleP.setAttribute("style", "font-weight:bold");
    descP.classList.add("todo__description");
    deleteButton.textContent = "Supprimer";
    editButton.textContent = "Modifier";

    div.appendChild(titleP);
    div.appendChild(descP);
    div.appendChild(deleteButton);
    div.appendChild(editButton);
    div.setAttribute("draggable", "true");
    deleteButton.addEventListener("click", () => deleteTask(task));
    editButton.addEventListener("click", () => {
        taskConcerned = task;
        method = "update";
        document.querySelector("#task-dialog__task-title").value = task.title;
        document.querySelector("#task-dialog__task-description").value = task.description;
        dialog.showModal();
    });
    return div;
}

function refresh() {
    let todoCount = document.querySelector("#count-todo");
    let doingCount = document.querySelector("#count-doing");
    let doneCount = document.querySelector("#count-done");

    todoCount.textContent = document.querySelector("#cards-todo").childElementCount;
    doingCount.textContent = document.querySelector("#cards-doing").childElementCount;
    doneCount.textContent = document.querySelector("#cards-done").childElementCount;
}

function createTask(listName) {
    let task = {};
    task.title = taskTitle.value;
    task.description = taskDesc.value;
    task.list = listName;

    /* Avoir la priorité égale à 1 + le nombre de tâches dans la liste, pour être sur qu'il apparait à la fin*/
    const countId = "#count-" + listName; /*pour avoir quelque chose comme #count-todo */
    const countElement = document.querySelector(countId);
    const nbTasks = Number(countElement.textContent);
    task.priority = nbTasks + 1;

    let correspondingList;
    switch (listName) {
        case "todo":    
            correspondingList = todo;
            break;
        case "doing":
            correspondingList = doing;
            break;
        case "done":
            correspondingList = done;
            break;
    }
    correspondingList.append(addTask(task));

    addTaskServer(task);

}

function deleteTask(task) {
    removeTask(task);
    refresh();
}

function updateTask() {
    taskConcerned.title = taskTitle.value;
    taskConcerned.description = taskDesc.value;
    saveTask(taskConcerned);
}