<?php
// ============================================================
//  AUTO-IMPORT QUESTIONS FROM game.js
//  Run this ONCE to import all questions to database
// ============================================================

header("Content-Type: text/plain");

// ===== DATABASE CONNECTION =====
$host = 'localhost';
$dbname = 'game_db';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "✅ Connected to database.\n\n";

// ===== READ game.js FILE =====
$gameJsPath = __DIR__ . '/game.js';

if (!file_exists($gameJsPath)) {
    die("❌ game.js not found at: $gameJsPath\n");
}

$gameJsContent = file_get_contents($gameJsPath);
echo "✅ Read game.js (" . strlen($gameJsContent) . " bytes)\n\n";

// ===== EXTRACT questionBank ARRAY =====
// Hanapin ang "const questionBank = [" ... "]"
if (!preg_match('/const\s+questionBank\s*=\s*\[(.*?)\];/s', $gameJsContent, $matches)) {
    die("❌ Could not find questionBank in game.js\n");
}

$questionBankContent = $matches[1];
echo "✅ Found questionBank (" . strlen($questionBankContent) . " bytes)\n\n";

// ===== EXTRACT EACH QUESTION OBJECT =====
// Pattern: { q: "...", choices: [...], correct: N, category: "..." }
preg_match_all('/\{\s*q:\s*"((?:[^"\\\\]|\\\\.)*)"\s*,\s*choices:\s*\[((?:[^\[\]]|\[[^\]]*\])*)\]\s*,\s*correct:\s*(\d+)\s*,\s*category:\s*"([^"]*)"\s*\}/s', $questionBankContent, $questionMatches, PREG_SET_ORDER);

echo "📝 Found " . count($questionMatches) . " questions\n\n";

if (count($questionMatches) === 0) {
    die("❌ No questions extracted. Check the regex or game.js format.\n");
}

// ===== DELETE OLD QUESTIONS FIRST (para hindi mag-duplicate) =====
$conn->query("TRUNCATE TABLE questions");
echo "🗑️ Cleared old questions.\n\n";

// ===== INSERT EACH QUESTION =====
$inserted = 0;
$failed = 0;

$stmt = $conn->prepare("
    INSERT INTO questions 
    (category, question, choice_a, choice_b, choice_c, choice_d, correct_answer, is_active) 
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
");

foreach ($questionMatches as $qm) {
    $questionText = $qm[1];
    $choicesRaw = $qm[2];
    $correctIndex = intval($qm[3]);
    $category = $qm[4];
    
    // ===== EXTRACT CHOICES =====
    preg_match_all('/"((?:[^"\\\\]|\\\\.)*)"/', $choicesRaw, $choiceMatches);
    $choices = $choiceMatches[1];
    
    if (count($choices) < 4) {
        echo "⚠️ Skipping (not enough choices): $questionText\n";
        $failed++;
        continue;
    }
    
    // ===== CONVERT correctIndex TO LETTER =====
    $correctLetters = ['a', 'b', 'c', 'd'];
    $correctAnswer = isset($correctLetters[$correctIndex]) ? $correctLetters[$correctIndex] : 'a';
    
    // ===== UNESCAPE STRINGS =====
    $questionText = stripslashes($questionText);
    $choices = array_map('stripslashes', $choices);
    
    $choice_a = $choices[0];
    $choice_b = $choices[1];
    $choice_c = $choices[2];
    $choice_d = $choices[3];
    
    $stmt->bind_param("sssssss", 
        $category, 
        $questionText, 
        $choice_a, 
        $choice_b, 
        $choice_c, 
        $choice_d, 
        $correctAnswer
    );
    
    if ($stmt->execute()) {
        $inserted++;
    } else {
        echo "❌ Failed: $questionText — " . $stmt->error . "\n";
        $failed++;
    }
}

$stmt->close();
$conn->close();

echo "\n========================================\n";
echo "✅ IMPORT COMPLETE!\n";
echo "   Inserted: $inserted questions\n";
echo "   Failed: $failed questions\n";
echo "========================================\n";
?>