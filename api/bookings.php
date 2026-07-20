<?php
// ============================================================
// REST API — Bookings
// GET    /api/bookings.php          → ambil semua booking
// POST   /api/bookings.php          → tambah booking baru
// PUT    /api/bookings.php?id=xxx   → update booking (status, dll)
// DELETE /api/bookings.php?id=xxx   → hapus booking
// ============================================================

require_once __DIR__ . '/config.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET: Ambil semua booking ─────────────────────────────────
if ($method === 'GET') {
    if (!$db) {
        jsonResponse([]); // mode simulasi: list kosong
    }

    $stmt = $db->query("SELECT * FROM `bookings` ORDER BY `created_at` DESC");
    $rows = $stmt->fetchAll();

    // Konversi agar konsisten dengan format frontend
    $result = array_map(function ($row) {
        return [
            'id'          => $row['id'],
            'code'        => $row['code'],
            'groomName'   => $row['groom_name'],
            'brideName'   => $row['bride_name'],
            'whatsapp'    => $row['whatsapp'],
            'address'     => $row['address'],
            'date'        => $row['date'],
            'packageId'   => $row['package_id'],
            'packageName' => $row['package_name'],
            'price'       => (int) $row['price'],
            'bookingPay'  => (int) $row['booking_pay'],
            'pelunasan'   => (int) $row['pelunasan'],
            'guests'      => $row['guests'],
            'notes'       => $row['notes'],
            'status'      => $row['status'],
            'createdAt'   => $row['created_at'],
        ];
    }, $rows);

    jsonResponse($result);
}

// ── POST: Tambah booking baru ────────────────────────────────
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        jsonResponse(['error' => 'Data tidak valid.'], 400);
    }

    // Validasi field wajib
    $required = ['id', 'code', 'groomName', 'brideName', 'date', 'packageId', 'packageName', 'price'];
    foreach ($required as $field) {
        if (empty($input[$field]) && $input[$field] !== 0) {
            jsonResponse(['error' => "Field '$field' wajib diisi."], 400);
        }
    }

    if (!$db) {
        jsonResponse(['success' => true, 'id' => $input['id'], 'simulated' => true], 201);
    }

    $stmt = $db->prepare("
        INSERT INTO `bookings`
            (`id`, `code`, `groom_name`, `bride_name`, `whatsapp`, `address`, `date`,
             `package_id`, `package_name`, `price`, `booking_pay`, `pelunasan`, `guests`, `notes`, `status`, `created_at`)
        VALUES
            (:id, :code, :groom_name, :bride_name, :whatsapp, :address, :date,
             :package_id, :package_name, :price, :booking_pay, :pelunasan, :guests, :notes, :status, :created_at)
    ");

    $stmt->execute([
        ':id'           => $input['id'],
        ':code'         => $input['code'],
        ':groom_name'   => $input['groomName'],
        ':bride_name'   => $input['brideName'],
        ':whatsapp'     => $input['whatsapp'] ?? '',
        ':address'      => $input['address'] ?? '',
        ':date'         => $input['date'],
        ':package_id'   => $input['packageId'],
        ':package_name' => $input['packageName'],
        ':price'        => (int) $input['price'],
        ':booking_pay'  => (int) ($input['bookingPay'] ?? 2000000),
        ':pelunasan'    => (int) ($input['pelunasan'] ?? 0),
        ':guests'       => $input['guests'] ?? '',
        ':notes'        => $input['notes'] ?? '',
        ':status'       => $input['status'] ?? 'pending',
        ':created_at'   => $input['createdAt'] ?? date('Y-m-d H:i:s'),
    ]);

    jsonResponse(['success' => true, 'id' => $input['id']], 201);
}

// ── PUT: Update booking ──────────────────────────────────────
if ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        jsonResponse(['error' => 'Parameter id wajib.'], 400);
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        jsonResponse(['error' => 'Data tidak valid.'], 400);
    }

    // Bangun query update secara dinamis
    $allowed = [
        'groomName'   => 'groom_name',
        'brideName'   => 'bride_name',
        'whatsapp'    => 'whatsapp',
        'address'     => 'address',
        'date'        => 'date',
        'packageId'   => 'package_id',
        'packageName' => 'package_name',
        'price'       => 'price',
        'bookingPay'  => 'booking_pay',
        'pelunasan'   => 'pelunasan',
        'guests'      => 'guests',
        'notes'       => 'notes',
        'status'      => 'status',
    ];

    $sets   = [];
    $params = [':id' => $id];

    foreach ($input as $key => $value) {
        if (isset($allowed[$key])) {
            $col           = $allowed[$key];
            $sets[]        = "`$col` = :$col";
            $params[":$col"] = $value;
        }
    }

    if (empty($sets)) {
        jsonResponse(['error' => 'Tidak ada field yang di-update.'], 400);
    }

    if (!$db) {
        jsonResponse(['success' => true, 'updated' => 1, 'simulated' => true]);
    }

    $sql = "UPDATE `bookings` SET " . implode(', ', $sets) . " WHERE `id` = :id";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    jsonResponse(['success' => true, 'updated' => $stmt->rowCount()]);
}

// ── DELETE: Hapus booking ────────────────────────────────────
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        jsonResponse(['error' => 'Parameter id wajib.'], 400);
    }

    if (!$db) {
        jsonResponse(['success' => true, 'deleted' => 1, 'simulated' => true]);
    }

    $stmt = $db->prepare("DELETE FROM `bookings` WHERE `id` = :id");
    $stmt->execute([':id' => $id]);

    jsonResponse(['success' => true, 'deleted' => $stmt->rowCount()]);
}

// ── Method tidak dikenal ─────────────────────────────────────
jsonResponse(['error' => 'Method tidak didukung.'], 405);
