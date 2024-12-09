<?php

$servername = "localhost";
$dbname = "cards_test";
$username_db = "root";
$password_db = "b.5647382910-D";

$conn = new mysqli($servername, $username_db, $password_db, $dbname);

if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

?>