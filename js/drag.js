import { getTasks } from "./data-access.js";
import { saveTask } from "./data-access.js";
import { handlePriorities } from "./crud.js";
import { refreshCounts } from "./crud.js";

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
        task.priority += (2*Math.trunc(shiftY / 70))+Math.sign(shiftY);

        // DOM
        const draggedCard = document.querySelector(`[data-id="${task.id}"]`);
        const list = task.list === "todo" ? todo : task.list === "doing" ? doing : done;
        const cards = [...list.querySelectorAll(".card")].filter(card => card !== draggedCard);
        let newIndex = task.priority - 1;

        if (newIndex <= 0) {newIndex = 0};

        const referenceCard = cards[newIndex];
        if (referenceCard) {
            list.insertBefore(draggedCard, referenceCard);
        } else {
            list.append(draggedCard);
        }
    }

    // Avec shift horizontal
    else {

        // Serveur
        if (task.list === "todo") {
            if (shiftX > 400) {
                task.list = "done";
            }
            else {
                task.list = "doing";
            }
        }
        else if (task.list === "doing") {
            if (shiftX > 200) {
                task.list = "done";
            }
            else {
                task.list = "todo";
            }
        }
        else {
            if (shiftX < -400) {
                task.list = "todo";
            }
            else {
                task.list = "doing";
            }
        }

        task.priority += 2*Math.trunc(shiftY / 70)+Math.sign(shiftY);

        // DOM
        const draggedCard = document.querySelector(`[data-id="${task.id}"]`);
        const newList = task.list === "todo" ? todo : task.list === "doing" ? doing : done;
        const cards = [...newList.querySelectorAll(".card")].filter(card => card !== draggedCard);
        let newIndex = task.priority - 1;

        if (newIndex <= 0) {newIndex = 0}

        const referenceCard = cards[newIndex];
        if (referenceCard) {
            newList.insertBefore(draggedCard, referenceCard);
        } else {
            newList.append(draggedCard);
        }
    }    
    console.log(task.priority);
    refreshCounts();
    saveTask(task)
    .then(() => handlePriorities());
}


