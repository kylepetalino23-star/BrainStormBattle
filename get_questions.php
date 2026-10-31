<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include 'db_connect.php';

// ===== GET CATEGORY PARAMETER =====
$category = isset($_GET['category']) ? trim($_GET['category']) : '';

// ===== VALIDATE CATEGORY =====
$validCategories = ['hardware', 'software', 'parts'];

if (!empty($category) && !in_array($category, $validCategories)) {
    echo json_encode([
        'success' => false, 
        'message' => 'Invalid category. Must be: hardware, software, or parts.'
    ]);
    exit;
}

// ===== BUILD QUERY =====
if (!empty($category)) {
    // Kunin lang ang specific category
    $stmt = $conn->prepare("
        SELECT id, category, question, choice_a, choice_b, choice_c, choice_d, correct_answer 
        FROM questions 
        WHERE category = ? AND is_active = 1
        ORDER BY RAND()
    ");
    $stmt->bind_param("s", $category);
} else {
    // Kunin lahat ng categories
    $stmt = $conn->prepare("
        SELECT id, category, question, choice_a, choice_b, choice_c, choice_d, correct_answer 
        FROM questions 
        WHERE is_active = 1
        ORDER BY category ASC, id ASC
    ");
}

$stmt->execute();
$result = $stmt->get_result();

$questions = [];

while ($row = $result->fetch_assoc()) {
    // ===== CONVERT correct_answer LETTER TO INDEX =====
    $correctMap = ['a' => 0, 'b' => 1, 'c' => 2, 'd' => 3];
    $correctIndex = isset($correctMap[$row['correct_answer']]) ? $correctMap[$row['correct_answer']] : 0;
    
    $questions[] = [
        'id' => (int)$row['id'],
        'q' => $row['question'],
        'choices' => [
            $row['choice_a'],
            $row['choice_b'],
            $row['choice_c'],
            $row['choice_d']
        ],
        'correct' => $correctIndex,
        'category' => $row['category']
    ];
}

$stmt->close();
$conn->close();

echo json_encode([
    'success' => true,
    'count' => count($questions),
    'questions' => $questions
]);
?>