document.getElementById("load-products-btn").onclick = loadProducts;

function loadProducts(){
    const products_url = "http://localhost:5000/products"

    fetch(products_url)
        .then(response => response.json())
        .then(products => {
            console.log("Продукты: ", products)
            renderTable(products)
        })
        .catch(err => console.error("Ошибка запроса: ", err))
}

function renderTable(products) {
    const table  = document.getElementById("products-table");
    table.innerHTML = `
         <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Цена</th>
         </tr>
    `;

    products.forEach(product => {
        const row = `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
            </tr>
        `;
        table.innerHTML += row;
    });
}
