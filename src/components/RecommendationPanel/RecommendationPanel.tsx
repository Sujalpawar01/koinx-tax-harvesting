import { useMemo } from 'react';
import type { FC } from 'react';
import type { Holding } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import './RecommendationPanel.css';

interface RecommendationPanelProps {
  holdings: Holding[];
  selectedIds: Set<number>;
  loading: boolean;
  onSelectRecommended: (indices: number[]) => void;
}

const RecommendationPanel: FC<RecommendationPanelProps> = ({
  holdings,
  selectedIds,
  loading,
  onSelectRecommended,
}) => {
  const recommendations = useMemo(() => {
    return holdings
      .map((holding, index) => ({
        index,
        holding,
        score: Math.abs(holding.stcg.gain) + Math.abs(holding.ltcg.gain),
      }))
      .filter(({ index }) => !selectedIds.has(index))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [holdings, selectedIds]);

  const selectedCount = selectedIds.size;
  const recommendationIds = recommendations.map((item) => item.index);

  if (loading && holdings.length === 0) {
    return (
      <section className="recommendation-panel recommendation-panel--loading">
        <div className="recommendation-header">
          <div>
            <p className="recommendation-subtitle">Actionable insight</p>
            <h2 className="recommendation-title">Harvest recommendations</h2>
          </div>
        </div>
        <div className="recommendation-skeleton-list">
          {[1, 2, 3].map((item) => (
            <div key={item} className="recommendation-skeleton-card" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="recommendation-panel">
      <div className="recommendation-header">
        <div>
          <p className="recommendation-subtitle">Actionable insight</p>
          <h2 className="recommendation-title">Harvest recommendations</h2>
        </div>
        {recommendationIds.length > 0 && (
          <button
            type="button"
            className="recommendation-action"
            onClick={() => onSelectRecommended(recommendationIds)}
          >
            Select top {recommendationIds.length}
          </button>
        )}
      </div>

      <p className="recommendation-description">
        {selectedCount > 0
          ? `You have selected ${selectedCount} holding${selectedCount === 1 ? '' : 's'}. These recommendations can help strengthen your tax harvesting outcome.`
          : 'Select holdings to view the best tax harvesting recommendations for your portfolio.'}
      </p>

      <div className="recommendation-list">
        {recommendations.map(({ holding, score, index }) => (
          <article key={`${holding.coin}-${index}`} className="recommendation-card">
            <div className="recommendation-card__header">
              <div className="recommendation-avatar">
                <img
                  src={holding.logo}
                  alt={holding.coin}
                  onError={(event) => {
                    (event.target as HTMLImageElement).src = 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
                  }}
                />
              </div>
              <div>
                <p className="recommendation-coin">{holding.coin}</p>
                <p className="recommendation-name">{holding.coinName}</p>
              </div>
            </div>
            <div className="recommendation-metrics">
              <span>Short-term {holding.stcg.gain >= 0 ? 'gain' : 'loss'}</span>
              <strong className={holding.stcg.gain >= 0 ? 'positive' : 'negative'}>
                {holding.stcg.gain >= 0 ? '+' : ''}{formatCurrency(holding.stcg.gain)}
              </strong>
            </div>
            <div className="recommendation-metrics">
              <span>Long-term {holding.ltcg.gain >= 0 ? 'gain' : 'loss'}</span>
              <strong className={holding.ltcg.gain >= 0 ? 'positive' : 'negative'}>
                {holding.ltcg.gain >= 0 ? '+' : ''}{formatCurrency(holding.ltcg.gain)}
              </strong>
            </div>
            <div className="recommendation-footer">
              <span>{formatNumber(holding.totalHolding)} {holding.coin}</span>
              <span className="recommendation-score">Priority {Math.round(score)}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RecommendationPanel;
