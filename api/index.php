<?php
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
require_once __DIR__ . '/config.php';

// Default settings as fallback
$settings = [
    'admin_pin' => '2024',
    'owner_pin' => '9999',
    'admin_wa'  => '089647796129'
];

try {
    $db = getDB();
    if ($db) {
        $stmt = $db->query("SELECT * FROM `settings`");
        while ($row = $stmt->fetch()) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
    }
} catch (Throwable $e) {
    // Silently fallback to defaults if database fails
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>fowlizs02_decoration — Sewa Dekorasi Pernikahan Premium</title>
<link rel="stylesheet" href="style.css?v=20260719" />

<!-- Tailwind (Lokal) -->
<script src="js/tailwind.js"></script>

<!-- React 18 (Lokal) -->
<script src="js/react.js"></script>
<script src="js/react-dom.js"></script>

<!-- Dependensi Recharts (Lokal) -->
<script src="js/prop-types.js"></script>
<script src="js/react-is.js"></script>
<script src="js/recharts.js"></script>

<!-- Lucide (Lokal) -->
<script src="js/lucide.js"></script>

<!-- Babel standalone (Lokal) -->
<script src="js/babel.js"></script>

<script>
  // Konfigurasi dinamis dari database MySQL via PHP
  window.APP_SETTINGS = <?php echo json_encode($settings); ?>;
</script>
</head>
<body>
<div id="root"></div>

<!-- Memuat app.js secara inline agar tidak diblokir oleh CORS/Path/Space di browser -->
<script type="text/babel" data-presets="react">
<?php include __DIR__ . '/../app.js'; ?>
</script>
</body>
</html>