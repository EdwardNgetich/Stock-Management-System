// Load saved products from browser storage
let products = JSON.parse(
    localStorage.getItem("products")
) || [];

// Get the registration form
const productForm = document.getElementById("addProductForm");

// Listen for product registration
productForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Collect product details
    const name = document.getElementById("productName").value.trim();
    const code = document.getElementById("productCode").value.trim();
    const quantity = Number(document.getElementById("productQuantity").value);
    const price = Number(document.getElementById("productPrice").value);
    const minimum = Number(document.getElementById("minimumStock").value);

    // Validate entries
    if (!name || !code ||
        !Number.isInteger(quantity) || quantity < 0 ||
        !Number.isFinite(price) || price < 0 ||
        !Number.isInteger(minimum) || minimum < 0) {

        alert("Please enter valid product details.");
        return;
    }

    // Check for duplicate product codes
    const duplicate = products.some(
        product => product.code.toLowerCase() === code.toLowerCase()
    );

    if (duplicate) {
        alert("This product code already exists!");
        return;
    }

    // Create a new product
    const newProduct = {
        name: name,
        code: code,
        quantity: quantity,
        price: price,
        minimum: minimum
    };

    // Add product to the array
    products.push(newProduct);

    // Save products in browser storage
    localStorage.setItem("products", JSON.stringify(products));

    // Refresh dashboard
    displayProducts();

    // Clear the form
    productForm.reset();

    alert("Product registered successfully!");
});

// Display registered products
function displayProducts() {

    const table = document.getElementById("productTable");

    table.innerHTML = "";

    if (products.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4">No products registered yet.</td>
            </tr>
        `;
    }

    products.forEach(function(product) {

        const row = document.createElement("tr");

        const values = [
            product.name,
            product.code,
            product.quantity,
            product.price.toFixed(2)
        ];

        values.forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        table.appendChild(row);
    });

    updateDashboard();
}

// Update dashboard figures
function updateDashboard() {

    const totalProducts = products.length;

    const totalUnits = products.reduce(
        (sum, product) => sum + product.quantity, 0
    );

    const lowStock = products.filter(
        product => product.quantity <= product.minimum
    ).length;

    const stockValue = products.reduce(
        (sum, product) => sum + product.quantity * product.price, 0
    );

    document.getElementById("totalProducts").textContent = totalProducts;

    document.getElementById("totalUnits").textContent = totalUnits;

    document.getElementById("lowStock").textContent = lowStock;

    document.getElementById("stockValue").textContent =
        stockValue.toLocaleString("en-KE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
}

// Display saved products when the page opens
displayProducts();