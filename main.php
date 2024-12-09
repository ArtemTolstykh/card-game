<?php
// Подключение к базе данных
include "db_conn.php";

function generateCards($conn) {
    // Запрос доступных подарков (count > 0)
    $query = "SELECT name, value, count FROM cards WHERE count > 0";
    $result = $conn->query($query);

    $availableGifts = [];
    while ($row = $result->fetch_assoc()) {
        $availableGifts[] = $row;
    }

    // Проверяем, достаточно ли подарков для игры
    if (count($availableGifts) < 3) {
        return ['error' => 'Недостаточно подарков для игры.'];
    }

    // Случайный выбор трех подарков
    shuffle($availableGifts);
    $selectedGifts = array_slice($availableGifts, 0, 3);

    // Формируем набор карточек: 3x для каждого подарка
    $cards = [];
    foreach ($selectedGifts as $gift) {
        for ($i = 0; $i < 3; $i++) {
            $cards[] = ['name' => $gift['name'], 'value' => $gift['value']];
        }
    }

    // Перемешиваем карточки
    shuffle($cards);

    return $cards;
}

// Если запрос на генерацию карточек
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $cards = generateCards($conn);
    echo json_encode($cards);
}

// Если запрос на обработку выигрыша
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $prizeValue = $data['value'];

    // Уменьшаем количество только для выигранного приза
    $query = "UPDATE cards SET count = count - 1 WHERE value = ? AND count > 0";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $prizeValue);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Приз закончился.']);
    }
}

?>