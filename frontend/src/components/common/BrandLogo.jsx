import { Link } from "react-router-dom";

export default function BrandLogo({ compact = false, link = true }) {
  const content = (
    <div className="flex items-center gap-3">
      <div className="sf-brand-mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            width="48"
            height="48"
            rx="14"
            fill="currentColor"
            opacity="0.12"
          />
          <path
            d="M13 31.5V17.5C13 15.8431 14.3431 14.5 16 14.5H23.5V31.5H13Z"
            fill="currentColor"
          />
          <path
            d="M24.5 31.5V14.5H32C33.6569 14.5 35 15.8431 35 17.5V31.5H24.5Z"
            fill="currentColor"
            opacity="0.72"
          />
          <path
            d="M10.5 34H37.5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M18 10.5L24 7L30 10.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {!compact && (
        <div className="min-w-0">
          <div className="text-[19px] font-black tracking-tight text-slate-950 dark:text-white">
            Stock<span className="sf-brand-accent">Flow</span>
          </div>
          <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Inventory System
          </div>
        </div>
      )}
    </div>
  );

  return link ? (
    <Link to="/dashboard" aria-label="StockFlow home">
      {content}
    </Link>
  ) : (
    content
  );
}
