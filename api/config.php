<?php
// ============================================================
// Konfigurasi Database — sesuaikan jika perlu
// ============================================================
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'tamansari_tenda');
define('DB_USER', getenv('DB_USER') ?: 'root');        // default XAMPP
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');            // default XAMPP (kosong)

// ============================================================
// Koneksi PDO
// ============================================================
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            // Self-healing: if database does not exist, try to create it
            if ($e->getCode() == 1049 || strpos($e->getMessage(), 'Unknown database') !== false) {
                try {
                    $tmpDsn = "mysql:host=" . DB_HOST . ";charset=utf8mb4";
                    $tmpPdo = new PDO($tmpDsn, DB_USER, DB_PASS);
                    $tmpPdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                    
                    // Reconnect
                    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES   => false,
                    ]);
                    
                    // Import database.sql if it exists
                    $sqlFile = dirname(dirname(__FILE__)) . '/database.sql';
                    if (file_exists($sqlFile)) {
                        $sql = file_get_contents($sqlFile);
                        $pdo->exec($sql);
                    }
                } catch (Exception $ex) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Gagal membuat database otomatis: ' . $ex->getMessage()]);
                    exit;
                }
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Koneksi database gagal: ' . $e->getMessage()]);
                exit;
            }
        }
    }
    return $pdo;
}

// ============================================================
// Helper: JSON response
// ============================================================
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// CORS headers (agar fetch dari browser bisa jalan)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
