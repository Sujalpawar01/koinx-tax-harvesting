import React, { useState } from 'react';
import './Disclaimer.css';

const Disclaimer: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="disclaimer-wrapper">
      <button
        className={`disclaimer-toggle ${open ? 'open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        id="disclaimer-toggle"
      >
        <span className="disclaimer-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="#2563eb" />
            <path d="M8 7v5" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="4.5" r="0.75" fill="#2563eb" />
          </svg>
        </span>
        <span className="disclaimer-label">Important Notes &amp; Disclaimers</span>
        <span className="disclaimer-chevron">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="#64748b"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        className={`disclaimer-content ${open ? 'expanded' : ''}`}
        role="region"
        aria-labelledby="disclaimer-toggle"
      >
        <ul className="disclaimer-list">
          <li>Tax loss harvesting is currently not applicable to F&amp;O transactions.</li>
          <li>Losses from assets held for less than 1 year are classified as Short-Term Capital Losses (STCL).</li>
          <li>Losses from assets held for more than 1 year are classified as Long-Term Capital Losses (LTCL).</li>
          <li>STCL can be set off against both Short-Term and Long-Term Capital Gains.</li>
          <li>LTCL can only be set off against Long-Term Capital Gains (LTCG).</li>
          <li>Do not use losses for assets where the cost of acquisition is NIL.</li>
        </ul>
      </div>
    </div>
  );
};

export default Disclaimer;
