import type { FC } from 'react';
import type { ComputedGains } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import './CapitalGainsCards.css';

const GainRow: FC<{
  label: string;
  stValue: number;
  ltValue: number;
  bold?: boolean;
  label2?: string;
}> = ({
  label,
  stValue,
  ltValue,
  bold,
  label2,
}) => {
  const isNegativeST = stValue < 0;
  const isNegativeLT = ltValue < 0;

  return (
    <div className={`gain-row ${bold ? 'gain-row--bold' : ''}`}>
      <div className="gain-row__label">{label2 ?? label}</div>
      <div className={`gain-row__value ${isNegativeST ? 'negative' : ''}`}>
        {formatCurrency(stValue)}
      </div>
      <div className={`gain-row__value ${isNegativeLT ? 'negative' : ''}`}>
        {formatCurrency(ltValue)}
      </div>
    </div>
  );
};

const SkeletonCard = ({ variant }: { variant: 'light' | 'blue' }) => (
  <div className={`gains-card gains-card--${variant}`}>
    <div className="skeleton skeleton-title" />
    <div className="gains-card__header-cols">
      <div className="skeleton skeleton-label" />
      <div className="skeleton skeleton-label" />
    </div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="gain-row">
        <div className="skeleton skeleton-row-label" />
        <div className="skeleton skeleton-row-val" />
        <div className="skeleton skeleton-row-val" />
      </div>
    ))}
    <div className="skeleton skeleton-realised" />
  </div>
);

interface CapitalGainsCardsProps {
  preGains: ComputedGains | null;
  afterGains: ComputedGains | null;
  savings: number;
  loading: boolean;
}

const CapitalGainsCards: FC<CapitalGainsCardsProps> = ({
  preGains,
  afterGains,
  savings,
  loading,
}) => {
  if (loading) {
    return (
      <div className="gains-cards-wrapper">
        <SkeletonCard variant="light" />
        <SkeletonCard variant="blue" />
      </div>
    );
  }

  if (!preGains || !afterGains) return null;

  const showSavings = savings > 0;

  return (
    <div className="gains-cards-wrapper">
      {/* Pre Harvesting Card */}
      <div className="gains-card gains-card--light">
        <h2 className="gains-card__title">Pre Harvesting</h2>

        <div className="gains-card__header-cols">
          <div className="gains-col-label">Short-term</div>
          <div className="gains-col-label">Long-term</div>
        </div>

        <div className="gains-card__divider" />

        <GainRow
          label="Profits"
          stValue={preGains.stcg.profits}
          ltValue={preGains.ltcg.profits}
        />
        <GainRow
          label="Losses"
          stValue={preGains.stcg.losses}
          ltValue={preGains.ltcg.losses}
        />
        <GainRow
          label="Net Capital Gains"
          stValue={preGains.stcg.net}
          ltValue={preGains.ltcg.net}
          bold
        />

        <div className="gains-card__divider" />

        <div className="gains-card__realised">
          <span className="gains-card__realised-label">Realised Capital Gains:</span>
          <span className={`gains-card__realised-value ${preGains.realisedGains < 0 ? 'negative' : ''}`}>
            {formatCurrency(preGains.realisedGains)}
          </span>
        </div>
      </div>

      {/* After Harvesting Card */}
      <div className="gains-card gains-card--blue">
        <h2 className="gains-card__title gains-card__title--white">After Harvesting</h2>

        <div className="gains-card__header-cols">
          <div className="gains-col-label gains-col-label--white">Short-term</div>
          <div className="gains-col-label gains-col-label--white">Long-term</div>
        </div>

        <div className="gains-card__divider gains-card__divider--white" />

        <div className="gain-row">
          <div className="gain-row__label gain-row__label--white">Profits</div>
          <div className="gain-row__value gain-row__value--white">
            {formatCurrency(afterGains.stcg.profits)}
          </div>
          <div className="gain-row__value gain-row__value--white">
            {formatCurrency(afterGains.ltcg.profits)}
          </div>
        </div>

        <div className="gain-row">
          <div className="gain-row__label gain-row__label--white">Losses</div>
          <div className="gain-row__value gain-row__value--white">
            {formatCurrency(afterGains.stcg.losses)}
          </div>
          <div className="gain-row__value gain-row__value--white">
            {formatCurrency(afterGains.ltcg.losses)}
          </div>
        </div>

        <div className="gain-row gain-row--bold">
          <div className="gain-row__label gain-row__label--white">Net Capital Gains</div>
          <div className="gain-row__value gain-row__value--white">
            {formatCurrency(afterGains.stcg.net)}
          </div>
          <div className="gain-row__value gain-row__value--white">
            {formatCurrency(afterGains.ltcg.net)}
          </div>
        </div>

        <div className="gains-card__divider gains-card__divider--white" />

        <div className="gains-card__realised gains-card__realised--blue">
          <span className="gains-card__realised-label gains-card__realised-label--white">
            Effective Capital Gains:
          </span>
          <span className="gains-card__realised-value gains-card__realised-value--white">
            {formatCurrency(afterGains.realisedGains)}
          </span>
        </div>

        {showSavings && (
          <div className="gains-card__savings">
            <span className="savings-emoji">🎉</span>
            <span className="savings-text">
              You're going to save <strong>{formatCurrency(savings)}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CapitalGainsCards;
