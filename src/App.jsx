import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import {
  BrowserRouter,
  Routes,
  Route,
  useSearchParams
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategorySection from "./components/CategorySection";
import ProductCard from "./components/ProductCard";

import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";

import { products } from "./data/products";

import "./App.css";


// ===============================
// HOME PAGE
// ===============================

function Home() {

  // URL se search value lena
  const [searchParams] = useSearchParams();

  const searchTerm =
    searchParams.get("search") || "";


  // Category state
  const [category, setCategory] =
    useState("All");


  // Products filter karna
  const filteredProducts = products.filter(
    (product) => {

      const matchesSearch =
        product.title
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );


      const matchesCategory =
        category === "All" ||
        product.category === category;


      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );


  return (
    <>

      {/* Hero */}

      <Hero />


      {/* Categories */}

      <CategorySection />


      {/* Products */}

      <section className="products-section">

        <div className="section-heading">

          <h2>
            {searchTerm
              ? `Search Results for "${searchTerm}"`
              : "🔥 Deals of the Day"}
          </h2>


          {/* Category Filter */}

          <select
            className="category-filter"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            <option value="All">
              All Categories
            </option>

            <option value="Electronics">
              Electronics
            </option>

            <option value="Fashion">
              Fashion
            </option>

            <option value="Home">
              Home
            </option>

            <option value="Gaming">
              Gaming
            </option>

          </select>

        </div>


        {/* Product Results */}

        {filteredProducts.length > 0 ? (

          <div className="products-grid">

            {filteredProducts.map(
              (product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              )
            )}

          </div>

        ) : (

          <div className="no-products">

            <h2>
              No products found 😕
            </h2>

            <p>
              Try searching for another product.
            </p>

          </div>

        )}

      </section>

    </>
  );
}


// ===============================
// MAIN APP
// ===============================

function App() {

  return (

    <BrowserRouter>

      {/* Navbar */}

      <Navbar />


      {/* Pages */}

      <Routes>

        {/* Home */}

        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />


        {/* Cart */}

        <Route
          path="/cart"
          element={<Cart />}
        />


        {/* Product Details */}

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/checkout"
          element={<Checkout />}
        />
        <Route
          path="/orders"
          element={<Orders />}
        />
      </Routes>
      <Footer />

    </BrowserRouter>

  );
}


export default App;