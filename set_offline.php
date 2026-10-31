<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;

if ($user_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid user ID.']);
    exit;
}

$stmt = $conn->prepare("UPDATE users SET is_online = 0 WHERE id = ? AND role='player'");
$stmt->bind_param("i", $user_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Player set to offline.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>