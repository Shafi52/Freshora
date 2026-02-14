import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated()]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await API.get("/cart");
      // Transform backend cart format to match frontend
      const cartItems = res.data.items.map(item => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        category: item.product.category,
        qty: item.quantity,
      }));
      setCart(cartItems);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!isAuthenticated()) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      await API.post("/cart", { productId: product._id, quantity: 1 });
      await fetchCart(); // Refresh cart
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add item to cart");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await API.put(`/cart/${productId}`, { quantity });
      await fetchCart(); // Refresh cart
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert("Failed to update quantity");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);
      await fetchCart(); // Refresh cart
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      alert("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      await API.delete("/cart");
      setCart([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
