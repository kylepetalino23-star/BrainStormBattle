<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// ===== DATABASE CONNECTION =====
$host = 'localhost';
$dbname = 'game_db'; 
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// ===== GET DATA FROM FRONTEND =====
$data = json_decode(file_get_contents("php://input"), true);

$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
$current_stage = isset($data['current_stage']) ? intval($data['current_stage']) : 1;
$lives = isset($data['lives']) ? intval($data['lives']) : 3;
$score = isset($data['score']) ? intval($data['score']) : 0;

if ($user_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid User ID.']);
    exit;
}

// ===== GET OLD DATA FROM game_progress =====
$getOldStmt = $conn->prepare("SELECT current_stage, score FROM game_progress WHERE user_id = ?");
$getOldStmt->bind_param("i", $user_id);
$getOldStmt->execute();
$getOldResult = $getOldStmt->get_result();
$oldData = $getOldResult->fetch_assoc();
$getOldStmt->close();

$oldStage = $oldData['current_stage'] ?? 1;
$oldScore = $oldData['score'] ?? 0;

// ===== HIGH SCORE LOGIC =====
// Ang $score na ipinasa ay ang CURRENT GAME SCORE (stage * 10)
// Kung mas mataas ito sa high score, palitan. Kung hindi, huwag galawin.
$currentGameScore = $score;
$newScore = max($oldScore, $currentGameScore); // high score

// ===== HIGHEST STAGE LOGIC =====
// Kung mas mataas ang bagong stage, i-update. Kung hindi, huwag galawin.
$newStage = max($oldStage, $current_stage); // highest stage

// ===== UPDATE PLAYER PROGRESS =====

// 1. Update the main 'users' table
$stmtUser = $conn->prepare("UPDATE users SET current_stage = ?, last_active = NOW() WHERE id = ?");
$stmtUser->bind_param("ii", $newStage, $user_id);

if (!$stmtUser->execute()) {
    echo json_encode(['success' => false, 'message' => 'Failed to update user stage: ' . $stmtUser->error]);
    $stmtUser->close();
    $conn->close();
    exit;
}
$stmtUser->close();

// 2. Update/Insert the 'game_progress' table
$checkProgress = $conn->prepare("SELECT id FROM game_progress WHERE user_id = ?");
$checkProgress->bind_param("i", $user_id);
$checkProgress->execute();
$checkProgress->store_result();

if ($checkProgress->num_rows > 0) {
    // Update existing — GAMIT ANG $newStage at $newScore
    $updateProgress = $conn->prepare("UPDATE game_progress SET current_stage = ?, lives = ?, score = ?, last_saved = NOW() WHERE user_id = ?");
    $updateProgress->bind_param("iiii", $newStage, $lives, $newScore, $user_id);
    $updateProgress->execute();
    $updateProgress->close();
} else {
    // Insert new
    $insertProgress = $conn->prepare("INSERT INTO game_progress (user_id, current_stage, lives, score, last_saved) VALUES (?, ?, ?, ?, NOW())");
    $insertProgress->bind_param("iiii", $user_id, $newStage, $lives, $newScore);
    $insertProgress->execute();
    $insertProgress->close();
}
$checkProgress->close();

// ===== SUCCESS RESPONSE =====
echo json_encode([
    'success' => true,
    'message' => 'Progress saved successfully!',
    'high_score' => $newScore,
    'highest_stage' => $newStage,
    'old_score' => $oldScore,
    'old_stage' => $oldStage
]);

$conn->close();
?>