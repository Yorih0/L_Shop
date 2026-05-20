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
  tags?: string[];
}

interface BasketItems {
  id: number;
  name: string;
}

interface User {
  id: number;
  login: string;
}

interface UserTag {
  tag: string;
  score: number;
  lastUsed: number;
}

interface Review {
  id: number,
  userId: number;
  userName: string;
  productId: number;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  date: string;
}

export default function ShopForm() {
  const { t } = useTranslation();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [cart, setCart] = useState<BasketItems[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [userTags, setUserTags] = useState<UserTag[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const [sortValue, setSortValue] = useState(t("shop.sort"));
  const [filterValue, setFilterValue] = useState(t("shop.filter"));
  const [deffilter, setdef] = useState(t("shop.filter"));

  const [selectedSort, setSelectedSort] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const { category } = useParams<{ category: string }>();

  const [liked, setLiked] = useState<number[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState<Number>(5);



  // 🌐 обновление переводов
  useEffect(() => {
    setSortValue(t("shop.sort"));
    setFilterValue(t("shop.filter"));
    setdef(t("shop.filter"));
  }, [t]);

  // 👤 USER
  useEffect(() => {
    axios.get("http://localhost:5000/api/users/me", { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // 🛍️ PRODUCTS
  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(() => setError(t("shop.loadError")))
      .finally(() => setLoading(false));
  }, [t]);

  // 🛒 CART
  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:5000/api/basket/${user.id}`, {
        withCredentials: true
      })
        .then(res => setCart(res.data))
        .catch(() => setCart([]));
    } else if (!loading) {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(saved);
    }
  }, [user, loading]);

  // 📂 фильтр по URL
  useEffect(() => {
    if (category) {
      setSelectedFilter(category);
      setFilterValue(category);
    } else {
      setSelectedFilter(null);
      setFilterValue(deffilter);
    }
  }, [category]);


  // 🔍 FILTER + SORT
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

  // 🧠 LOAD TAGS + DECAY
  useEffect(() => {
    const saved: UserTag[] = JSON.parse(localStorage.getItem("userTags") || "[]");

    const DAY = 1000 * 60 * 60 * 24;

    const decayed = saved.map(t => {
      const days = (Date.now() - (t.lastUsed || Date.now())) / DAY;
      const decay = Math.exp(-0.5 * days);

      return {
        ...t,
        score: t.score * decay
      };
    });

    setUserTags(decayed);
    localStorage.setItem("userTags", JSON.stringify(decayed));
  }, []);

  // 🎯 RECOMMENDATIONS
  useEffect(() => {
    if (userTags.length === 0) return;

    axios.post("http://localhost:5000/api/products/recommendations", {
      tags: userTags
    })
      .then(res => setRecommended(res.data))
      .catch(() => setRecommended([]));
  }, [userTags]);

  // 🛒 CART TOGGLE
  const toggleCart = async (id: number, name: string) => {
    const product = products.find(p => p.id === id);

    let updated: BasketItems[];

    if (cart.some(item => item.id === id)) {
      updated = cart.filter(item => item.id !== id);
    } else {
      updated = [...cart, { id, name }];
    }

    setCart(updated);

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

  // 💰 BUY
  const buy = (id: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    alert(`${t("shop.bought")}: ${product.name} 🎉`);
  };

  // 🎛 UI handlers
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

  // 🔀 MIX RECOMMENDATIONS
  const mixedProducts: Product[] = [];
  const usedIds = new Set<number>();

  let recIndex = 0;

  for (let i = 0; i < filteredProducts.length; i++) {
    if (i % 4 === 0 && recommended[recIndex]) {
      const rec = recommended[recIndex];

      if (!usedIds.has(rec.id)) {
        mixedProducts.push(rec);
        usedIds.add(rec.id);
      }

      recIndex++;
    }

    const product = filteredProducts[i];

    if (!usedIds.has(product.id)) {
      mixedProducts.push(product);
      usedIds.add(product.id);
    }
  }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("liked") || "[]");
    setLiked(saved);
  }, []);

  const toggleLike = (product: Product) => {
    let updatedLikes: number[];

    if (liked.includes(product.id)) {
      updatedLikes = liked.filter(id => id !== product.id);
    } else {
      updatedLikes = [...liked, product.id];
    }

    setLiked(updatedLikes);
    localStorage.setItem("liked", JSON.stringify(updatedLikes));

    updateTagsFromLikes(updatedLikes);
  };

  const updateTagsFromLikes = (likedIds: number[]) => {
    const now = Date.now();
    const updated: UserTag[] = [];

    likedIds.forEach(id => {
      const product = products.find(p => p.id === id);
      if (!product?.tags) return;

      product.tags.forEach(tag => {
        const existing = updated.find(t => t.tag === tag);

        if (existing) {
          existing.score += 2;
          existing.lastUsed = now;
        } else {
          updated.push({
            tag,
            score: 2,
            lastUsed: now
          });
        }
      });
    });

    setUserTags(updated);
    localStorage.setItem("userTags", JSON.stringify(updated));
  };

  const openComments = async (product: Product) => {
    setSelectedProduct(product);

    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${product.id}`);
      setReviews(res.data);
    } catch {
      setReviews([]);
    }
  };

  const closeComments = () => {
    setSelectedProduct(null);
  };

  const createComment = async () => {
    if (!user || !selectedProduct) {
      alert("Нужо зарегистироваться");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/reviews/${selectedProduct.id}`,
        {
          userId: user.id,
          rating: commentRating,
          comment: commentText,
        }
      );

      setReviews(prev => [...prev, res.data]);

    } catch (e) {
      console.log("Ошибка создания");
    }
  };

  const deleteComment = async (reviewId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`);

      setReviews(prev => prev.filter(r => r.id !== reviewId));

    } catch (e) {
      console.log("Ошибка удаления");
    }
  };

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("liked") || "[]");
    setLiked(savedLikes);

    if (products.length > 0) {
      updateTagsFromLikes(savedLikes);
    }
  }, [products]);

  // 👆 закрытие dropdown
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
        {mixedProducts.length === 0 ? (
          <div className="no-products">{t("shop.noProducts")}</div>
        ) : (
          mixedProducts.map(product => (
            <div className="cart" key={product.id} onClick={() => openComments(product)}>
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
                <button className="button-s" onClick={() => toggleLike(product)}>
                  {liked.includes(product.id) ? <i className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedProduct && (
        <div className="modal-overlay" onClick={closeComments}>

          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <h2>{selectedProduct.name}</h2>
            <div className="reviews">
              {reviews.length === 0 ? (
                <p>{t("shop.noReviews")}</p>
              ) : (
                reviews.map((r, i) => (
                  <div key={i} className="review">

                    <div className="review-header">
                      <span className="user">{r.userName}</span>
                      <span className="user">{r.date}</span>
                      <span className="stars">
                        {[...Array(r.rating)].map((_, idx) => (
                          <i key={idx} className="fa-regular fa-star"></i>
                        ))}
                      </span>
                    </div>

                    <div className="text">{r.comment}</div>
                    {user?.id === r.userId && (
                      <button
                        className="button-s"
                        onClick={() => deleteComment(r.id)}
                      >
                        {t("shop.btn_delete")}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="input-zone">
              <textarea
                className="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t("shop.placeholderComments")}
                autoComplete={"off"}
                rows={3}
              />
              <span className="rating-text">{t("shop.rating_text")} : &nbsp;
                {[...Array(commentRating)].map((_, i) => (
                  <i key={i} className="fa-regular fa-star"></i>
                ))}
              </span>
              <input
                className="rating-input"
                type="range"
                min="1"
                max="5"
                value={String(commentRating)}
                onChange={(e) => setCommentRating(Number(e.target.value))}
              />
              <div className="buttons">
                <button className="button-s" onClick={closeComments}>{t("shop.btn_close")}</button>
                <button className="button-s" onClick={createComment}>{t("shop.btn_createComments")}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}