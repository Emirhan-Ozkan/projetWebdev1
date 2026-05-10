import { getTasks } from "./data-access.js";
import { addTaskServer } from "./data-access.js";
import { removeTask } from "./data-access.js";
import { saveTask } from "./data-access.js";
import { refreshListeners } from "./drag.js";


const API_URL = "http://localhost:3000";

// les listes
let todo = document.querySelector("#cards-todo");
let doing = document.querySelector("#cards-doing");
let done = document.querySelector("#cards-done");

// les boutons ajouter
const addTodo = document.querySelector("#addTodoBtn");
const addDoing = document.querySelector("#addDoingBtn");
const addDone = document.querySelector("#addDoneBtn");

// tout ce qui concerne le dialogue
const dialog = document.querySelector("#task-dialog");
let listConcerned = "";
let method = "";
let taskConcerned = {}
const saveBtn = document.querySelector("#task-dialog__save-btn");
const cancelBtn = document.querySelector("#task-dialog__cancel-btn")
const taskTitle = document.querySelector("#task-dialog__task-title");
const taskDesc = document.querySelector("#task-dialog__task-description");

export function initTasks() {

    // récupérer les tâches du serveur
    getTasks()
    .then(function(tasks){
        // les ajouter dans le DOM
        sortTasks(tasks, todo, "todo");
        sortTasks(tasks, doing, "doing");
        sortTasks(tasks, done, "done");
        refreshCounts();
    })
    .catch(function(error){
        console.error("Erreur, nous n'avons pas pu récuperer les données !", error);
    })

    // harmoniser les priorités
    handlePriorities();

    addTodo.addEventListener("click", () => {
        listConcerned = "todo";
        method = "create";
        taskTitle.value = "";
        taskDesc.value = "";
        dialog.showModal();
    });
    addDoing.addEventListener("click", () => {
        listConcerned = "doing";
        method = "create";
        taskTitle.value = "";
        taskDesc.value = "";
        dialog.showModal();
    });
    addDone.addEventListener("click", () => {
        listConcerned = "done";
        method = "create";
        taskTitle.value = "";
        taskDesc.value = "";
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
    // DOM uniquement
    tasks
        // l'ajoute dans la bonne liste
        .filter(task => task.list === listName)

        // trie par priorité croissant
        .sort((a, b) => a.priority - b.priority)

        // les ajoute dans le DOM
        .map(task => correspondingList.append(addTask(task)));
}


function addTask(task) {
    // prend task (objet de la database) et renvoie un div (élément du DOM)
    const div = document.createElement("div");
    const titleP = document.createElement("p");
    const descP = document.createElement("p");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");

    titleP.textContent = task.title;
    descP.textContent = task.description;

    div.classList.add("task");
    div.classList.add("card");
    titleP.classList.add("task-title");
    titleP.setAttribute("style", "font-weight:bold");
    descP.classList.add("task-description");
    deleteButton.textContent = "Supprimer";
    editButton.textContent = "Modifier";

    div.appendChild(titleP);
    div.appendChild(descP);
    div.appendChild(deleteButton);
    div.appendChild(editButton);
    div.setAttribute("draggable", "true");
    deleteButton.addEventListener("click", () => deleteTask(task));
    editButton.addEventListener("click", () => {
        // pour pas que modifier une tâche le renvoie dans une version ultérieure (comme par exemple avant de l'avoir changé de liste)
        fetch(`${API_URL}/tasks/${task.id}`)
        .then(response => response.json())
        .then(freshTask => {
            taskConcerned = freshTask;
            taskTitle.value = freshTask.title;
            taskDesc.value = freshTask.description;
        });
        method = "update";
        document.querySelector("#task-dialog__task-title").value = task.title;
        document.querySelector("#task-dialog__task-description").value = task.description;
        dialog.showModal();
    });

    console.log(task.id);
    div.setAttribute("data-id", task.id);
    return div;
}

export function refreshCounts() {
    // rafraichir les compteurs de tache dans les colonnes
    let todoCount = document.querySelector("#count-todo");
    let doingCount = document.querySelector("#count-doing");
    let doneCount = document.querySelector("#count-done");

    todoCount.textContent = document.querySelector("#cards-todo").childElementCount;
    doingCount.textContent = document.querySelector("#cards-doing").childElementCount;
    doneCount.textContent = document.querySelector("#cards-done").childElementCount;
}

function createTask(listName) {
    // crée une tache (objet du database) de toute pièce avec les champs du dialogue données par l'utilisateur
    let task = {};
    task.title = taskTitle.value;
    task.description = taskDesc.value;
    task.list = listName;

    // Avoir la priorité égale à 1 + le nombre de tâches dans la liste, pour être sur qu'il apparait à la fin
    const countId = "#count-" + listName; // pour avoir quelque chose comme #count-todo 
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
    
    // pour éviter de donner un data-id de undefined pour l'élément du DOM qui correspond à la tâche
    addTaskServer(task)
    .then(response => response.json())
    .then(createdTask => {
        correspondingList.append(addTask(createdTask));
        refreshCounts();
        refreshListeners();
        handlePriorities();
    });
}

function deleteTask(task) {
    
    // DOM
    const card = document.querySelector(`[data-id="${task.id}"]`);
    card.remove();

    // Serveur
    removeTask(task)
    .then(() => {
        refreshCounts();
        handlePriorities();
    });
    
}

function updateTask() {
    // DOM
    const card = document.querySelector(`[data-id="${taskConcerned.id}"]`);
    card.querySelector(".task-title").textContent = taskTitle.value;
    card.querySelector(".task-description").textContent = taskDesc.value;

    // Serveur
    taskConcerned.title = taskTitle.value;
    taskConcerned.description = taskDesc.value;

    saveTask(taskConcerned);
    refreshCounts();
}

export async function handlePriorities() {
    // Réindexer les priorités de chaque colonne
    [todo, doing, done].forEach(list => {
        const cards = list.querySelectorAll(".card");
        cards.forEach((card, index) => {
            const id = card.getAttribute("data-id");
            fetch(`${API_URL}/tasks/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },

                // Dans chaque colonne, les priorités font 1, 3, 5, 7 et ainsi de suite
                // Cela permet de pouvoir mettre des tâches entre deux autres quand on le déplace
                body: JSON.stringify({ priority: (2*index) + 1 })
            });
        });
    }); 
}