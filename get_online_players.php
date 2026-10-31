<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

date_default_timezone_set('Asia/Manila');
include 'db_connect.php';

// ===== AUTO-OFFLINE: Kung ang last_active ay mas luma sa 30 seconds, ituring na offline =====
$conn->query("
    UPDATE users 
    SET is_online = 0 
    WHERE role='player' 
    AND is_online = 1 
    AND last_active < DATE_SUB(NOW(), INTERVAL 30 SECOND)
");

// ===== Get online count =====
$result = $conn->query("SELECT COUNT(*) as total FROM users WHERE role='player' AND is_online = 1");
$onlineCount = $result->fetch_assoc()['total'];

// ===== Get all players with status =====
$playersResult = $conn->query("
    SELECT id, full_name, student_id, is_online, last_active,
           TIMESTAMPDIFF(SECOND, last_active, NOW()) as seconds_ago
    FROM users 
    WHERE role='player' 
    ORDER BY is_online DESC, last_active DESC
");

$players = [];
while ($row = $playersResult->fetch_assoc()) {
    $players[] = [
        'id' => (int)$row['id'],
        'name' => $row['full_name'],
        'student_id' => $row['student_id'],
        'is_online' => (int)$row['is_online'],
        'last_active' => $row['last_active'],
        'seconds_ago' => (int)$row['seconds_ago']
    ];
}

echo json_encode([
    'success' => true,
    'online_count' => (int)$onlineCount,
    'total_players' => count($players),
    'players' => $players
]);

$conn->close();
?>