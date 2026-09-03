import React, { useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import {
  FaFileImport,
  FaUpload,
  FaCheckCircle,
  FaSyncAlt,
  FaTimesCircle,
  FaBoxOpen,
} from "react-icons/fa";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const flattenCategories = (items, prefix = "") => {
  if (!Array.isArray(items)) return [];
  return items.flatMap((cat) => {
    const label = prefix ? `${prefix} / ${cat.name}` : cat.name;
    const children = cat.children || cat.subCategories || [];
    return [{ id: cat.id, name: label }, ...flattenCategories(children, label)];
  });
};

const extractProducts = (parsed) => {
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed?.data)) return parsed.data;
  if (Array.isArray(parsed?.products)) return parsed.products;
  return null;
};

const statusLabel = {
  created: "تم الإنشاء",
  updated: "تم التحديث",
  skipped: "تم التخطي",
  failed: "فشل",
};

const ImportProducts = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [jsonText, setJsonText] = useState("");
  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState("");
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  const preview = useMemo(() => {
    const raw = jsonText.trim();
    if (!raw) return { ok: false, count: 0 };
    try {
      const parsed = JSON.parse(raw);
      const products = extractProducts(parsed);
      if (!products) return { ok: false, count: 0 };
      return { ok: true, count: products.length };
    } catch {
      return { ok: false, count: 0 };
    }
  }, [jsonText]);

  const selectedCategory = categories.find(
    (cat) => String(cat.id) === String(categoryId)
  );

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("سجّل دخول الأدمن أولاً");
        return;
      }
      let list = [];
      try {
        const { data } = await baseUrl.get("api/categories/hierarchy", {
          headers: authHeaders(),
        });
        list = flattenCategories(data);
      } catch {
        const { data } = await baseUrl.get("api/categories", {
          headers: authHeaders(),
        });
        list = Array.isArray(data) ? data : [];
      }
      setCategories(list);
    } catch {
      toast.error("فشل في تحميل التصنيفات");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchCategoryProducts = async (id) => {
    if (!id) {
      setCategoryInfo(null);
      return;
    }
    try {
      const { data } = await baseUrl.get(`api/categories/${id}`, {
        headers: authHeaders(),
      });
      setCategoryInfo(data);
    } catch {
      setCategoryInfo(null);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCategoryProducts(categoryId);
  }, [categoryId]);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setJsonText(String(reader.result || ""));
      setResult(null);
      setParseError("");
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!categoryId) {
      setParseError("اختيار التصنيف إجباري");
      return;
    }

    const raw = jsonText.trim();
    if (!raw) {
      setParseError("الصق JSON أو ارفع ملف أولاً");
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      setParseError("JSON غير صالح. تأكد من تنسيق الملف.");
      return;
    }

    const products = extractProducts(parsed);
    if (!products || products.length === 0) {
      setParseError("لم يتم العثور على منتجات. الصق المصفوفة أو الكائن الذي يحتوي data.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("سجّل دخول الأدمن أولاً");
      return;
    }

    const numericId = Number(categoryId);
    const payload = Array.isArray(parsed)
      ? { categoryId: numericId, data: parsed }
      : { ...parsed, categoryId: numericId, data: products };

    setParseError("");
    setLoading(true);
    setResult(null);

    try {
      const { data } = await baseUrl.post(
        `api/products/import?categoryId=${numericId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 180000,
        }
      );
      setResult(data);
      await fetchCategoryProducts(numericId);
      const created = data.created ?? 0;
      const updated = data.updated ?? 0;
      toast.success(`تم الاستيراد: ${created} جديد، ${updated} محدّث`);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "تعذر استيراد المنتجات";
      toast.error(typeof message === "string" ? message : "تعذر استيراد المنتجات");
    } finally {
      setLoading(false);
    }
  };

  const categoryProducts = Array.isArray(categoryInfo?.products)
    ? categoryInfo.products
    : [];
  const productsCount =
    categoryInfo?.productsCount ?? categoryProducts.length;

  return (
    <div className="import-page" dir="rtl">
      <header className="import-head">
        <span className="import-icon">
          <FaFileImport />
        </span>
        <div>
          <h2>استيراد المنتجات</h2>
          <p>
            اختر التصنيف أولاً، ثم الصق JSON. كل المنتجات تدخل تحت هذا التصنيف.
            المنتج الموجود يتحدث وينتقل إليه.
          </p>
        </div>
      </header>

      <div className="import-card">
        <label className="import-label">التصنيف المستهدف *</label>
        <select
          className="import-select"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setResult(null);
            setParseError("");
          }}
          disabled={loadingCategories}
        >
          <option value="">
            {loadingCategories ? "جاري تحميل التصنيفات..." : "اختر التصنيف"}
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {categoryId && (
          <div className="import-cat-info">
            <FaBoxOpen />
            <span>
              {selectedCategory?.name || "التصنيف"} — {productsCount} منتج حالياً
            </span>
          </div>
        )}

        <div className="import-toolbar">
          <button
            type="button"
            className="import-file-btn"
            onClick={() => fileRef.current?.click()}
          >
            <FaUpload />
            رفع ملف JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        <textarea
          className="import-textarea"
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setParseError("");
          }}
          placeholder='الصق هنا JSON بالشكل { "data": [ ... ] } أو مصفوفة المنتجات مباشرة'
          spellCheck={false}
        />

        <div className="import-meta">
          {!categoryId && <span className="import-bad">التصنيف إجباري</span>}
          {preview.ok ? (
            <span className="import-ok">جاهز — {preview.count} منتج</span>
          ) : jsonText.trim() ? (
            <span className="import-bad">تعذر قراءة المنتجات من النص</span>
          ) : (
            <span>لم يتم إدخال بيانات بعد</span>
          )}
          {parseError && <span className="import-bad">{parseError}</span>}
        </div>

        <button
          type="button"
          className="import-submit"
          onClick={handleImport}
          disabled={loading || !preview.ok || !categoryId}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" />
              جاري الاستيراد...
            </>
          ) : (
            "بدء الاستيراد"
          )}
        </button>
      </div>

      {result && (
        <div className="import-result">
          <div className="import-stats">
            <div className="import-stat created">
              <FaCheckCircle />
              <strong>{result.created ?? 0}</strong>
              <span>تم إنشاؤه</span>
            </div>
            <div className="import-stat updated">
              <FaSyncAlt />
              <strong>{result.updated ?? 0}</strong>
              <span>تم تحديثه</span>
            </div>
            <div className="import-stat failed">
              <FaTimesCircle />
              <strong>{result.failed ?? 0}</strong>
              <span>فشل</span>
            </div>
            <div className="import-stat extra">
              <strong>{result.brandsCreated ?? 0}</strong>
              <span>براندات جديدة</span>
            </div>
          </div>

          {Array.isArray(result.results) && result.results.length > 0 && (
            <div className="import-table-wrap">
              <table className="import-table">
                <thead>
                  <tr>
                    <th>المصدر</th>
                    <th>الاسم</th>
                    <th>الحالة</th>
                    <th>رقم المنتج</th>
                  </tr>
                </thead>
                <tbody>
                  {result.results.map((row, index) => (
                    <tr key={`${row.sourceId || row.name}-${index}`}>
                      <td>{row.sourceId || "—"}</td>
                      <td>{row.name || "—"}</td>
                      <td>
                        <span className={`import-badge ${row.status || ""}`}>
                          {statusLabel[row.status] || row.status}
                        </span>
                      </td>
                      <td>{row.productId || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {categoryId && categoryProducts.length > 0 && (
        <div className="import-cat-products">
          <h3>
            منتجات التصنيف ({productsCount})
          </h3>
          <div className="import-table-wrap">
            <table className="import-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>الاسم</th>
                  <th>السعر</th>
                </tr>
              </thead>
              <tbody>
                {categoryProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name || "—"}</td>
                    <td>
                      {product.price != null ? `${Number(product.price).toFixed(2)} ر.س` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .import-page { max-width: 980px; }
        .import-head {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.4rem;
        }
        .import-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(46, 229, 157, 0.14);
          color: var(--accent, #2ee59d);
          font-size: 1.3rem;
        }
        .import-head h2 {
          margin: 0 !important;
          font-size: 1.45rem !important;
          color: var(--text-primary) !important;
        }
        .import-head p {
          margin: 0.25rem 0 0 !important;
          color: var(--text-secondary) !important;
          font-size: 0.92rem;
        }
        .import-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 18px;
          padding: 1.2rem;
        }
        .import-label {
          display: block;
          margin-bottom: 0.4rem;
          font-weight: 700;
          color: var(--text-primary) !important;
        }
        .import-select {
          width: 100%;
          max-width: 420px;
          height: 44px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          padding: 0 0.8rem;
          margin-bottom: 0.75rem;
        }
        .import-select:focus {
          outline: none;
          border-color: var(--accent, #2ee59d);
        }
        .import-cat-info {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: var(--accent, #2ee59d) !important;
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 0.9rem;
        }
        .import-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.9rem;
        }
        .import-file-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: transparent;
          color: var(--accent, #2ee59d);
          border: 1px solid var(--accent, #2ee59d);
          border-radius: 999px;
          padding: 0.4rem 0.95rem;
          font-weight: 700;
        }
        .import-textarea {
          width: 100%;
          min-height: 260px;
          resize: vertical;
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 0.9rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 0.82rem;
          line-height: 1.5;
          direction: ltr;
          text-align: left;
        }
        .import-textarea:focus {
          outline: none;
          border-color: var(--accent, #2ee59d);
        }
        .import-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin: 0.8rem 0;
          font-size: 0.88rem;
          color: var(--text-secondary) !important;
        }
        .import-ok { color: var(--accent, #2ee59d) !important; font-weight: 700; }
        .import-bad { color: #f87171 !important; font-weight: 700; }
        .import-submit {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--accent, #22c55e);
          color: #06210f;
          border: none;
          border-radius: 999px;
          padding: 0.65rem 1.4rem;
          font-weight: 800;
        }
        .import-submit:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .import-result, .import-cat-products {
          margin-top: 1.4rem;
        }
        .import-cat-products h3 {
          margin: 0 0 0.75rem !important;
          font-size: 1.1rem !important;
          color: var(--text-primary) !important;
        }
        .import-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .import-stat {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .import-stat strong {
          font-size: 1.4rem;
          color: var(--text-primary) !important;
        }
        .import-stat span {
          color: var(--text-secondary) !important;
          font-size: 0.8rem;
        }
        .import-stat.created { color: #22c55e; }
        .import-stat.updated { color: #38bdf8; }
        .import-stat.failed { color: #f87171; }
        .import-table-wrap {
          overflow-x: auto;
          border: 1px solid var(--border-color);
          border-radius: 14px;
        }
        .import-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 560px;
        }
        .import-table th,
        .import-table td {
          padding: 0.7rem 0.85rem;
          text-align: right;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary) !important;
          font-size: 0.88rem;
        }
        .import-table th {
          background: var(--bg-secondary);
          color: var(--text-secondary) !important;
        }
        .import-badge {
          display: inline-block;
          border-radius: 999px;
          padding: 0.15rem 0.6rem;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .import-badge.created { background: rgba(34,197,94,0.16); color: #4ade80 !important; }
        .import-badge.updated { background: rgba(56,189,248,0.16); color: #38bdf8 !important; }
        .import-badge.skipped { background: rgba(234,179,8,0.16); color: #facc15 !important; }
        .import-badge.failed { background: rgba(248,113,113,0.16); color: #f87171 !important; }
        @media (max-width: 768px) {
          .import-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .import-select { max-width: none; }
        }
      `}</style>
    </div>
  );
};

export default ImportProducts;
