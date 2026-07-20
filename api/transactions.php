<?php
// ============================================================
// REST API — Transactions (Buku Kas)
// GET    /api/transactions.php          → ambil semua transaksi
// POST   /api/transactions.php          → tambah transaksi baru
// DELETE /api/transactions.php?id=xxx   → hapus transaksi
// ============================================================

require_once __DIR__ . '/config.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET: Ambil semua transaksi ────────────────────────────────
if ($method === 'GET') {
    if (!$db) {
        jsonResponse([]); // mode simulasi: list kosong
    }

    $stmt = $db->query("SELECT * FROM `transactions` ORDER BY `date` DESC, `created_at` DESC");
    $rows = $stmt->fetchAll();

    $result = array_map(function ($row) {
        return [
            'id'          => $row['id'],
            'date'        => $row['date'],
            'type'        => $row['type'],
            'amount'      => (int) $row['amount'],
            'description' => $row['description'],
            'createdAt'   => $row['created_at'],
        ];
    }, $rows);

    jsonResponse($result);
}

// ── POST: Tambah transaksi baru ────────────────────────────────
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        jsonResponse(['error' => 'Data tidak valid.'], 400);
    }

    // Validasi field wajib
    $required = ['id', 'date', 'type', 'amount', 'description'];
    foreach ($required as $field) {
        if (empty($input[$field]) && $input[$field] !== 0) {
            jsonResponse(['error' => "Field '$field' wajib diisi."], 400);
        }
    }

    // Validasi jenis transaksi
    if (!in_array($input['type'], ['pemasukan', 'pengeluaran'])) {
        jsonResponse(['error' => 'Jenis transaksi tidak valid.'], 400);
    }

    if (!$db) {
        jsonResponse(['success' => true, 'id' => $input['id'], 'simulated' => true], 201);
    }

    $stmt = $db->prepare("
        INSERT INTO `transactions`
            (`id`, `date`, `type`, `amount`, `description`, `created_at`)
        VALUES
            (:id, :date, :type, :amount, :description, :created_at)
    ");

    $stmt->execute([
        ':id'          => $input['id'],
        ':date'        => $input['date'],
        ':type'        => $input['type'],
        ':amount'      => (int) $input['amount'],
        ':description' => $input['description'],
        ':created_at'  => $input['createdAt'] ?? date('Y-m-d H:i:s'),
    ]);

    jsonResponse(['success' => true, 'id' => $input['id']], 201);
}

// ── DELETE: Hapus transaksi ────────────────────────────────────
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        jsonResponse(['error' => 'Parameter id wajib.'], 400);
    }

    if (!$db) {
        jsonResponse(['success' => true, 'deleted' => 1, 'simulated' => true]);
    }

    $stmt = $db->prepare("DELETE FROM `transactions` WHERE `id` = :id");
    $stmt->execute([':id' => $id]);

    jsonResponse(['success' => true, 'deleted' => $stmt->rowCount()]);
}

// ── Method tidak dikenal ─────────────────────────────────────
jsonResponse(['error' => 'Method tidak didukung.'], 405);
