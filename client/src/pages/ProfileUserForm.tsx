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
  tags?: string[];
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

  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [likedItems, setLikedItems] = useState<Product[]>([]);

  const [activeTab, setActiveTab] = useState<"cart" | "liked">("cart");

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/users/me", {
          withCredentials: true
        });

        setUser(userRes.data);

        const prodRes = await axios.get("http://localhost:5000/api/products");
        setProducts(prodRes.data);

        const cartRes = await axios.get(
          `http://localhost:5000/api/basket/${userRes.data.id}`,
          { withCredentials: true }
        );

        setBasketItems(cartRes.data);

        const savedLikes = JSON.parse(localStorage.getItem("liked") || "[]");
        setLikedIds(savedLikes);

        setLoading(false);
      } catch (err) {
        console.error(err);
        window.location.href = "/login";
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const likedProducts = products.filter(p =>
        likedIds.includes(p.id)
      );
      setLikedItems(likedProducts);
    }
  }, [products, likedIds]);

  const toggleLike = (product: Product) => {
    let updated: number[];

    if (likedIds.includes(product.id)) {
      updated = likedIds.filter(id => id !== product.id);
    } else {
      updated = [...likedIds, product.id];
    }

    setLikedIds(updated);
    localStorage.setItem("liked", JSON.stringify(updated));

    const likedProducts = products.filter(p =>
      updated.includes(p.id)
    );
    setLikedItems(likedProducts);
  };

  const removeFromCart = async (id: number) => {
    const updated = basketItems.filter(i => i.id !== id);
    setBasketItems(updated);

    if (user?.id) {
      await axios.post(
        `http://localhost:5000/api/basket/${user.id}/update`,
        updated,
        { withCredentials: true }
      );
    } else {
      localStorage.setItem("cart", JSON.stringify(updated));
    }
  };

  const buyOne = (id: number) => {
    const item = basketItems.find(i => i.id === id);
    if (!item) return;

    alert(`${t("profile.bought")} ${item.name}`);

    removeFromCart(id);
  };

  const buyAll = async () => {
    if (basketItems.length === 0) {
      alert(t("profile.emptyCart"));
      return;
    }

    alert(t("profile.orderSuccess"));
    setBasketItems([]);

    if (user?.id) {
      await axios.post(
        `http://localhost:5000/api/basket/${user.id}/update`,
        [],
        { withCredentials: true }
      );
    } else {
      localStorage.removeItem("cart");
    }
  };

  const logout = async () => {
    await axios.post(
      "http://localhost:5000/api/users/logout",
      {},
      { withCredentials: true }
    );

    localStorage.removeItem("cart");
    window.location.href = "/login";
  };

  const cartTotal = basketItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product?.price || 0);
  }, 0);

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
            <h2>{user?.login}</h2>
            <button className="logout-btn" onClick={logout}>
              {t("profile.logout")}
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
              <div>{t("profile.cartItems")}</div>
              <div>{basketItems.length}</div>
            </div>

            <div className="stat-cart">
              <div>{t("profile.totalAmount")}</div>
              <div>{cartTotal} $</div>
            </div>

            {basketItems.length > 0 && (
              <button className="logout-btn" onClick={buyAll}>
                {t("profile.buyAll")}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className="logout-btn" onClick={() => setActiveTab("cart")}>
          {t("profile.liked-btn")}
        </button>

        <button className="logout-btn" onClick={() => setActiveTab("liked")}>
          {t("profile.corzina-btn")}
        </button>
      </div>

      <div className="products">
        {activeTab === "cart" ? (
          basketItems.length === 0 ? (
            <div className="no-products">{t("profile.emptyCart")}</div>
          ) : (
            basketItems.map(item => {
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
                    {t("shop.availability")}:{" "}
                    <span>
                      {product.count > 0
                        ? t("shop.inStock")
                        : t("shop.outOfStock")}
                    </span>
                  </div>

                  <div className="cost">
                    {t("shop.price")}: <span>{product.price} $</span>
                  </div>

                  <div className="buttons">
                    <button className="logout-btn" onClick={() => removeFromCart(product.id)}>
                      <i className="fa-solid fa-box"></i>
                    </button>

                    <button className="logout-btn" onClick={() => buyOne(product.id)}>
                      {t("shop.buy")}
                    </button>

                    <button className="logout-btn" onClick={() => toggleLike(product)}>
                      {likedIds.includes(product.id) ? (
                        <i className="fa-solid fa-heart"></i>
                      ) : (
                        <i className="fa-regular fa-heart"></i>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )
        ) : likedItems.length === 0 ? (
          <div className="no-products">Нет лайкнутых товаров</div>
        ) : (
          likedItems.map(product => (
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
                {t("shop.availability")}:{" "}
                <span>
                  {product.count > 0
                    ? t("shop.inStock")
                    : t("shop.outOfStock")}
                </span>
              </div>

              <div className="cost">
                {t("shop.price")}: <span>{product.price} $</span>
              </div>

              <div className="buttons">
                <button className="logout-btn" onClick={() => removeFromCart(product.id)}>
                  <i className="fa-solid fa-box"></i>
                </button>

                <button className="logout-btn" onClick={() => buyOne(product.id)}>
                  {t("shop.buy")}
                </button>

                <button className="logout-btn" onClick={() => toggleLike(product)}>
                  {likedIds.includes(product.id) ? (
                    <i className="fa-solid fa-heart"></i>
                  ) : (
                    <i className="fa-regular fa-heart"></i>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}