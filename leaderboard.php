<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// ===== DATABASE CONNECTION =====
$host = 'localhost';
$dbname = 'game_db';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB Connection Failed: ' . $conn->connect_error]);
    exit;
}

try {
    // 1. Kunin ang top 10 players — MAY SCORE NA
    $stmt = $conn->prepare("
        SELECT u.full_name, u.student_id, u.current_stage, COALESCE(gp.score, 0) as score
        FROM users u
        LEFT JOIN game_progress gp ON u.id = gp.user_id
        WHERE u.role = 'player'
        ORDER BY score DESC, u.current_stage DESC, u.id ASC 
        LIMIT 10
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $players = [];
    while($row = $result->fetch_assoc()) {
        $players[] = $row;
    }
    
    // 2. Kunin ang total number ng players
    $totalResult = $conn->query("SELECT COUNT(*) as total FROM users WHERE role = 'player'");
    $total = $totalResult->fetch_assoc();
    
    // 3. Ibalik bilang JSON
    echo json_encode([
        'success' => true,
        'players' => $players,
        'total_players' => (int)$total['total']
    ]);
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>  