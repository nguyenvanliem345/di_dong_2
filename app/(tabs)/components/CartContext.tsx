// app/(tabs)/components/CartContext.tsx
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { API_CONFIG } from "../../../apiConfig";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  photo: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);
const USER_ID = 1; // Theo Database của bạn đã INSERT user id = 1

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. Load giỏ hàng từ Server khi mở ứng dụng
  useEffect(() => {
    const fetchCartFromServer = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/cart/${USER_ID}`);
        if (response.ok) {
          const data = await response.json();
          // Map dữ liệu từ bảng cart_detail về định dạng CartItem của App
          setCart(data.items || []);
        }
      } catch (e) {
        console.log("Không thể kết nối Server, dùng tạm dữ liệu offline");
      }
    };
    fetchCartFromServer();
  }, []);

  // 2. Hàm thêm món: Lưu vào bảng cart_detail
  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    try {
      // Gửi yêu cầu lưu vào Database (Bảng cart_detail)
      await fetch(`${API_CONFIG.BASE_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER_ID,
          productId: item.id,
          quantity: 1,
        }),
      });
    } catch (e) {
      console.error("Lỗi đồng bộ Database Cart");
    }

    // Cập nhật giao diện người dùng ngay lập tức
    setCart((prev) => {
      const exist = prev.find((p) => p.id === item.id);
      if (exist) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // 3. Hàm giảm món: Cập nhật Database
  const removeFromCart = async (id: number) => {
    try {
      await fetch(`${API_CONFIG.BASE_URL}/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, productId: id }),
      });
    } catch (e) {
      console.error("Lỗi cập nhật Database");
    }

    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p))
        .filter((p) => p.quantity > 0),
    );
  };

  const clearCart = () => setCart([]);
  const totalPrice = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.quantity, 0),
    [cart],
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};
