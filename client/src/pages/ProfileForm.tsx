import { useEffect, useState } from "react";
import "./css/profile.css";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  count: number;
  category?: string;
}

interface BasketItems {
  id: number;
  name: string;
}

interface User {
  id: number;
  login: string;
  phone?: string;
  role: string;
}

export default function ProfileForm() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [basketItems, setBasketItems] = useState<BasketItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const userResponse = await axios.get("http://localhost:5000/api/users/me", {
          withCredentials: true
        });
        
        setUser(userResponse.data);
        await loadProducts();
        await loadCartData(userResponse.data.id);
        setLoading(false);
      } catch (error) {
        console.error("Пользователь не авторизован", error);
        window.location.href = "/login";
      }
    };

    initializeData();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get<Product[]>("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
      alert("Ошибка загрузки товаров");
    }
  };

  const loadCartData = async (userId: number) => {
    if (userId) {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/basket/${userId}`,
          { withCredentials: true }
        );
        setBasketItems(res.data);
      } catch (err) {
        console.error("Ошибка загрузки корзины", err);
        setBasketItems([]);
      }
    } else {
      const cart: BasketItems[] = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );
      setBasketItems(cart);
    }
  };

  const removeFromCart = async (productId: number) => {
    const newItems = basketItems.filter(item => item.id !== productId);
    setBasketItems(newItems);

    if (user?.id) {
      try {
        await axios.post(
          `http://localhost:5000/api/basket/${user.id}/update`,
          newItems,
          { 
            headers: { "Content-Type": "application/json" },
            withCredentials: true 
          }
        );
      } catch (err) {
        console.error("Ошибка обновления корзины", err);
        await loadCartData(user.id);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(newItems));
    }
  };

  const buyAll = async () => {
    if (basketItems.length === 0) {
      alert("Корзина пуста");
      return;
    }

    alert("Заказ оформлен! Спасибо за покупку!");

    setBasketItems([]);

    if (user?.id) {
      try {
        await axios.post(
          `http://localhost:5000/api/basket/${user.id}/update`,
          [],
          { 
            headers: { "Content-Type": "application/json" },
            withCredentials: true 
          }
        );
      } catch (err) {
        console.error("Ошибка очистки корзины", err);
      }
    } else {
      localStorage.removeItem("cart");
    }
  };

  const buyOne = async (id: number) => {
    const item = basketItems.find(x => x.id === id);

    if (!item) return;

    alert(`Куплен товар ${item.name}`);

    const updated = basketItems.filter(x => x.id !== id);
    setBasketItems(updated);

    if (user?.id) {
      try {
        await axios.post(
          `http://localhost:5000/api/basket/${user.id}/update`,
          updated,
          { 
            headers: { "Content-Type": "application/json" },
            withCredentials: true 
          }
        );
      } catch (err) {
        console.error("Ошибка обновления корзины", err);
        await loadCartData(user.id);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updated));
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/logout", {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error("Ошибка при выходе", error);
    }
    
    localStorage.removeItem("cart");
    window.location.href = "/login";
  };

  const getCategoryName = (category?: string): string => {
    const categories: Record<string, string> = {
      "iphone": "iPhone",
      "ipad": "iPad",
      "mac": "Mac",
      "watch": "Apple Watch",
      "airpods": "AirPods",
      "accessories": "Аксессуары"
    };
    return category ? categories[category] || category : "Без категории";
  };

  const cartTotal = basketItems.reduce((sum: number, item: BasketItems) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product?.price || 0);
  }, 0);

  const totalItems = basketItems.length;

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="profile-info">
          <div className="prf">
            <h2>{user?.login || "Пользователь"}</h2>
            <button className="logout-btn" onClick={logout}>
              <i className="fas fa-sign-out-alt"></i> Выйти
            </button>
          </div>
          <div className="prf">
            <div className="info-item">
              <i className="fas fa-phone"></i>
              <span>{user?.phone || "Не указан"}</span>
            </div>
            <div className="info-item">
              <i className="fas fa-tag"></i>
              <span>{user?.role === "admin" ? "Администратор" : "Покупатель"}</span>
            </div>
          </div>
          <div className="stats-container">
            <div className="stat-cart">
              <div className="stat-label">Товаров в корзине</div>
              <div className="stat-value">{totalItems}</div>
            </div>
            <div className="stat-cart">
              <div className="stat-label">Общая сумма</div>
              <div className="stat-value">{cartTotal.toLocaleString()} $</div>
            </div>
            {basketItems.length > 0 && (
              <button className="logout-btn" onClick={buyAll}>
                Купить всё
              </button>
            )}
          </div>
        </div>
      </div>

      <h2 className="section-title">Моя корзина</h2>

      <div className="products">
        {basketItems.length === 0 ? (
          <div className="no-products">Корзина пуста</div>
        ) : (
          basketItems.map((item) => {
            const product = products.find(p => p.id === item.id);
            if (!product) return null;

            return (
              <div className="cart" key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="img"
                  onError={(e) =>
                    (e.currentTarget.src = "/img/placeholder.png")
                  }
                />

                <div className="name">{product.name}</div>

                <div className="nalichie">
                  Наличие:{" "}
                  <span>
                    {product.count > 0 ? "В наличии" : "Нет"}
                  </span>
                </div>

                <div className="cost">
                  Цена: <span>{product.price} $</span>
                </div>

                <div className="buttons">
                  <button
                    className="button-s"
                    onClick={() => removeFromCart(product.id)}
                  >
                    <i className="fa-solid fa-box"></i>
                  </button>

                  <button
                    className="button-s"
                    onClick={() => buyOne(product.id)}
                  >
                    Купить
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}