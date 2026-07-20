<?php
require_once __DIR__ . '/api/config.php';

try {
    $db = getDB();
    echo "Starting migration...<br>";

    // Helper function to check if column exists
    function columnExists($db, $table, $column) {
        $stmt = $db->query("SHOW COLUMNS FROM `$table` LIKE '$column'");
        return $stmt->rowCount() > 0;
    }

    // Add address column if it doesn't exist
    if (!columnExists($db, 'bookings', 'address')) {
        $db->exec("ALTER TABLE `bookings` ADD COLUMN `address` TEXT DEFAULT NULL AFTER `whatsapp`");
        echo "Column 'address' successfully added to 'bookings'.<br>";
    } else {
        echo "Column 'address' already exists.<br>";
    }

    // Add booking_pay column if it doesn't exist
    if (!columnExists($db, 'bookings', 'booking_pay')) {
        $db->exec("ALTER TABLE `bookings` ADD COLUMN `booking_pay` INT NOT NULL DEFAULT 2000000 AFTER `price`");
        echo "Column 'booking_pay' successfully added to 'bookings'.<br>";
    } else {
        echo "Column 'booking_pay' already exists.<br>";
    }

    // Add pelunasan column if it doesn't exist
    if (!columnExists($db, 'bookings', 'pelunasan')) {
        $db->exec("ALTER TABLE `bookings` ADD COLUMN `pelunasan` INT NOT NULL DEFAULT 0 AFTER `booking_pay`");
        echo "Column 'pelunasan' successfully added to 'bookings'.<br>";
    } else {
        echo "Column 'pelunasan' already exists.<br>";
    }

    echo "Migration completed successfully!<br>";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "<br>";
}
