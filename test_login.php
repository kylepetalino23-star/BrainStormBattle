<?php
$host = 'localhost';
$dbname = 'game_db';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

$stmt = $conn->prepare("UPDATE users SET is_online = 1 WHERE student_id = '240325'");
if ($stmt->execute()) {
    echo "SUCCESS! Rows affected: " . $stmt->affected_rows;
} else {
    echo "ERROR: " . $stmt->error;
}
$stmt->close();
$conn->close();
?>