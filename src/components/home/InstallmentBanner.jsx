const InstallmentBanner = () => {
  return (
    <section className="home-installment" dir="rtl" aria-label="خيارات التقسيط">
      <p className="home-installment-title">قسطها مع</p>
      <div className="home-installment-brands">
        <span className="home-installment-chip tamara" title="تمارا">
          tamara
        </span>
        <span className="home-installment-chip tabby" title="تابي">
          tabby
        </span>
      </div>

      <style>{`
        .home-installment {
          position: relative;
          z-index: 1;
          margin: 1.25rem auto 0.5rem;
          width: min(1200px, calc(100% - 2rem));
          padding: 1.15rem 1rem 1.25rem;
          border-radius: 16px;
          background: #163c28;
          border: 1px solid rgba(0, 108, 53, 0.35);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.7rem;
        }

        .home-installment-title {
          margin: 0 !important;
          color: #fff !important;
          font-size: 1.05rem;
          font-weight: 700 !important;
          letter-spacing: 0.02em;
        }

        .home-installment-brands {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          flex-wrap: wrap;
        }

        .home-installment-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 118px;
          height: 38px;
          padding: 0 1.15rem;
          border-radius: 999px;
          font-size: 1.05rem;
          font-weight: 800 !important;
          letter-spacing: -0.03em;
          color: #111 !important;
          line-height: 1;
        }

        .home-installment-chip.tamara {
          background: linear-gradient(90deg, #f7d7a4 0%, #f3b7b0 48%, #d8c4ef 100%);
          font-family: Arial, Helvetica, sans-serif !important;
        }

        .home-installment-chip.tabby {
          background: #3fe0c5;
          font-family: Arial, Helvetica, sans-serif !important;
        }

        @media (max-width: 767px) {
          .home-installment {
            width: calc(100% - 1.5rem);
            margin-top: 1rem;
            padding: 0.95rem 0.85rem 1.05rem;
            border-radius: 14px;
          }
          .home-installment-title {
            font-size: 0.95rem;
          }
          .home-installment-chip {
            min-width: 104px;
            height: 34px;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </section>
  );
};

export default InstallmentBanner;
