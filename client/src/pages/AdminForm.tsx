import { useEffect, useState } from "react";
import "./css/profile.css";
import "./css/admin.css";
import axios from "axios";
import { useTranslation } from "react-i18next";

interface Product {
  id: number
  name: string
  price: number
  count: number
  category: 'iphone' | 'ipad' | 'mac' | 'watch' | 'airpods' | 'accessories' | 'TV'
  image: string
  tags?: string[]
}

interface User {
  id: number;
  login: string;
  phone?: string;
  role: string;
}

export default function AdminForm() {
  const { t } = useTranslation();

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "users">("products");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    count: "",
    category: "",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyBdJ7OiVmdyCSCf5xa04RzoGAGu_C7GZ_Cg&s",
    tags: ""
  });

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/users/me", {
          withCredentials: true
        });
        if (userRes.data.role !== "admin" && userRes.data.role !== "manager") {
          window.location.href = "/profile/user";
          return;
        }
        setUser(userRes.data);
        const prodRes = await axios.get("http://localhost:5000/api/products");
        setProducts(prodRes.data);

        if (userRes.data.role === "admin") {
          const usersRes = await axios.post("http://localhost:5000/api/users/all", {
            withCredentials: true
          });
          setUsers(usersRes.data);
        }

        setLoading(false);
      } catch (err) {
        alert(t("admin.error_exit"))
        window.location.href = "/login";
      }
    };
    init();
  }, [t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      count: "",
      category: "",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyBdJ7OiVmdyCSCf5xa04RzoGAGu_C7GZ_Cg&s",
      tags: ""
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      count: product.count.toString(),
      category: product.category || "",
      image: product.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyBdJ7OiVmdyCSCf5xa04RzoGAGu_C7GZ_Cg&s",
      tags: product.tags?.join(", ") || ""
    });
    setShowProductForm(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      count: parseInt(formData.count),
      category: formData.category,
      image: formData.image,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
    };

    try {
      if (editingProduct) {
        const res = await axios.patch(
          `http://localhost:5000/api/products/${editingProduct.id}`,
          productData,
          { withCredentials: true }
        );
        setProducts(products.map(p => p.id === editingProduct.id ? res.data : p));
      } else {
        const res = await axios.put(
          "http://localhost:5000/api/products",
          productData,
          { withCredentials: true }
        );
        setProducts([...products, res.data]);
      }
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
      alert(t("admin.saveError"));
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm(t("admin.confirmDelete"))) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        withCredentials: true
      });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(t("admin.deleteError"));
    }
  };

  const handleChangeRole = async (userId: number, newRole: string) => {

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );

      const data = res.data;
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      console.log("Успех:", data);
    } catch (err:any) {
      console.error("Error changing role:", err);
      if (err.response?.data?.message) {
        console.log("Ошибка:", err.response.data.message);
      }
      alert(t("admin.roleChangeError"));
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

  const getRoleName = (role: string) => {
    switch (role) {
      case "admin": return t("profile.admin");
      case "manager": return t("admin.manager");
      case "buyer": return t("profile.buyer");
      default: return role;
    }
  };
  if (loading) {
    return <div className="loading">{t("profile.loading")}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          <i className="fas fa-user-shield"></i>
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
              <span className="role-badge admin">
                {getRoleName(user?.role || "")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          <i className="fas fa-box"></i> {t("admin.manageProducts")}
        </button>

        {user?.role === "admin" && (
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <i className="fas fa-users"></i> {t("admin.manageUsers")}
          </button>
        )}
      </div>

      {activeTab === "products" && (
        <>
          <div className="admin-actions">
            <button
              className="logout-btn"
              onClick={() => setShowProductForm(!showProductForm)}
            >
              {showProductForm ? t("admin.cancel") : t("admin.addProduct")}
            </button>
          </div>

          {showProductForm && (
            <div className="product-form-container">
              <h3>{editingProduct ? t("admin.editProduct") : t("admin.newProduct")}</h3>
              <form onSubmit={handleSubmitProduct} className="product-form">
                <div className="form-group">
                  <label>{t("admin.productName")}:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t("admin.price")} ($):</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t("admin.quantity")}:</label>
                  <input
                    type="number"
                    name="count"
                    value={formData.count}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t("admin.category")}:</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>{t("admin.imageUrl")}:</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>{t("admin.tags")}:</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="logout-btn">
                    {editingProduct ? t("admin.save") : t("admin.add")}
                  </button>
                  <button type="button" className="logout-btn" onClick={resetForm}>
                    {t("admin.cancel")}
                  </button>
                </div>
              </form>
            </div>
          )}

          {!showProductForm && (
            <div className="products">
              {products.length === 0 ? (
                <div className="no-products">{t("admin.noProducts")}</div>
              ) : (
                products.map(product => (
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
                      <span>
                        {product.count > 0 ? `${product.count} ${t("admin.pieces")}` : t("profile.outOfStock")}
                      </span>
                    </div>

                    <div className="cost">
                      {t("profile.price")}: <span>{product.price} $</span>
                    </div>

                    {product.category && (
                      <div className="category">
                        {t("admin.category")}: {product.category}
                      </div>
                    )}

                    <div className="buttons">
                      <button
                        className="control-btn"
                        onClick={() => handleEditProduct(product)}
                      >
                        <i className="fas fa-edit"></i> {t("admin.edit")}
                      </button>
                      <button
                        className="control-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <i className="fas fa-trash"></i> {t("admin.delete")}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>)}
        </>
      )}

      {activeTab === "users" && user?.role === "admin" && (
        <div className="users-section">
          <h3>{t("admin.userManagement")}</h3>
          <div className="users-list">
            {users.map(u => (
              u.id !== user?.id ?
                <div className="user-item" key={u.id}>
                  <div className="user-info">
                    <div className="name">{u.login}</div>
                    <div className="phone">{u.phone || t("profile.notSpecified")}</div>
                  </div>

                  <div className="user-role">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u.id, e.target.value)}
                      disabled={u.id === user?.id}
                    >
                      <option value="buyer">{t("profile.buyer")}</option>
                      <option value="manager">{t("admin.manager")}</option>
                    </select>
                  </div>
                </div>
                : null
            ))}
          </div>
        </div>
      )}
    </div>
  );
}