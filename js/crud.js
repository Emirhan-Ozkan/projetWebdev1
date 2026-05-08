import { getTasks } from "./data-access.js";

let todo;
let doing;
let done;

export function initTasks() {

    todo = document.querySelector("#cards-todo");
    doing = document.querySelector("#cards-doing");
    done = document.querySelector("#cards-done");

    getTasks()
    .then(function(tasks){
        sortTasks(tasks, todo, "todo");
        sortTasks(tasks, doing, "doing");
        sortTasks(tasks, done, "done");
    })
    .catch(function(error){
        console.error("Erreur, nous n'avons pas pu récuperer les données !");
    })
}

function sortTasks(tasks, correspondingList, listName) {
    /* Seulement pour l'UI (ne change pas le back-end */
    tasks.map(task => {
        if (task.list === listName) {
            correspondingList.append(addTask(task, tasks));
        }
    })
}

function addTask(task, tasks) {
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
    div.setAttribute("draggable", "true")
    /*doneButton.addEventListener("click", () => changeTodoStatus(todo, li, doneButton, todos)) */
    return div;
}
