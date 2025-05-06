<?php
$host = 'localhost';
$dbname = 'ToDoListApp';
$username = 'root'; 
$password = ''; 

// Connexion à la base de données
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

// Traitement de la requête POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['task'])) {
    $description = trim($_POST['task']);
    if (!empty($description)) {
        $stmt = $pdo->prepare("INSERT INTO tasks (description) VALUES (:description)");
        $stmt->bindParam(':description', $description);
        $stmt->execute();
        echo "Tâche ajoutée avec succès.";
    } else {
        echo "La tâche ne peut pas être vide.";
    }
} else {
    echo "Requête invalide.";
}
// Traitement de la requête delete
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_task_id'])) {
    $taskId = (int) $_POST['delete_task_id'];
    $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = :id");
    $stmt->bindParam(':id', $taskId);
    $stmt->execute();
    echo "Tâche supprimée avec succès.";
    exit;
}
?>
