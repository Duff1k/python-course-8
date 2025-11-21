document.getElementById("external-btn").onclick = function() {
    document.getElementById("external-text").textContent =
        "Текст изменён внешним файлом practice.js!";
};

document.getElementById("load-products-btn").onclick = loadProducts;

// Основная функция: загрузить продукты и вывести в таблицу
function loadProducts() {

    // Адрес твоего Flask API
    const url = "http://localhost:5000/products";

    fetch(url)
        .then(response => response.json())
        .then(products => {
            console.log("Продукты:", products); // выводим в консоль для проверки
            renderTable(products);
        })
        .catch(err => console.error("Ошибка запроса:", err));
}

// Рисуем таблицу
function renderTable(products) {

    const table = document.getElementById("products-table");

    // очищаем таблицу, оставляя только заголовок
    table.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Цена</th>
        </tr>
    `;

    // добавляем каждую строку
    products.forEach(prod => {
        const row = `
            <tr>
                <td>${prod.id}</td>
                <td>${prod.name}</td>
                <td>${prod.price}</td>
            </tr>
        `;
        table.innerHTML += row;
    });
}