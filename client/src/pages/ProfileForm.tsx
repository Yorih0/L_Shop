import { useEffect, useState } from "react";
import "./css/profile.css";
import axios from "axios";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        console.error(t("profile.notAuthorized"), error);
        window.location.href = "/login";
      }
    };

    initializeData();
  }, [t]);

  const loadProducts = async () => {
    try {
      const response = await axios.get<Product[]>("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error(t("profile.loadError"), error);
      alert(t("profile.loadError"));
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
        console.error(t("profile.cartLoadError"), err);
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
        console.error(t("profile.cartUpdateError"), err);
        await loadCartData(user.id);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(newItems));
    }
  };

  const buyAll = async () => {
    if (basketItems.length === 0) {
      alert(t("profile.emptyCart"));
      return;
    }

    alert(t("profile.orderSuccess"));

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
        console.error(t("profile.cartClearError"), err);
      }
    } else {
      localStorage.removeItem("cart");
    }
  };

  const buyOne = async (id: number) => {
    const item = basketItems.find(x => x.id === id);
    if (!item) return;

    alert(`${t("profile.bought")} ${item.name}`);

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
        console.error(t("profile.cartUpdateError"), err);
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
      console.error(t("profile.logoutError"), error);
    }
    localStorage.removeItem("cart");
    window.location.href = "/login";
  };

  const getCategoryName = (category?: string): string => {
    const categories: Record<string, string> = {
      "iphone": "iPhone",
      "ipad": "iPad",
      "mac": "Mac",
      "watch": t("profile.watch"),
      "airpods": "AirPods",
      "accessories": t("profile.accessories")
    };
    return category ? categories[category] || category : t("profile.noCategory");
  };

  const cartTotal = basketItems.reduce((sum: number, item: BasketItems) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product?.price || 0);
  }, 0);

  const totalItems = basketItems.length;

  if (loading) {
    return <div className="loading">{t("profile.loading")}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="profile-info">
          <div className="prf">
            <h2>{user?.login || t("profile.user")}</h2>
            <button className="logout-btn" onClick={logout}>
              <i className="fas fa-sign-out-alt"></i> {t("profile.logout")}
            </button>
          </div>
          <div className="prf">
            <div className="info-item">
              <i className="fas fa-phone"></i>
              <span>{user?.phone || t("profile.notSpecified")}</span>
            </div>
            <div className="info-item">
              <i className="fas fa-tag"></i>
              <span>{user?.role === "admin" ? t("profile.admin") : t("profile.buyer")}</span>
            </div>
          </div>
          <div className="stats-container">
            <div className="stat-cart">
              <div className="stat-label">{t("profile.cartItems")}</div>
              <div className="stat-value">{totalItems}</div>
            </div>
            <div className="stat-cart">
              <div className="stat-label">{t("profile.totalAmount")}</div>
              <div className="stat-value">{cartTotal.toLocaleString()} $</div>
            </div>
            {basketItems.length > 0 && (
              <button className="logout-btn" onClick={buyAll}>
                {t("profile.buyAll")}
              </button>
            )}
          </div>
        </div>
      </div>

      <h2 className="section-title">{t("profile.myCart")}</h2>

      <div className="products">
        {basketItems.length === 0 ? (
          <div className="no-products">{t("profile.emptyCart")}</div>
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
                  onError={(e) => (e.currentTarget.src = "/img/placeholder.png")}
                />
                <div className="name">{product.name}</div>
                <div className="nalichie">
                  {t("profile.availability")}:{" "}
                  <span>{product.count > 0 ? t("profile.inStock") : t("profile.outOfStock")}</span>
                </div>
                <div className="cost">
                  {t("profile.price")}: <span>{product.price} $</span>
                </div>
                <div className="buttons">
                  <button className="button-s" onClick={() => removeFromCart(product.id)}>
                    <i className="fa-solid fa-box"></i>
                  </button>
                  <button className="button-s" onClick={() => buyOne(product.id)}>
                    {t("profile.buy")}
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