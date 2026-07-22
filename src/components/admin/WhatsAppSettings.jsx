import React, { useCallback, useEffect, useState } from "react";
import { Spinner, Modal, Form } from "react-bootstrap";
import {
  FaWhatsapp,
  FaPlus,
  FaTrash,
  FaSync,
  FaQrcode,
  FaCheckCircle,
  FaLink,
  FaMobileAlt,
  FaExclamationTriangle,
  FaPlug,
} from "react-icons/fa";
import { toast } from "react-toastify";
import baseUrl from "../../api/baseUrl";
import "./WhatsAppSettings.css";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const STATUS_AR = {
  ready: { label: "متصلة", tone: "ok" },
  qr: { label: "بانتظار المسح", tone: "warn" },
  pending: { label: "قيد التحضير", tone: "muted" },
  authenticated: { label: "جارٍ الربط", tone: "info" },
  disconnected: { label: "غير متصلة", tone: "danger" },
};

const StatusChip = ({ status }) => {
  const meta = STATUS_AR[status] || { label: status || "غير معروف", tone: "muted" };
  return <span className={`wa-chip wa-chip--${meta.tone}`}>{meta.label}</span>;
};

const WhatsAppSettings = () => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [orderConfirmSessionId, setOrderConfirmSessionId] = useState(null);
  const [configured, setConfigured] = useState(true);
  const [newId, setNewId] = useState("");
  const [creating, setCreating] = useState(false);
  const [savingAssign, setSavingAssign] = useState(false);
  const [qrModal, setQrModal] = useState({ open: false, session: null, loading: false });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const statusRes = await baseUrl.get("api/whatsapp/status", {
        headers: authHeaders(),
      });
      setConfigured(Boolean(statusRes.data?.configured));
      setOrderConfirmSessionId(statusRes.data?.orderConfirmSessionId || null);

      if (!statusRes.data?.configured) {
        setSessions([]);
        return;
      }

      const res = await baseUrl.get("api/whatsapp/sessions", {
        headers: authHeaders(),
      });
      setSessions(Array.isArray(res.data?.sessions) ? res.data.sessions : []);
      if (res.data?.orderConfirmSessionId !== undefined) {
        setOrderConfirmSessionId(res.data.orderConfirmSessionId);
      }
    } catch (err) {
      console.error(err);
      toast.error("تعذّر تحميل إعدادات واتساب");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const id = newId.trim();
    if (!id) return toast.warn("أدخل اسماً للجلسة");
    setCreating(true);
    try {
      await baseUrl.post("api/whatsapp/sessions", { id }, { headers: authHeaders() });
      toast.success("تم إنشاء الجلسة — امسح رمز الاستجابة السريعة");
      setNewId("");
      await fetchAll();
      openQr(id);
    } catch (err) {
      toast.error(err?.response?.data?.message || "تعذّر إنشاء الجلسة");
    } finally {
      setCreating(false);
    }
  };

  const openQr = async (id) => {
    setQrModal({ open: true, session: { id, status: "pending" }, loading: true });
    try {
      // GET auto-reconnects when disconnected on the gateway.
      const res = await baseUrl.get(`api/whatsapp/sessions/${id}`, {
        headers: authHeaders(),
      });
      setQrModal({ open: true, session: res.data, loading: false });
    } catch (err) {
      toast.error("تعذّر جلب رمز الربط");
      setQrModal({ open: false, session: null, loading: false });
    }
  };

  const handleReconnect = async (id) => {
    setQrModal({ open: true, session: { id, status: "pending" }, loading: true });
    try {
      const res = await baseUrl.post(
        `api/whatsapp/sessions/${id}/reconnect`,
        {},
        { headers: authHeaders() }
      );
      toast.info("جارٍ إعادة تشغيل الجلسة — انتظر رمز QR أو حالة «متصلة»");
      setQrModal({ open: true, session: res.data, loading: false });
      fetchAll();
      // Poll a few times for QR / ready
      for (let i = 0; i < 8; i++) {
        await new Promise((r) => setTimeout(r, 1500));
        const poll = await baseUrl.get(`api/whatsapp/sessions/${id}`, {
          headers: authHeaders(),
        });
        setQrModal({ open: true, session: poll.data, loading: false });
        if (poll.data?.status === "ready" || poll.data?.qr) break;
      }
      fetchAll();
    } catch {
      toast.error("تعذّرت إعادة الربط");
      setQrModal({ open: false, session: null, loading: false });
    }
  };

  const refreshQr = async () => {
    if (!qrModal.session?.id) return;
    setQrModal((m) => ({ ...m, loading: true }));
    try {
      const res = await baseUrl.get(`api/whatsapp/sessions/${qrModal.session.id}`, {
        headers: authHeaders(),
      });
      setQrModal({ open: true, session: res.data, loading: false });
      if (res.data?.status === "ready") {
        toast.success("تم الربط بنجاح — الجلسة جاهزة");
        fetchAll();
      }
    } catch {
      setQrModal((m) => ({ ...m, loading: false }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`هل تريد حذف جلسة «${id}»؟ لن يمكن التراجع عن ذلك.`)) return;
    try {
      await baseUrl.delete(`api/whatsapp/sessions/${id}`, {
        headers: authHeaders(),
      });
      toast.success("تم حذف الجلسة");
      fetchAll();
    } catch {
      toast.error("تعذّر حذف الجلسة");
    }
  };

  const handleAssign = async (sessionId) => {
    setSavingAssign(true);
    try {
      const res = await baseUrl.put(
        "api/whatsapp/settings",
        { orderConfirmSessionId: sessionId },
        { headers: authHeaders() }
      );
      setOrderConfirmSessionId(res.data?.orderConfirmSessionId || sessionId);
      toast.success(
        sessionId
          ? `تم تعيين «${sessionId}» لتأكيد الطلبات`
          : "تم إيقاف إرسال رسائل تأكيد الطلبات"
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "تعذّر حفظ الإعداد");
    } finally {
      setSavingAssign(false);
    }
  };

  const readySessions = sessions.filter((s) => s.status === "ready");
  const assigned = sessions.find((s) => s.id === orderConfirmSessionId);

  return (
    <div className="wa-page" dir="rtl" lang="ar">
      <header className="wa-hero">
        <div className="wa-hero__icon" aria-hidden>
          <FaWhatsapp />
        </div>
        <div className="wa-hero__text">
          <h1 className="wa-hero__title">واتساب المتجر</h1>
          <p className="wa-hero__subtitle">
            اربط أرقام واتساب، واختر أي رقم يُستخدم لتأكيد طلبات العملاء تلقائياً.
          </p>
        </div>
        <button type="button" className="wa-btn wa-btn--ghost" onClick={fetchAll} disabled={loading}>
          <FaSync className={loading ? "wa-spin" : undefined} />
          <span>تحديث</span>
        </button>
      </header>

      {!configured && (
        <div className="wa-banner wa-banner--warn" role="alert">
          <FaExclamationTriangle />
          <div>
            <strong>البوابة غير مُعدّة بعد</strong>
            <p>
              أضف مفتاح واتساب في إعدادات السيرفر ثم أعد تشغيل الواجهة الخلفية.
            </p>
          </div>
        </div>
      )}

      {/* Feature assignment — primary Arabic task */}
      <section className="wa-panel wa-panel--feature">
        <div className="wa-panel__head">
          <span className="wa-panel__badge">الميزة</span>
          <h2 className="wa-panel__title">تأكيد الطلبات عبر واتساب</h2>
        </div>
        <p className="wa-panel__desc">
            عند إنشاء طلب جديد يُرسل للعميل رسالة للتأكيد ويصبح الطلب «بانتظار واتساب».
            إذا ردّ بـ «نعم» يتحول إلى «قيد المعالجة»، وإذا ردّ بـ «لا» يُلغى.
            إن تعطّل واتساب يبقى الطلب «قيد الانتظار» ويمكنك تأكيده يدوياً من الطلبات.
        </p>

        <ol className="wa-steps">
          <li>
            <span className="wa-steps__n">١</span>
            اربط رقماً أدناه وامسح رمز الاستجابة السريعة
          </li>
          <li>
            <span className="wa-steps__n">٢</span>
            اختر الجلسة المتصلة لتأكيد الطلبات
          </li>
          <li>
            <span className="wa-steps__n">٣</span>
            اختبر بطلب تجريبي من حساب عميل لديه رقم جوال
          </li>
        </ol>

        <label className="wa-label" htmlFor="wa-assign-session">
          الجلسة المستخدمة لتأكيد الطلبات
        </label>
        <div className="wa-assign-row">
          <Form.Select
            id="wa-assign-session"
            className="wa-select"
            value={orderConfirmSessionId || ""}
            disabled={!configured || savingAssign || loading}
            onChange={(e) => handleAssign(e.target.value || null)}
          >
            <option value="">بدون تعيين — لن تُرسل رسائل تأكيد</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id} disabled={s.status !== "ready"}>
                {s.id}
                {s.phone_number ? ` — ${s.phone_number}` : ""}
                {s.status !== "ready" ? ` (${STATUS_AR[s.status]?.label || s.status})` : " — متصلة"}
              </option>
            ))}
          </Form.Select>
          {savingAssign && <Spinner animation="border" size="sm" />}
        </div>

        {assigned ? (
          <div className="wa-assigned">
            <FaCheckCircle />
            <div>
              <strong>مُفعّل حالياً</strong>
              <span>
                الجلسة «{assigned.id}»
                {assigned.phone_number ? ` · ${assigned.phone_number}` : ""}
              </span>
            </div>
          </div>
        ) : (
          <div className="wa-assigned wa-assigned--off">
            <FaLink />
            <div>
              <strong>غير مُفعّل</strong>
              <span>لن يُرسل المتجر رسائل تأكيد حتى تختار جلسة متصلة.</span>
            </div>
          </div>
        )}

        {configured && readySessions.length === 0 && (
          <p className="wa-hint">لا توجد جلسات متصلة بعد — أنشئ جلسة وامسح الرمز أولاً.</p>
        )}
      </section>

      {/* Create session */}
      <section className="wa-panel">
        <div className="wa-panel__head">
          <span className="wa-panel__badge wa-panel__badge--green">إضافة</span>
          <h2 className="wa-panel__title">ربط رقم واتساب جديد</h2>
        </div>
        <p className="wa-panel__desc">
          اختر اسماً تقنياً بالإنجليزية للجلسة (حروف وأرقام فقط، مثل: shop أو support)،
          ثم امسح الرمز من تطبيق واتساب.
        </p>

        <form className="wa-create" onSubmit={handleCreate}>
          <div className="wa-field">
            <label className="wa-label" htmlFor="wa-new-id">
              اسم الجلسة (إنجليزي)
            </label>
            <input
              id="wa-new-id"
              className="wa-input"
              placeholder="مثال: shop"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              disabled={!configured || creating}
              autoComplete="off"
              dir="ltr"
              style={{ textAlign: "right" }}
            />
          </div>
          <button
            type="submit"
            className="wa-btn wa-btn--primary"
            disabled={!configured || creating}
          >
            {creating ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <FaPlus />
                <span>إنشاء وربط</span>
              </>
            )}
          </button>
        </form>

        <div className="wa-howto">
          <FaMobileAlt />
          <span>
            من الجوال: واتساب ← الإعدادات ← الأجهزة المرتبطة ← ربط جهاز ← امسح الرمز
          </span>
        </div>
      </section>

      {/* Sessions list */}
      <section className="wa-panel">
        <div className="wa-panel__head wa-panel__head--row">
          <div>
            <span className="wa-panel__badge">الجلسات</span>
            <h2 className="wa-panel__title">أرقام واتساب المرتبطة</h2>
          </div>
          <span className="wa-count">{sessions.length} جلسة</span>
        </div>

        {loading ? (
          <div className="wa-loading">
            <Spinner animation="border" variant="success" />
            <span>جاري التحميل…</span>
          </div>
        ) : sessions.length === 0 ? (
          <div className="wa-empty">
            <FaWhatsapp />
            <p>لا توجد جلسات بعد</p>
            <span>أنشئ أول جلسة من القسم أعلاه لبدء الربط.</span>
          </div>
        ) : (
          <ul className="wa-sessions">
            {sessions.map((s) => {
              const isAssigned = orderConfirmSessionId === s.id;
              return (
                <li
                  key={s.id}
                  className={`wa-session${isAssigned ? " wa-session--active" : ""}`}
                >
                  <div className="wa-session__main">
                    <div className="wa-session__avatar" aria-hidden>
                      <FaWhatsapp />
                    </div>
                    <div className="wa-session__info">
                      <div className="wa-session__name-row">
                        <h3 className="wa-session__name">{s.id}</h3>
                        <StatusChip status={s.status} />
                        {isAssigned && (
                          <span className="wa-chip wa-chip--feature">لتأكيد الطلبات</span>
                        )}
                      </div>
                      <p className="wa-session__phone" dir="ltr">
                        {s.phone_number || "لم يُربط رقم بعد"}
                      </p>
                    </div>
                  </div>

                  <div className="wa-session__actions">
                    {(s.status === "disconnected" || s.status === "qr" || s.status === "pending") && (
                      <button
                        type="button"
                        className="wa-btn wa-btn--soft"
                        onClick={() => handleReconnect(s.id)}
                      >
                        <FaPlug />
                        <span>إعادة الربط</span>
                      </button>
                    )}
                    {!isAssigned && s.status === "ready" && (
                      <button
                        type="button"
                        className="wa-btn wa-btn--soft"
                        disabled={savingAssign}
                        onClick={() => handleAssign(s.id)}
                      >
                        تعيين للتأكيد
                      </button>
                    )}
                    <button
                      type="button"
                      className="wa-btn wa-btn--ghost"
                      onClick={() =>
                        s.status === "disconnected" ? handleReconnect(s.id) : openQr(s.id)
                      }
                    >
                      <FaQrcode />
                      <span>رمز الربط</span>
                    </button>
                    <button
                      type="button"
                      className="wa-btn wa-btn--danger-ghost"
                      onClick={() => handleDelete(s.id)}
                      aria-label={`حذف ${s.id}`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Modal
        show={qrModal.open}
        onHide={() => setQrModal({ open: false, session: null, loading: false })}
        centered
        contentClassName="wa-modal"
        dialogClassName="wa-modal-dialog"
      >
        <div className="wa-modal__inner" dir="rtl" lang="ar">
          <header className="wa-modal__head">
            <h2>ربط واتساب</h2>
            <p>الجلسة: {qrModal.session?.id}</p>
          </header>

          <div className="wa-modal__body">
            {qrModal.loading ? (
              <div className="wa-loading">
                <Spinner animation="border" variant="success" />
                <span>جاري جلب الرمز…</span>
              </div>
            ) : qrModal.session?.status === "ready" ? (
              <div className="wa-modal__ready">
                <FaCheckCircle />
                <strong>الجلسة متصلة وجاهزة</strong>
                {qrModal.session.phone_number && (
                  <span dir="ltr">{qrModal.session.phone_number}</span>
                )}
              </div>
            ) : qrModal.session?.qr ? (
              <>
                <div className="wa-qr-frame">
                  <img src={qrModal.session.qr} alt="رمز ربط واتساب" />
                </div>
                <p className="wa-modal__hint">
                  افتح واتساب على الجوال ← الإعدادات ← الأجهزة المرتبطة ← ربط جهاز
                </p>
              </>
            ) : (
              <div className="wa-banner wa-banner--muted">
                لا يوجد رمز حالياً — الحالة:{" "}
                {STATUS_AR[qrModal.session?.status]?.label || qrModal.session?.status}
              </div>
            )}
          </div>

          <footer className="wa-modal__foot">
            {(qrModal.session?.status === "disconnected" ||
              (!qrModal.session?.qr && qrModal.session?.status !== "ready")) && (
              <button
                type="button"
                className="wa-btn wa-btn--soft"
                onClick={() => handleReconnect(qrModal.session.id)}
              >
                <FaPlug />
                <span>إعادة الربط</span>
              </button>
            )}
            <button type="button" className="wa-btn wa-btn--ghost" onClick={refreshQr}>
              <FaSync />
              <span>تحديث الحالة</span>
            </button>
            <button
              type="button"
              className="wa-btn wa-btn--primary"
              onClick={() => setQrModal({ open: false, session: null, loading: false })}
            >
              تم
            </button>
          </footer>
        </div>
      </Modal>
    </div>
  );
};

export default WhatsAppSettings;
