<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
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

$student_id = isset($data['student_id']) ? trim($data['student_id']) : '';
$password = isset($data['password']) ? $data['password'] : '';

// ===== VALIDATION =====
if (empty($student_id) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please enter Student ID and Password.']);
    exit;
}

// ===== FETCH USER FROM DATABASE =====
// IMPORTANT: Dito pinalitan natin ang 'score' ng 'current_stage'
$stmt = $conn->prepare("SELECT id, full_name, section, student_id, password, current_stage FROM users WHERE student_id = ?");
$stmt->bind_param("s", $student_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    // Verify password
if (password_verify($password, $row['password'])) {
    
    $updateStmt = $conn->prepare("UPDATE users SET is_online = 1 WHERE id = ?");
    $updateStmt->bind_param("i", $row['id']);
    $updateStmt->execute();
    $updateStmt->close();
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful!',
        'user' => [
            'id' => $row['id'],
            'full_name' => $row['full_name'],
            'section' => $row['section'],
            'username' => $row['student_id'],
            'current_stage' => (int)$row['current_stage']
        ]
    ]);
}
    else {
        echo json_encode(['success' => false, 'message' => 'Incorrect password!']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Student ID not found! Please register first.']);
}

$stmt->close();
$conn->close();
?>