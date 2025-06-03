# FoodDeliveryTask
Horbavickey Foods is a responsive and fully functional frontend web application for a food delivery service. Built as part of a frontend study project, it replicates a real-world food ordering platform using modern HTML, CSS (with Bootstrap), and JavaScript. The app communicates with a live backend API to allow users to register, log in, browse a menu with filtering and pagination, manage a shopping cart, place orders, view order history, and rate dishes.

The project strictly follows all technical and design requirements provided in the official Delivery.International.25.pdf, including proper page routing, form validations, delivery scheduling, and dynamic user interface updates.

Whether you're viewing your order history or rating a freshly delivered meal, Horbavickey Foods ensures a seamless and intuitive experience that reflects modern web development practices.
### ⭐️ Dish Page
- Accessible at /item/{id}
- Users can see and rate dishes (only if previously ordered)

### 🛒 Cart Page
- Accessible at /cart
- Shows current basket contents
- Lets users adjust quantity or remove items

### 📦 Orders & Purchase
- /orders: lists user's past and current orders
- /order/{id}: detailed order view
- /purchase: place current cart as a new order

---

## ⚙️ Technologies Used

- HTML5  
- CSS3 + Bootstrap 5  
- Vanilla JavaScript (ES6+)
- REST API integration  
- Responsive Design

---

## 🚀 How to Run the Project

1. Clone or unzip this project into a folder.
2. Open index.html in a modern browser (Chrome recommended).
3. Make sure you have internet access to reach the public API.

> ⚠️ No local server is needed since the API is hosted at https://food-delivery.int.kreosoft.space

---

## 🔒 Notes

- Make sure to register before accessing protected pages like /profile, /cart, /orders.
- JWT token is stored in browser localStorage after login/registration.
- Invalid or expired token redirects user to /login.

---

## 💛 Branding

> Horbavickey Foods – *"Where flavors meet speed!"*  
> © 2025 Horbavickey Foods. All rights reserved.

---

## 🧪 Test Credentials (if needed)

- Email: vick@gmail.com  
- Password: 123456


---

## 📄 License

This project is a student study assignment and is not licensed for commercial use.
