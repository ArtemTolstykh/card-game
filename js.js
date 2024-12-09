const gameBoard = document.getElementById("game-board");
let clickCounts = {}; // Счетчик для каждого типа карточек
let totalClicks = 0;

// Функция для получения карточек с сервера
function loadGameBoard() {
  fetch("main.php", { method: "GET" })
    .then((response) => response.json())
    .then((cards) => {
      gameBoard.innerHTML = ""; // Очищаем игровое поле
      clickCounts = {}; // Сбрасываем счетчики
      const maxClicks = 3; // Максимальное количество кликов за игру
      let currentClicks = 0; // Текущее количество кликов

      cards.forEach((card) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.dataset.value = card.value;

        // Создаем card__front с изображением
        const cardFront = document.createElement("div");
        cardFront.classList.add("card__front");
        const cardImage = document.createElement("img");
        cardImage.src = "logo-for-card.webp"; // Замените на путь к вашему изображению
        cardImage.alt = card.name;
        cardFront.appendChild(cardImage);

        // Создаем card__back с текстом
        const cardBack = document.createElement("div");
        cardBack.classList.add("card__back");
        const cardText = document.createElement("span");
        cardText.textContent = card.name;
        cardBack.appendChild(cardText);

        // Добавляем card__front и card__back внутрь cardDiv
        cardDiv.appendChild(cardFront);
        cardDiv.appendChild(cardBack);

        // Добавляем cardDiv на игровое поле
        gameBoard.appendChild(cardDiv);

        // Обработка кликов
        cardDiv.addEventListener("click", () => {
          // Проверка: если карточка уже выбрана или лимит кликов достигнут
          if (
            cardDiv.classList.contains("clicked") ||
            currentClicks >= maxClicks
          ) {
            return;
          }

          // Отмечаем карточку как выбранную
          cardDiv.classList.add("clicked");
          currentClicks++; // Увеличиваем счётчик кликов

          const cardValue = cardDiv.dataset.value;

          if (!clickCounts[cardValue]) {
            clickCounts[cardValue] = 0;
          }

          clickCounts[cardValue]++;
          totalClicks++;

          // Проверяем победу или проигрыш с задержкой
          setTimeout(() => {
            if (clickCounts[cardValue] === 3) {
              console.log(`Вы выиграли приз: ${cardText.textContent}!`);
              handleWin(cardValue);
            } else if (
              totalClicks === 3 &&
              !Object.values(clickCounts).includes(3)
            ) {
              console.log("Вы проиграли. Попробуйте снова!");
              setTimeout(loadGameBoard, 2000);
            }
          }, 300); // Задержка в 300 мс
        });
      });
    });
}

// Функция для обработки выигрыша
function handleWin(value) {
  fetch("main.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value: parseInt(value) }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Приз успешно зафиксирован.");
      } else {
        console.log(data.message);
      }
      loadGameBoard(); // Загружаем новую игру
    });
}

// Запускаем игру
loadGameBoard();
