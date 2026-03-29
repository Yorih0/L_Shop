import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<BasketItems[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortValue, setSortValue] = useState(t("shop.sort"));
  const [filterValue, setFilterValue] = useState(t("shop.filter"));
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const { category } = useParams<{ category: string }>();

  useEffect(() => {
    setSortValue(t("shop.sort"));
    setFilterValue(t("shop.filter"));
  }, [t]);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/me", {
          withCredentials: true
        });
        setUser(response.data);
      } catch (error) {
        console.error(t("shop.userNotAuth"), error);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch {
        setError(t("shop.loadError"));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    if (user?.id) {
      axios.get(`http://localhost:5000/api/basket/${user.id}`, {
        withCredentials: true
      })
        .then(res => setCart(res.data))
        .catch(() => setCart([]));
    } else if (user === null && !loading) {
      const saved: BasketItems[] = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(saved);
    }
  }, [user, t]);

  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilter && selectedFilter !== "all") {
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
        await axios.post(
          `http://localhost:5000/api/basket/${user.id}/update`,
          updated,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          }
        );
      } catch (err: any) {
        console.error(t("shop.basketUpdateError"), err);
        const res = await axios.get(`http://localhost:5000/api/basket/${user.id}`, {
          withCredentials: true
        });
        setCart(res.data);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updated));
    }
  };

  const buy = (id: number) => {
    const product = products.find(p => p.id === id);
    if (!product) {
      alert(t("shop.productNotFound"));
      return;
    }
    alert(`${t("shop.bought")}: ${product.name} 🎉`);
  };

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

  if (loading) return <div className="loading">{t("shop.loading")}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="controls">
        <div className="find-line">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            id="search_apple_items"
            placeholder={t("shop.search")}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="selectors">
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
                <div onClick={() => handleSort("", t("shop.sort"))}>{t("shop.sort")}</div>
                <div onClick={() => handleSort("price", t("shop.priceAsc"))}>{t("shop.priceAsc")}</div>
                <div onClick={() => handleSort("price_desc", t("shop.priceDesc"))}>{t("shop.priceDesc")}</div>
                <div onClick={() => handleSort("name", t("shop.nameAsc"))}>{t("shop.nameAsc")}</div>
                <div onClick={() => handleSort("name_desc", t("shop.nameDesc"))}>{t("shop.nameDesc")}</div>
              </div>
            )}
          </div>

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
                <div onClick={() => handleFilter("", t("shop.all"))}>{t("shop.all")}</div>
                <div onClick={() => handleFilter("iphone", "iPhone")}>iPhone</div>
                <div onClick={() => handleFilter("macbook", "Macbook")}>Macbook</div>
                <div onClick={() => handleFilter("ipad", "iPad")}>iPad</div>
                <div onClick={() => handleFilter("watch", "Watch")}>Watch</div>
                <div onClick={() => handleFilter("airpods", "AirPods")}>AirPods</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="products">
        {filteredProducts.length === 0 ? (
          <div className="no-products">{t("shop.noProducts")}</div>
        ) : (
          filteredProducts.map(product => (
            <div className="cart" key={product.id}>
              <img
                src={product.image}
                alt={product.name}
                className="img"
                onError={e => (e.currentTarget.src = "/img/placeholder.png")}
              />
              <div className="name">{product.name}</div>
              <div className="nalichie">
                {t("shop.availability")}:{" "}
                <span>{product.count > 0 ? t("shop.inStock") : t("shop.outOfStock")}</span>
              </div>
              <div className="cost">
                {t("shop.price")}: <span>{product.price} $</span>
              </div>
              <div className="buttons">
                <button className="button-s" onClick={() => toggleCart(product.id, product.name)}>
                  {cart.some(item => item.id === product.id) ? (
                    <i className="fa-solid fa-box"></i>
                  ) : (
                    <i className="fa-solid fa-box-open"></i>
                  )}
                </button>
                <button className="button-s" onClick={() => buy(product.id)}>
                  {t("shop.buy")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}