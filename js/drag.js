import { getTasks } from "./data-access.js";
import { saveTask } from "./data-access.js";
import { handlePriorities } from "./crud.js";
import { refreshCounts } from "./crud.js";

const API_URL = "http://localhost:3000";

// pour que les removeEventListeners marchent bien
const dragEnd = () => handleDragEnd();

let todo = document.querySelector("#cards-todo");
let doing = document.querySelector("#cards-doing");
let done = document.querySelector("#cards-done");

// garder en mémoire les caractéristiques du drag
let isDragging = false;
let draggedElementID = null;
let task = null;
let shiftX = 0;
let startX = 0;
let shiftY = 0;
let startY = 0;

export function initDraggable() {
    // initialise les fonctions de drag pour chaque colonne
    const todoList = document.querySelector("#col-todo");
    const doingList = document.querySelector("#col-doing");
    const doneList = document.querySelector("#col-done");

    todoList.classList.add("draggable");
    doingList.classList.add("draggable");
    doneList.classList.add("draggable");

    todoList.addEventListener('dragstart', handleDragStart);
    todoList.addEventListener('dragover', handleDragOver);
    todoList.addEventListener('dragend', dragEnd);

    doingList.addEventListener('dragstart', handleDragStart);
    doingList.addEventListener('dragover', handleDragOver);
    doingList.addEventListener('dragend', dragEnd);

    doneList.addEventListener('dragstart', handleDragStart);
    doneList.addEventListener('dragover', handleDragOver);
    doneList.addEventListener('dragend', dragEnd);

}

export function handleDragStart(e) {
    // début du drag
    console.debug('drag start', e);
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    draggedElementID = e.target.getAttribute("data-id");
    console.log(e.target);

    // stocker l'objet concerné
    fetch(`${API_URL}/tasks/${draggedElementID}`)
    .then(response => response.json())
    .then(correspondingTask => {
        task = correspondingTask;
    });
    
}

export function handleDragOver(e) {
    // milieu du drag, on garde en tête combien de pixels on bouge
    console.debug('drag over', e);
    shiftX = e.clientX - startX;
    shiftY = e.clientY - startY;
    console.debug(shiftX, shiftY);
}

export function handleDragEnd(e) {
    // fin du drag, là où on change le serveur et le DOM
    isDragging = false;
    console.log(task.priority);

    // Cas où le shift est seulement vertical
    if (Math.abs(shiftX) <= 200) {

        // Serveur

        // quand on a 3 éléments dans une colonne de priorité 1, 3 et 5
        // et qu'on le bouge d'une tâche vers le bas
        // cette ligne met sa priorité à 4, entre les tâches de priorité 3 et 5
        // ceci est pour être sûr que l'on peut déplacer des tâches entre deux autres
        task.priority += (2*Math.trunc(shiftY / 70))+Math.sign(shiftY);

        // DOM

        // avoir l'élément du DOM qui correspond à la tâche
        const draggedCard = document.querySelector(`[data-id="${task.id}"]`);

        // avoir sa colonne correspondante
        const list = task.list === "todo" ? todo : task.list === "doing" ? doing : done;
        
        // avoir la liste des div dans cette liste (qui n'est pas l'élément qu'on déplace)
        const cards = [...list.querySelectorAll(".card")].filter(card => card !== draggedCard);
        
        // avoir l'index de ce div dans cette liste avec la priorité
        let newIndex = task.priority - 1;
        if (newIndex <= 0) {newIndex = 0};

        // l'insérer au bon endroit
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

        // trouver la liste correspondant avec le mouvement
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

        // même principe qu'avec seulement le shift vertical
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

export function refreshListeners() {
    // rafraichit les listeners de chaque colonne
    // ceci est pour le cas où l'on ajoute une tâche : cette tâche n'est pas concerné par le listener

    const todoList = document.querySelector("#col-todo");
    const doingList = document.querySelector("#col-doing");
    const doneList = document.querySelector("#col-done");

    todoList.removeEventListener('dragstart', handleDragStart);
    todoList.removeEventListener('dragover', handleDragOver);
    todoList.removeEventListener('dragend', dragEnd);

    doingList.removeEventListener('dragstart', handleDragStart);
    doingList.removeEventListener('dragover', handleDragOver);
    doingList.removeEventListener('dragend', dragEnd);

    doneList.removeEventListener('dragstart', handleDragStart);
    doneList.removeEventListener('dragover', handleDragOver);
    doneList.removeEventListener('dragend', dragEnd);

    todoList.addEventListener('dragstart', handleDragStart);
    todoList.addEventListener('dragover', handleDragOver);
    todoList.addEventListener('dragend', dragEnd);

    doingList.addEventListener('dragstart', handleDragStart);
    doingList.addEventListener('dragover', handleDragOver);
    doingList.addEventListener('dragend', dragEnd);

    doneList.addEventListener('dragstart', handleDragStart);
    doneList.addEventListener('dragover', handleDragOver);
    doneList.addEventListener('dragend', dragEnd);
}

