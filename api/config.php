<?php
// ============================================================
// Konfigurasi Database — sesuaikan jika perlu
// ============================================================
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'tamansari_tenda');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');

// ============================================================
// Koneksi PDO — MODE SIMULASI
// Jika database tidak tersedia (misal belum di-setup di Vercel),
// getDB() akan mengembalikan null, BUKAN error 500.
// Endpoint akan otomatis jalan dalam mode simulasi (data tidak permanen).
// ============================================================
function getDB() {
    static $pdo = null;
    static $attempted = false;

    if ($pdo !== null) return $pdo;
    if ($attempted) return null; // sudah dicoba & gagal, jangan ulang tiap panggilan

    $attempted = true;
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_TIMEOUT            => 3,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        error_log('DB tidak tersedia, mode simulasi aktif: ' . $e->getMessage());
        $pdo = null;
        return null;
    }
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

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}