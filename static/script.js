// Fonction pour charger toutes les tâches depuis le backend
function loadTasks() {
    fetch('../backend/load_tasks.php')
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = ''; // Vide la liste actuelle

            data.forEach(task => {
                const li = document.createElement('li');

                // Case à cocher
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = task.status == 1;
                checkbox.classList.add('task-checkbox');
                checkbox.dataset.id = task.id;

                // Description de la tâche
                const span = document.createElement('span');
                span.textContent = task.description;
                if (task.status == 1) {
                    span.style.textDecoration = 'line-through';
                    span.style.color = 'gray';
                }

                // Bouton supprimer
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Supprimer';
                deleteBtn.className = 'delete-button';
                deleteBtn.dataset.id = task.id;

                // Ajout à la liste
                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(deleteBtn);
                taskList.appendChild(li);
            });
        })
        .catch(error => console.error("Erreur lors du chargement des tâches :", error));
}

// Gestion de l’ajout d’une tâche
document.getElementById("task-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const taskInput = this.task;
    const taskDescription = taskInput.value.trim();
    if (taskDescription === "") return;

    const submitButton = this.querySelector("button");
    submitButton.disabled = true;

    fetch("http://localhost:8080/ToDoListApp/backend/index.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `task=${encodeURIComponent(taskDescription)}`,
    })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            loadTasks(); // Recharge les tâches avec bouton et checkbox
            taskInput.value = "";
        })
        .catch(error => console.error("Erreur lors de l'ajout :", error))
        .finally(() => {
            submitButton.disabled = false;
        });
});

// Gestion de la suppression d’une tâche
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
        const taskId = event.target.dataset.id;

        fetch("http://localhost:8080/ToDoListApp/backend/index.php", {
            method: "POST",
            body: new URLSearchParams({ delete_task_id: taskId }),
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            loadTasks();
        })
        .catch(error => console.error("Erreur lors de la suppression :", error));
    }
});

// Gestion du changement de statut (complétée ou non)
document.addEventListener("change", function (event) {
    if (event.target.classList.contains("task-checkbox")) {
        const taskId = event.target.dataset.id;
        const status = event.target.checked;

        fetch('../backend/update_status.php', {
            method: 'POST',
            body: new URLSearchParams({
                task_id: taskId,
                status: status
            })
        })
        .then(res => res.text())
        .then(data => {
            console.log(data);
            loadTasks();
        });
    }
});

// Chargement automatique au démarrage
document.addEventListener("DOMContentLoaded", loadTasks);
