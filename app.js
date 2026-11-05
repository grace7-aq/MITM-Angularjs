const products = [
  { name: "Laptop", price: 50000 },
  { name: "Mobile", price: 20000 },
  { name: "Tablet", price: 1000 }
];

const productsDiv = document.getElementById("products");
const searchInput = document.getElementById("search");
const dateP = document.getElementById("date");

// Today's date, e.g. "Thursday, November 5, 2026"
const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});
dateP.textContent = "today's date is " + today;

// Format price as ₹50,000.00
function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
}

// Show products on the page
function displayProducts(list) {
  productsDiv.innerHTML = "";
  list.forEach(function (p) {
    const line = document.createElement("div");
    line.textContent = p.name + " - " + formatPrice(p.price);
    productsDiv.appendChild(line);
  });
}

// Filter as the user types
searchInput.addEventListener("input", function () {
  const text = searchInput.value.toLowerCase();
  const filtered = products.filter(function (p) {
    return p.name.toLowerCase().includes(text);
  });
  displayProducts(filtered);
});

displayProducts(products);