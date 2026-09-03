import React from "react";

const OPTIONS = [
  {
    id: "paymob",
    icon: "💳",
    title: "دفع إلكتروني",
    hint: "فيزا / مدى عبر Paymob",
  },
  {
    id: "cash_on_delivery",
    icon: "📦",
    title: "الدفع عند الاستلام",
    hint: "ادفع نقداً عند التوصيل",
  },
];

const PaymentMethodPicker = ({ value, onChange }) => {
  return (
    <div className="payment-method-picker">
      <p className="payment-method-picker__label">طريقة الدفع</p>
      <div className="payment-method-picker__grid">
        {OPTIONS.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`payment-method-card${selected ? " is-selected" : ""}`}
              onClick={() => onChange(option.id)}
              aria-pressed={selected}
            >
              <span className="payment-method-card__icon" aria-hidden>
                {option.icon}
              </span>
              <span className="payment-method-card__title">{option.title}</span>
              <span className="payment-method-card__hint">{option.hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodPicker;
