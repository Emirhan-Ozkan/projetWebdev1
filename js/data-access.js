const API_URL = "http://localhost:3000";

export async function getTasks() {
    // récupérer les tâches
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();
    return data;
}


export async function addTaskServer(task) {
    // ajouter la tâche task dans le database
    try {
        return fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        });
    }
    catch {
        console.log("Erreur. Nous n'avons pas pu sauvegarder les données.");
    }
}

export function removeTask(task) {
    // supprimer la tâche task de la database
    return fetch(`${API_URL}/tasks/` + task.id, {
        method: "DELETE"
    })
    .catch(function(error) {
        console.error("Erreur, la tâche n'a pas pu être supprimée !", error);
    });
}

export function saveTask(task) {
    // sauvegarder la tâche task dans la database
    try {
        return fetch(`${API_URL}/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        });
    }
    catch {
        console.log("Erreur. Nous n'avons pas pu sauvegarder les données.");
    }
}


