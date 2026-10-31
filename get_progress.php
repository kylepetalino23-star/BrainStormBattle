<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include 'db_connect.php';

$userId = $_GET['user_id'] ?? '';

if (empty($userId)) {
    echo json_encode(['success' => false, 'message' => 'User ID required']);
    exit;
}

$stmt = $conn->prepare("SELECT current_stage, lives, score FROM game_progress WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        'success' => true,
        'progress' => [
            'current_stage' => (int)$row['current_stage'],
            'lives' => (int)$row['lives'],
            'score' => (int)$row['score']
        ]
    ]);
} else {
    echo json_encode([
        'success' => true,
        'progress' => [
            'current_stage' => 1,
            'lives' => 3,
            'score' => 0
        ]
    ]);
}

$conn->close();
?>