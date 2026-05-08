const API_URL = "http://localhost:3000";

export async function getTasks() {
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();
    return data;
}


export function addTaskServer(task) {
    try {
        fetch(`${API_URL}/tasks`, {
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

}

export function saveTasks(task) {
    try {
        fetch(`${API_URL}/todos/${todo.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todo)
        });
    }
    catch {
        console.log("Erreur. Nous n'avons pas pu sauvegarder les données.");
    }
}
