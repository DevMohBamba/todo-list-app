<?php
$host = 'localhost';
$dbname = 'ToDoListApp';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['task_id']) && isset($_POST['status'])) {
        $taskId = (int) $_POST['task_id'];
        $status = ($_POST['status'] === 'true') ? 1 : 0;

        $stmt = $pdo->prepare("UPDATE tasks SET status = :status WHERE id = :id");
        $stmt->execute(['status' => $status, 'id' => $taskId]);

        echo "Statut mis à jour.";
    } else {
        echo "Requête invalide.";
    }
} catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage();
}
?>
