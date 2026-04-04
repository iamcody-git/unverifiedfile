import { createContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "Rs ";
  const delivery_fee = 100;
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const [products, setProducts] = useState([]);

  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const prevTokenRef = useRef(null);
  const cartSnapshotRef = useRef({});

  const navigate = useNavigate();

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Get Authorization Header
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch products
  const getProductData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not load products");
    }
  };

  // Keep latest cart for merge when user logs in (guest cart + server cart)
  useEffect(() => {
    cartSnapshotRef.current = cartItem;
  }, [cartItem]);

  // Add item to cart
  const addToCart = async (itemId) => {
    let CartData = { ...cartItem };

    CartData[itemId] = (CartData[itemId] || 0) + 1;

    setCartItem(CartData);

    toast.success("Item added to cart!");
    navigate("/cart");

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId },
          getAuthHeader()
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to add to cart");
      }
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, quantity) => {
    let CartData = { ...cartItem };

    if (quantity < 1) {
      delete CartData[itemId];
    } else {
      CartData[itemId] = quantity;
    }

    setCartItem(CartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, quantity },
          getAuthHeader()
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to update cart");
      }
    }
  };

  // Remove item
  const removeItemFromCart = async (itemId) => {
    let CartData = { ...cartItem };

    delete CartData[itemId];

    setCartItem(CartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/remove`,
          { itemId },
          getAuthHeader()
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Cart total items
  const getCartCount = () => {
    return Object.values(cartItem).reduce((sum, qty) => sum + qty, 0);
  };

  // Cart total amount
  const getCartAmount = () => {
    let total = 0;

    for (const id in cartItem) {
      const product = products.find((p) => String(p._id) === String(id));

      if (product) {
        total += product.price * cartItem[id];
      }
    }

    return total;
  };

  useEffect(() => {
    const previousToken = prevTokenRef.current;
    prevTokenRef.current = token;

    getProductData();

    const loadCartForLoggedInUser = async () => {
      if (!token) return;

      try {
        const res = await axios.post(
          `${backendUrl}/api/cart/get`,
          {},
          getAuthHeader()
        );

        if (!res.data.success) {
          toast.error("Failed to load cart");
          return;
        }

        const server = res.data.cartData || {};
        const guestJustLoggedIn =
          previousToken === "" && token && Object.keys(cartSnapshotRef.current).length > 0;

        if (guestJustLoggedIn) {
          const local = cartSnapshotRef.current;
          const merged = { ...server };
          for (const k of Object.keys(local)) {
            const key = String(k);
            merged[key] =
              (Number(merged[key]) || 0) + Number(local[key] || 0);
          }
          setCartItem(merged);
          try {
            await axios.post(
              `${backendUrl}/api/cart/sync`,
              { cartData: merged },
              getAuthHeader()
            );
          } catch (syncErr) {
            console.error(syncErr);
            toast.error("Could not sync cart to account");
          }
        } else {
          setCartItem(server);
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not fetch cart");
      }
    };

    if (token) {
      loadCartForLoggedInUser();
    }

    const intervalId = setInterval(() => {
      getProductData();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems: cartItem,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    removeItemFromCart,
    backendUrl,
    setToken,
    token,
    navigate,
    setCartItem,
  };

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;