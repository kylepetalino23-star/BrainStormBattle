<?php
// ===== TURN ON ERROR REPORTING (Para makita natin ang tunay na problema!) =====
error_reporting(E_ALL);
ini_set('display_errors', 1);

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

// ===== CHECK CONNECTION ERROR (Heto ang magsasabi kung mali ang database) =====
if ($conn->connect_error) {
    // Ito ang magpi-print ng malinaw na mensahe sa halip na hindi maintindihang error!
    die(json_encode(['success' => false, 'message' => 'DATABASE ERROR: ' . $conn->connect_error]));
}

// ===== GET DATA FROM FRONTEND =====
$data = json_decode(file_get_contents("php://input"), true);

// ===== CHECK IF DATA IS EMPTY =====
if (!$data) {
    die(json_encode(['success' => false, 'message' => 'No data received from frontend!']));
}

$full_name = isset($data['full_name']) ? trim($data['full_name']) : '';
$section = isset($data['section']) ? trim($data['section']) : '';
$student_id = isset($data['student_id']) ? trim($data['student_id']) : '';
$password = isset($data['password']) ? $data['password'] : '';

// ===== VALIDATION =====
if (empty($full_name) || empty($section) || empty($student_id) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required!']);
    exit;
}

if (!preg_match('/^\d{6}$/', $student_id)) {
    echo json_encode(['success' => false, 'message' => 'Student ID must be exactly 6 digits!']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters!']);
    exit;
}

// ===== CHECK IF STUDENT ID ALREADY EXISTS =====
$checkStmt = $conn->prepare("SELECT id FROM users WHERE student_id = ?");

// ===== CHECK PREPARE STATEMENT ERROR =====
if (!$checkStmt) {
    die(json_encode(['success' => false, 'message' => 'SQL PREPARE ERROR (Check users table): ' . $conn->error]));
}

$checkStmt->bind_param("s", $student_id);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Student ID is already registered!']);
    $checkStmt->close();
    $conn->close();
    exit;
}
$checkStmt->close();

// ===== HASH PASSWORD & INSERT TO DATABASE =====
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$insertStmt = $conn->prepare("INSERT INTO users (full_name, section, student_id, password, current_stage, created_at) VALUES (?, ?, ?, ?, 1, NOW())");

if (!$insertStmt) {
    die(json_encode(['success' => false, 'message' => 'SQL INSERT PREPARE ERROR: ' . $conn->error]));
}

$insertStmt->bind_param("ssss", $full_name, $section, $student_id, $hashedPassword);

if ($insertStmt->execute()) {
    $newUserId = $conn->insert_id;
    
    echo json_encode([
        'success' => true,
        'message' => 'Registration successful!',
        'user' => [
            'id' => $newUserId,
            'full_name' => $full_name,
            'section' => $section,
            'username' => $student_id,
            'current_stage' => 1
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database execute error: ' . $insertStmt->error]);
}

$insertStmt->close();
$conn->close();
?>