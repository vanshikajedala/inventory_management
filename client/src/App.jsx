import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { apiRequest } from "./api";
import "./App.css";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/products", label: "Products" },
  { path: "/suppliers", label: "Suppliers" },
  { path: "/inventory", label: "Inventory" },
  { path: "/orders", label: "Orders" },
];

const emptyProduct = {
  name: "",
  sku: "",
  quantity: 0,
  price: 0,
  lowStockThreshold: 10,
  description: "",
  supplierId: "",
};

const emptySupplier = {
  name: "",
  email: "",
  phone: "",
};

function ProtectedRoute({ token }) {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function AuthPage({ mode, onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await onSubmit(mode, form);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-card">
        <h1>Simple Inventory Manager</h1>
        <p className="sub">Spring Boot API connected frontend</p>
        <form onSubmit={submit} className="grid two">
          {mode === "signup" ? (
            <label>
              Name
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </label>
          ) : null}
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
          </label>
          <button className="btn primary" disabled={busy}>
            {busy ? "Please wait" : mode}
          </button>
        </form>
        <div className="row">
          <NavLink className="btn ghost" to={mode === "login" ? "/signup" : "/login"}>
            Switch to {mode === "login" ? "signup" : "login"}
          </NavLink>
          <span className="hint">Default admin: admin@inventory.local / admin123</span>
        </div>
        {message ? <p className="note">{message}</p> : null}
      </section>
    </div>
  );
}

function Layout({ user, onRefresh, onLogout, message }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h2>Inventory Console</h2>
          <p>
            {user.name} ({user.role})
          </p>
        </div>
        <div className="row">
          <button className="btn" onClick={onRefresh}>
            Refresh
          </button>
          <button className="btn ghost" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="tabs">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {message ? <div className="banner">{message}</div> : null}
      <Outlet />
    </div>
  );
}

function DashboardPage({ dashboard, onLoadLowStock }) {
  const navigate = useNavigate();

  async function handleLowStock() {
    await onLoadLowStock();
    navigate("/products");
  }

  if (!dashboard) {
    return <section className="panel">Loading dashboard...</section>;
  }

  return (
    <section className="cards">
      <article className="card accent-a">
        <h3>Total Products</h3>
        <p>{dashboard.totalProducts}</p>
      </article>
      <article className="card accent-b">
        <h3>Total Suppliers</h3>
        <p>{dashboard.totalSuppliers}</p>
      </article>
      <article className="card accent-c">
        <h3>Low Stock Items</h3>
        <p>{dashboard.lowStockProducts}</p>
      </article>
      <article className="card accent-d">
        <h3>Inventory Value</h3>
        <p>Rs {dashboard.inventoryValue}</p>
      </article>
      <button className="btn" onClick={handleLowStock}>
        Show Low Stock Products
      </button>
    </section>
  );
}

function ProductsPage({
  products,
  search,
  setSearch,
  supplierOptions,
  productForm,
  setProductForm,
  editProductId,
  setEditProductId,
  onSearchProducts,
  reloadProducts,
  saveProduct,
  deleteProduct,
}) {
  return (
    <section className="panel">
      <h3>Product Management</h3>
      <form className="row" onSubmit={onSearchProducts}>
        <input
          placeholder="Search by product name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn">Search</button>
        <button type="button" className="btn ghost" onClick={() => reloadProducts()}>
          Reset
        </button>
      </form>

      <form className="grid three" onSubmit={saveProduct}>
        <input
          placeholder="Name"
          value={productForm.name}
          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
          required
        />
        <input
          placeholder="SKU"
          value={productForm.sku}
          onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={productForm.quantity}
          onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={productForm.price}
          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Low stock threshold"
          value={productForm.lowStockThreshold}
          onChange={(e) => setProductForm({ ...productForm, lowStockThreshold: e.target.value })}
          required
        />
        <select
          value={productForm.supplierId}
          onChange={(e) => setProductForm({ ...productForm, supplierId: e.target.value })}
        >
          <option value="">No Supplier</option>
          {supplierOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          className="wide"
          placeholder="Description"
          value={productForm.description}
          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
        />
        <button className="btn primary">{editProductId ? "Update Product" : "Add Product"}</button>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Supplier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.quantity}</td>
                <td>{p.price}</td>
                <td>{p.supplier?.name || "-"}</td>
                <td className="row">
                  <button
                    className="btn"
                    onClick={() => {
                      setEditProductId(p.id);
                      setProductForm({
                        name: p.name,
                        sku: p.sku,
                        quantity: p.quantity,
                        price: p.price,
                        lowStockThreshold: p.lowStockThreshold,
                        description: p.description || "",
                        supplierId: p.supplier?.id ? String(p.supplier.id) : "",
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn ghost" onClick={() => deleteProduct(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SuppliersPage({ suppliers, supplierForm, setSupplierForm, editSupplierId, setEditSupplierId, saveSupplier, deleteSupplier }) {
  return (
    <section className="panel">
      <h3>Supplier Management</h3>
      <form className="grid three" onSubmit={saveSupplier}>
        <input
          placeholder="Supplier Name"
          value={supplierForm.name}
          onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={supplierForm.email}
          onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
          required
        />
        <input
          placeholder="Phone"
          value={supplierForm.phone}
          onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
          required
        />
        <button className="btn primary">{editSupplierId ? "Update Supplier" : "Add Supplier"}</button>
      </form>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td className="row">
                  <button
                    className="btn"
                    onClick={() => {
                      setEditSupplierId(s.id);
                      setSupplierForm({ name: s.name, email: s.email, phone: s.phone });
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn ghost" onClick={() => deleteSupplier(s.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InventoryPage({ products, stockInForm, setStockInForm, stockOutForm, setStockOutForm, runInventory }) {
  return (
    <section className="panel split">
      <div>
        <h3>Stock In</h3>
        <form
          className="grid"
          onSubmit={(e) => {
            e.preventDefault();
            runInventory("/api/inventory/stock-in", stockInForm, () =>
              setStockInForm({ productId: "", quantity: 1, notes: "" })
            );
          }}
        >
          <select
            value={stockInForm.productId}
            onChange={(e) => setStockInForm({ ...stockInForm, productId: e.target.value })}
            required
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Qty: {p.quantity})
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={stockInForm.quantity}
            onChange={(e) => setStockInForm({ ...stockInForm, quantity: e.target.value })}
            required
          />
          <input
            placeholder="Notes"
            value={stockInForm.notes}
            onChange={(e) => setStockInForm({ ...stockInForm, notes: e.target.value })}
          />
          <button className="btn primary">Apply Stock In</button>
        </form>
      </div>
      <div>
        <h3>Stock Out</h3>
        <form
          className="grid"
          onSubmit={(e) => {
            e.preventDefault();
            runInventory("/api/inventory/stock-out", stockOutForm, () =>
              setStockOutForm({ productId: "", quantity: 1, notes: "" })
            );
          }}
        >
          <select
            value={stockOutForm.productId}
            onChange={(e) => setStockOutForm({ ...stockOutForm, productId: e.target.value })}
            required
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Qty: {p.quantity})
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={stockOutForm.quantity}
            onChange={(e) => setStockOutForm({ ...stockOutForm, quantity: e.target.value })}
            required
          />
          <input
            placeholder="Notes"
            value={stockOutForm.notes}
            onChange={(e) => setStockOutForm({ ...stockOutForm, notes: e.target.value })}
          />
          <button className="btn primary">Apply Stock Out</button>
        </form>
      </div>
    </section>
  );
}

function OrdersPage({ products, suppliers, orderForm, setOrderForm, createOrder, orders, updateOrderStatus }) {
  return (
    <section className="panel">
      <h3>Purchase Orders</h3>
      <form className="grid three" onSubmit={createOrder}>
        <select
          value={orderForm.productId}
          onChange={(e) => setOrderForm({ ...orderForm, productId: e.target.value })}
          required
        >
          <option value="">Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={orderForm.supplierId}
          onChange={(e) => setOrderForm({ ...orderForm, supplierId: e.target.value })}
          required
        >
          <option value="">Supplier</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={orderForm.quantity}
          onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
          required
        />
        <button className="btn primary">Create Order</button>
      </form>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Supplier</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.product?.name}</td>
                <td>{o.supplier?.name}</td>
                <td>{o.quantity}</td>
                <td>{o.status}</td>
                <td className="row">
                  <button className="btn" onClick={() => updateOrderStatus(o.id, "APPROVED")}>
                    Approve
                  </button>
                  <button className="btn" onClick={() => updateOrderStatus(o.id, "RECEIVED")}>
                    Receive
                  </button>
                  <button className="btn ghost" onClick={() => updateOrderStatus(o.id, "CANCELLED")}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("inventory_token") || "");
  const [user, setUser] = useState({
    name: localStorage.getItem("inventory_name") || "",
    email: localStorage.getItem("inventory_email") || "",
    role: localStorage.getItem("inventory_role") || "",
  });

  const [message, setMessage] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editProductId, setEditProductId] = useState(null);
  const [supplierForm, setSupplierForm] = useState(emptySupplier);
  const [editSupplierId, setEditSupplierId] = useState(null);
  const [stockInForm, setStockInForm] = useState({ productId: "", quantity: 1, notes: "" });
  const [stockOutForm, setStockOutForm] = useState({ productId: "", quantity: 1, notes: "" });
  const [orderForm, setOrderForm] = useState({ productId: "", supplierId: "", quantity: 1 });

  const supplierOptions = useMemo(
    () => suppliers.map((s) => ({ value: String(s.id), label: `${s.name} (#${s.id})` })),
    [suppliers]
  );

  useEffect(() => {
    if (token) {
      loadCoreData();
    }
  }, [token]);

  async function loadCoreData() {
    try {
      const [dash, productsData, suppliersData, ordersData] = await Promise.all([
        apiRequest("/api/dashboard/summary", { token }),
        apiRequest("/api/products", { token }),
        apiRequest("/api/suppliers", { token }),
        apiRequest("/api/orders", { token }),
      ]);
      setDashboard(dash);
      setProducts(productsData || []);
      setSuppliers(suppliersData || []);
      setOrders(ordersData || []);
    } catch (error) {
      setMessage(error.message);
    }
  }

  function persistAuth(payload) {
    localStorage.setItem("inventory_token", payload.token);
    localStorage.setItem("inventory_name", payload.name);
    localStorage.setItem("inventory_email", payload.email);
    localStorage.setItem("inventory_role", payload.role);
    setToken(payload.token);
    setUser({ name: payload.name, email: payload.email, role: payload.role });
  }

  async function authenticate(mode, form) {
    const path = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const body =
      mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
    const payload = await apiRequest(path, { method: "POST", body });
    persistAuth(payload);
  }

  function logout() {
    localStorage.removeItem("inventory_token");
    localStorage.removeItem("inventory_name");
    localStorage.removeItem("inventory_email");
    localStorage.removeItem("inventory_role");
    setToken("");
    setUser({ name: "", email: "", role: "" });
    setMessage("");
  }

  async function reloadProducts(q = "") {
    const query = q ? `?q=${encodeURIComponent(q)}` : "";
    const items = await apiRequest(`/api/products${query}`, { token });
    setProducts(items || []);
  }

  async function onSearchProducts(event) {
    event.preventDefault();
    try {
      await reloadProducts(search.trim());
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function onLoadLowStock() {
    const items = await apiRequest("/api/products/low-stock", { token });
    setProducts(items || []);
  }

  async function saveProduct(event) {
    event.preventDefault();
    setMessage("");
    try {
      const body = {
        ...productForm,
        quantity: Number(productForm.quantity),
        price: Number(productForm.price),
        lowStockThreshold: Number(productForm.lowStockThreshold),
        supplierId: productForm.supplierId ? Number(productForm.supplierId) : null,
      };
      if (editProductId) {
        await apiRequest(`/api/products/${editProductId}`, { method: "PUT", token, body });
      } else {
        await apiRequest("/api/products", { method: "POST", token, body });
      }
      setProductForm(emptyProduct);
      setEditProductId(null);
      await reloadProducts(search.trim());
      setDashboard(await apiRequest("/api/dashboard/summary", { token }));
      setMessage("Product saved.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteProduct(id) {
    try {
      await apiRequest(`/api/products/${id}`, { method: "DELETE", token });
      await reloadProducts(search.trim());
      setDashboard(await apiRequest("/api/dashboard/summary", { token }));
      setMessage("Product deleted.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function saveSupplier(event) {
    event.preventDefault();
    try {
      if (editSupplierId) {
        await apiRequest(`/api/suppliers/${editSupplierId}`, { method: "PUT", token, body: supplierForm });
      } else {
        await apiRequest("/api/suppliers", { method: "POST", token, body: supplierForm });
      }
      setSupplierForm(emptySupplier);
      setEditSupplierId(null);
      setSuppliers(await apiRequest("/api/suppliers", { token }));
      setDashboard(await apiRequest("/api/dashboard/summary", { token }));
      setMessage("Supplier saved.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteSupplier(id) {
    try {
      await apiRequest(`/api/suppliers/${id}`, { method: "DELETE", token });
      setSuppliers(await apiRequest("/api/suppliers", { token }));
      setDashboard(await apiRequest("/api/dashboard/summary", { token }));
      setMessage("Supplier deleted.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function runInventory(path, form, resetFn) {
    try {
      await apiRequest(path, {
        method: "POST",
        token,
        body: {
          productId: Number(form.productId),
          quantity: Number(form.quantity),
          notes: form.notes,
        },
      });
      await reloadProducts();
      setDashboard(await apiRequest("/api/dashboard/summary", { token }));
      resetFn();
      setMessage("Inventory updated.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function createOrder(event) {
    event.preventDefault();
    try {
      await apiRequest("/api/orders", {
        method: "POST",
        token,
        body: {
          productId: Number(orderForm.productId),
          supplierId: Number(orderForm.supplierId),
          quantity: Number(orderForm.quantity),
        },
      });
      setOrders(await apiRequest("/api/orders", { token }));
      setOrderForm({ productId: "", supplierId: "", quantity: 1 });
      setMessage("Order created.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function updateOrderStatus(id, status) {
    try {
      await apiRequest(`/api/orders/${id}/status?status=${status}`, { method: "PATCH", token });
      setOrders(await apiRequest("/api/orders", { token }));
      setMessage("Order status updated.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" onSubmit={authenticate} />} />
        <Route path="/signup" element={<AuthPage mode="signup" onSubmit={authenticate} />} />

        <Route element={<ProtectedRoute token={token} />}>
          <Route element={<Layout user={user} onRefresh={loadCoreData} onLogout={logout} message={message} />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={<DashboardPage dashboard={dashboard} onLoadLowStock={onLoadLowStock} />}
            />
            <Route
              path="/products"
              element={
                <ProductsPage
                  products={products}
                  search={search}
                  setSearch={setSearch}
                  supplierOptions={supplierOptions}
                  productForm={productForm}
                  setProductForm={setProductForm}
                  editProductId={editProductId}
                  setEditProductId={setEditProductId}
                  onSearchProducts={onSearchProducts}
                  reloadProducts={reloadProducts}
                  saveProduct={saveProduct}
                  deleteProduct={deleteProduct}
                />
              }
            />
            <Route
              path="/suppliers"
              element={
                <SuppliersPage
                  suppliers={suppliers}
                  supplierForm={supplierForm}
                  setSupplierForm={setSupplierForm}
                  editSupplierId={editSupplierId}
                  setEditSupplierId={setEditSupplierId}
                  saveSupplier={saveSupplier}
                  deleteSupplier={deleteSupplier}
                />
              }
            />
            <Route
              path="/inventory"
              element={
                <InventoryPage
                  products={products}
                  stockInForm={stockInForm}
                  setStockInForm={setStockInForm}
                  stockOutForm={stockOutForm}
                  setStockOutForm={setStockOutForm}
                  runInventory={runInventory}
                />
              }
            />
            <Route
              path="/orders"
              element={
                <OrdersPage
                  products={products}
                  suppliers={suppliers}
                  orderForm={orderForm}
                  setOrderForm={setOrderForm}
                  createOrder={createOrder}
                  orders={orders}
                  updateOrderStatus={updateOrderStatus}
                />
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
