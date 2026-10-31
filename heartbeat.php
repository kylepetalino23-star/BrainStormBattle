<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

date_default_timezone_set('Asia/Manila');
include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;

if ($user_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid user ID.']);
    exit;
}

// Update last_active = NOW
$stmt = $conn->prepare("UPDATE users SET last_active = NOW(), is_online = 1 WHERE id = ? AND role='player'");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->close();

echo json_encode(['success' => true, 'time' => date('Y-m-d H:i:s')]);
$conn->close();
?>