import React, { useState } from "react";
import "./assets/styles/App.css";
import { UserContextProvider } from "./context/user-context";
import { OrderContextProvider } from "./context/order-context";
import { NotificationProvider } from "./context/notification-context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Splash } from "./splash";
import { Navbar } from "./components/navbar";
import { Home } from "./pages/home/home";
import { HomeAdmin } from "./pages/admin/home-admin";
import { Sign } from "./pages/sign/sign";
import { Profile } from "./pages/menu/components/profile";
import { Shop } from "./pages/shop/shop";
import { Cart } from "./pages/cart/cart";
import { Order } from "./pages/order/order";
import { History } from "./pages/history/history";
import { SetUpShop } from "./pages/menu/components/setup-shop";
import { HomeSeller } from "./pages/seller/home-seller";
import { IndividualShop } from "./pages/seller/components/individual-shop";
import { CustomizeOrder } from "./pages/customize/customize-order";
import { SellerShop } from "./pages/seller/components/seller-shop";

function App() {
  return (
    <div className="app">
      <UserContextProvider>
        <OrderContextProvider>
          <NotificationProvider>
            <Router>
              <Navbar />
              <Routes>
                <Route path="/splash" element={<Splash />} />
                <Route path="/" element={<Home />} />
                <Route path="/sign" element={<Sign />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/customize-order" element={<CustomizeOrder />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<Order />} />
                <Route path="/history" element={<History />} />
                <Route path="/setup-shop" element={<SetUpShop />} />
                <Route path="/home-admin" element={<HomeAdmin />} />
                <Route path="/home-seller" element={<HomeSeller />} />
                <Route path="/seller-shop" element={<SellerShop />} />
                <Route
                  path="/individual-shop/:shopId/:shopName"
                  element={<IndividualShop />}
                />
              </Routes>
            </Router>
          </NotificationProvider>
        </OrderContextProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
