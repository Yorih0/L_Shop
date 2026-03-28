import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./css/shop.css";

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
}

export default function ShopForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<BasketItems[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const [sortValue, setSortValue] = useState("Сортировка");
  const [filterValue, setFilterValue] = useState("Фильтрация");

  const [selectedSort, setSelectedSort] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const { category } = useParams<{ category: string }>();

  // 🔹 Получение текущего пользователя из cookie
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/me", {
          withCredentials: true // Важно для отправки cookie
        });
        setUser(response.data);
      } catch (error) {
        console.error("Пользователь не авторизован", error);
        setUser(null);
      }
    };
    
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (category) {
      setSelectedFilter(category);
      setFilterValue(category);
    }
  }, [category]);

  // 🔹 загрузка данных
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch {
        setError("Ошибка загрузки товаров");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    // Ждем загрузки пользователя
    if (user?.id) {
      // загрузка корзины с сервера
      axios.get(`http://localhost:5000/api/basket/${user.id}`, {
        withCredentials: true
      })
        .then(res => setCart(res.data))
        .catch(() => setCart([]));
    } else if (user === null && !loading) {
      // локальная корзина для неавторизованных
      const saved: BasketItems[] = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(saved);
    }
  }, [user]); // Зависимость от user

  // 🔹 фильтрация + сортировка
  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilter) {
      if (selectedFilter != "all")
        result = result.filter(p => p.category === selectedFilter);
    }

    if (selectedSort) {
      switch (selectedSort) {
        case "price":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "name":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name_desc":
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedFilter, selectedSort]);

  // 🔹 закрытие dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 🔹 корзина
  const toggleCart = async (id: number, name: string) => {
    let updated: BasketItems[];

    if (cart.some(item => item.id === id)) {
      updated = cart.filter(item => item.id !== id);
    } else {
      updated = [...cart, { id, name }];
    }

    setCart(updated);

    if (user?.id) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/basket/${user.id}/update`,
          updated,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true // Важно для отправки cookie
          }
        );
        console.log("Basket updated successfully:", response.data);
      } catch (err: any) {
        console.error("Ошибка сохранения корзины на сервере", err);

        // Log more details about the error
        if (err.response) {
          console.error("Server response:", err.response.data);
          console.error("Server status:", err.response.status);
          console.error("Server headers:", err.response.headers);
        }

        // Revert the cart state if server save fails
        try {
          const res = await axios.get(`http://localhost:5000/api/basket/${user.id}`, {
            withCredentials: true
          });
          setCart(res.data);
        } catch {
          // If that fails, reload from localStorage as fallback
          const saved: BasketItems[] = JSON.parse(localStorage.getItem("cart") || "[]");
          setCart(saved);
        }
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updated));
    }
  };

  const buy = (id: number) => {
    const product = products.find(p => p.id === id);

    if (!product) {
      alert("Товар не найден");
      return;
    }

    alert(`Вы купили: ${product.name} 🎉`);
  };

  // 🔹 UI обработчики
  const handleSort = (value: string, label: string) => {
    setSelectedSort(value);
    setSortValue(label);
    setSortOpen(false);
  };

  const handleFilter = (value: string, label: string) => {
    setSelectedFilter(value);
    setFilterValue(label);
    setFilterOpen(false);
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="controls">
        {/* 🔍 поиск */}
        <div className="find-line">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            id="search_apple_items"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="selectors">
          {/* 🔽 сортировка */}
          <div className="selection dropdown" ref={sortRef}>
            <div
              className="dropdown-btn"
              onClick={() => {
                setSortOpen(!sortOpen);
                setFilterOpen(false);
              }}
            >
              {sortValue}
            </div>

            {sortOpen && (
              <div className="dropdown-menu">
                <div onClick={() => handleSort("", "Сортировка")}>
                  Сортировка
                </div>
                <div onClick={() => handleSort("price", "Цена ↑")}>
                  Цена ↑
                </div>
                <div onClick={() => handleSort("price_desc", "Цена ↓")}>
                  Цена ↓
                </div>
                <div onClick={() => handleSort("name", "Название ↑")}>
                  Название ↑
                </div>
                <div onClick={() => handleSort("name_desc", "Название ↓")}>
                  Название ↓
                </div>
              </div>
            )}
          </div>

          {/* 🔽 фильтр */}
          <div className="selection dropdown" ref={filterRef}>
            <div
              className="dropdown-btn"
              onClick={() => {
                setFilterOpen(!filterOpen);
                setSortOpen(false);
              }}
            >
              {filterValue}
            </div>

            {filterOpen && (
              <div className="dropdown-menu">
                <div onClick={() => handleFilter("", "Фильтрация")}>
                  Все
                </div>
                <div onClick={() => handleFilter("iphone", "iPhone")}>
                  iPhone
                </div>
                <div onClick={() => handleFilter("mac", "Mac")}>
                  Mac
                </div>
                <div onClick={() => handleFilter("ipad", "iPad")}>
                  iPad
                </div>
                <div onClick={() => handleFilter("watch", "Watch")}>
                  Watch
                </div>
                <div onClick={() => handleFilter("airpods", "AirPods")}>
                  AirPods
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🛒 товары */}
      <div className="products">
        {filteredProducts.length === 0 ? (
          <div className="no-products">Ничего не найдено</div>
        ) : (
          filteredProducts.map(product => (
            <div className="cart" key={product.id}>
              <img
                src={product.image}
                alt={product.name}
                className="img"
                onError={e =>
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
                  onClick={() => toggleCart(product.id, product.name)}
                >
                  {cart.some(item => item.id === product.id) ? (
                    <i className="fa-solid fa-box"></i>
                  ) : (
                    <i className="fa-solid fa-box-open"></i>
                  )}
                </button>

                <button className="button-s"
                  onClick={() => buy(product.id)}>Купить</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}