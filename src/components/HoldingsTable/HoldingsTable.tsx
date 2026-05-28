import { useMemo, useState } from 'react';
import type { FC } from 'react';
import type { Holding } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import './HoldingsTable.css';

const DEFAULT_COIN_LOGO = 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
const INITIAL_VISIBLE = 5;

interface HoldingRowProps {
  holding: Holding;
  index: number;
  isSelected: boolean;
  onToggle: (idx: number) => void;
}

const HoldingRow: FC<HoldingRowProps> = ({ holding, index, isSelected, onToggle }) => {
  const totalCurrentValue = holding.currentPrice * holding.totalHolding;
  const stGain = holding.stcg.gain;
  const ltGain = holding.ltcg.gain;

  return (
    <tr
      className={`holdings-row ${isSelected ? 'holdings-row--selected' : ''}`}
      onClick={() => onToggle(index)}
    >
      <td className="holdings-cell holdings-cell--checkbox">
        <label
          className="checkbox-wrapper"
          onClick={(e) => e.stopPropagation()}
          htmlFor={`holding-checkbox-${index}`}
        >
          <input
            id={`holding-checkbox-${index}`}
            type="checkbox"
            className="checkbox-input"
            checked={isSelected}
            onChange={() => onToggle(index)}
          />
          <span className="checkbox-custom" />
        </label>
      </td>

      <td className="holdings-cell holdings-cell--asset" data-label="Asset">
        <div className="asset-info">
          <div className="asset-logo-wrapper">
            <img
              src={holding.logo}
              alt={holding.coin}
              className="asset-logo"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_COIN_LOGO;
              }}
            />
          </div>
          <div className="asset-names">
            <span className="asset-coin">{holding.coin}</span>
            <span className="asset-name">{holding.coinName}</span>
          </div>
        </div>
      </td>

      <td className="holdings-cell holdings-cell--holdings" data-label="Holdings">
        <div className="holdings-amount">
          <span className="holdings-total">{formatNumber(holding.totalHolding)} {holding.coin}</span>
          <span className="holdings-avg">₹ {formatNumber(holding.averageBuyPrice)}/{holding.coin}</span>
        </div>
      </td>

      <td className="holdings-cell holdings-cell--value" data-label="Current Value">
        <span className="current-value">₹ {formatNumber(totalCurrentValue)}</span>
      </td>

      <td className="holdings-cell holdings-cell--gain" data-label="Short-term">
        <div className="gain-info">
          <span className={`gain-amount ${stGain >= 0 ? 'gain-positive' : 'gain-negative'}`}>
            {stGain >= 0 ? '+' : ''}{formatCurrency(stGain)}
          </span>
          {holding.stcg.balance !== 0 && (
            <span className="gain-balance">
              {formatNumber(holding.stcg.balance)} {holding.coin}
            </span>
          )}
        </div>
      </td>

      <td className="holdings-cell holdings-cell--gain" data-label="Long-Term">
        <div className="gain-info">
          <span className={`gain-amount ${ltGain >= 0 ? 'gain-positive' : 'gain-negative'}`}>
            {ltGain >= 0 ? '+' : ''}{formatCurrency(ltGain)}
          </span>
          {holding.ltcg.balance !== 0 && (
            <span className="gain-balance">
              {formatNumber(holding.ltcg.balance)} {holding.coin}
            </span>
          )}
        </div>
      </td>

      <td className="holdings-cell holdings-cell--sell" data-label="Amount to Sell">
        {isSelected ? (
          <span className="sell-amount">{formatNumber(holding.totalHolding)} {holding.coin}</span>
        ) : (
          <span className="sell-dash">-</span>
        )}
      </td>
    </tr>
  );
};

// Skeleton row
const SkeletonRow: FC<{ cols: number }> = ({ cols }) => (
  <tr className="holdings-row">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="holdings-cell">
        <div className="skeleton skeleton-cell" />
      </td>
    ))}
  </tr>
);

interface HoldingsTableProps {
  holdings: Holding[];
  selectedIds: Set<number>;
  allSelected: boolean;
  someSelected: boolean;
  onToggle: (idx: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  loading: boolean;
}

const HoldingsTable: FC<HoldingsTableProps> = ({
  holdings,
  selectedIds,
  allSelected,
  someSelected,
  onToggle,
  onSelectAll,
  onDeselectAll,
  loading,
}) => {
  const [showAll, setShowAll] = useState(false);

  const visibleHoldings = useMemo(
    () =>
      holdings
        .map((holding, index) => ({ holding, index }))
        .slice(0, showAll ? holdings.length : INITIAL_VISIBLE),
    [showAll, holdings]
  );
  const hasMore = holdings.length > INITIAL_VISIBLE;

  const handleSelectAllToggle = () => {
    if (allSelected || someSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  return (
    <div className="holdings-container">
      <h2 className="holdings-title">Holdings</h2>

      <div className="holdings-table-wrapper">
        <table className="holdings-table">
          <thead className="holdings-thead">
            <tr>
              <th className="holdings-th holdings-th--checkbox">
                <label className="checkbox-wrapper" htmlFor="select-all-checkbox">
                  <input
                    id="select-all-checkbox"
                    type="checkbox"
                    className="checkbox-input"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                    onChange={handleSelectAllToggle}
                  />
                  <span className="checkbox-custom" />
                </label>
              </th>
              <th className="holdings-th holdings-th--asset">Asset</th>
              <th className="holdings-th holdings-th--right">
                <div>Holdings</div>
                <div className="holdings-th__sub">Current Market Rate</div>
              </th>
              <th className="holdings-th holdings-th--right">Total Current Value</th>
              <th className="holdings-th holdings-th--right">Short-term</th>
              <th className="holdings-th holdings-th--right">Long-Term</th>
              <th className="holdings-th holdings-th--right">Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: INITIAL_VISIBLE }).map((_, i) => (
                <SkeletonRow key={i} cols={7} />
              ))
            ) : holdings.length === 0 ? (
              <tr className="holdings-row holdings-row--empty">
                <td className="holdings-cell" colSpan={7}>
                  No holdings available.
                </td>
              </tr>
            ) : (
              visibleHoldings.map(({ holding, index }) => (
                <HoldingRow
                  key={`${holding.coin}-${index}`}
                  holding={holding}
                  index={index}
                  isSelected={selectedIds.has(index)}
                  onToggle={onToggle}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && hasMore && (
        <div className="holdings-view-all">
          <button
            className="view-all-btn"
            onClick={() => setShowAll((prev) => !prev)}
            id="view-all-button"
          >
            {showAll ? 'View Less ↑' : 'View all ↓'}
          </button>
        </div>
      )}
    </div>
  );
};

export default HoldingsTable;
