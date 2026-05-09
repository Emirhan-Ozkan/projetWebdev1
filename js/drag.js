import { getTasks } from "./data-access.js";
import { saveTask } from "./data-access.js";
import { handlePriorities } from "./crud.js";

const API_URL = "http://localhost:3000";

let todo = document.querySelector("#cards-todo");
let doing = document.querySelector("#cards-doing");
let done = document.querySelector("#cards-done");

let isDragging = false;

let draggedElementID = null;
let task = null;

let shiftX = 0;
let startX = 0;

let shiftY = 0;
let startY = 0;

export function initDraggable() {
    const todoList = document.querySelector("#col-todo");
    const doingList = document.querySelector("#col-doing");
    const doneList = document.querySelector("#col-done");

    todoList.classList.add("draggable");
    doingList.classList.add("draggable");
    doneList.classList.add("draggable");

    todoList.addEventListener('dragstart', handleDragStart);
    todoList.addEventListener('dragover', handleDragOver);
    todoList.addEventListener('dragend', () => handleDragEnd());

    doingList.addEventListener('dragstart', handleDragStart);
    doingList.addEventListener('dragover', handleDragOver);
    doingList.addEventListener('dragend', () => handleDragEnd());

    doneList.addEventListener('dragstart', handleDragStart);
    doneList.addEventListener('dragover', handleDragOver);
    doneList.addEventListener('dragend', () => handleDragEnd());

}

function handleDragStart(e) {
    console.debug('drag start', e);
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    draggedElementID = e.target.getAttribute("data-id");
    console.log(e.target);

    /* stocker l'objet concerné */
    fetch(`${API_URL}/tasks/${draggedElementID}`)
    .then(response => response.json())
    .then(correspondingTask => {
        task = correspondingTask;
    });
    
}

function handleDragOver(e) {
    console.debug('drag over', e);
    shiftX = e.clientX - startX;
    shiftY = e.clientY - startY;
    console.debug(shiftX, shiftY);
}

function handleDragEnd(e) {
    isDragging = false;

    console.log(task.priority);

    // Cas où le shift est seulement vertical
    if (Math.abs(shiftX) <= 200) {

        // Serveur
        task.priority += Math.trunc(shiftY / 70);

        // DOM
        const list = task.list === "todo" ? todo : task.list === "doing" ? doing : done;
        const cards = [...list.querySelectorAll(".card")];
        const draggedCard = document.querySelector(`[data-id="${task.id}"]`);
        let newIndex = task.priority + Math.trunc(shiftY / 70) - 1;

        if (newIndex <= 0) {newIndex = 0};
        const referenceCard = cards[newIndex];
        if (referenceCard) {
            list.insertBefore(draggedCard, referenceCard);
        } else {
            list.append(draggedCard);
        }
    }

    console.log(task.priority);
    saveTask(task)
    .then(() => handlePriorities());
}


