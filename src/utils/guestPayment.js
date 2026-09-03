const GUEST_PENDING_PAY_KEY = "guest_pending_payment";

export const saveGuestPendingPayment = (orderId, phoneNumber) => {
  if (!orderId || !phoneNumber) return;
  localStorage.setItem(
    GUEST_PENDING_PAY_KEY,
    JSON.stringify({ orderId, phoneNumber: String(phoneNumber).trim() })
  );
};

export const readGuestPendingPayment = () => {
  try {
    const raw = localStorage.getItem(GUEST_PENDING_PAY_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed?.orderId || !parsed?.phoneNumber) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearGuestPendingPayment = () => {
  localStorage.removeItem(GUEST_PENDING_PAY_KEY);
};
