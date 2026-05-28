import React from 'react';
import { HarvestingProvider, useHarvesting } from './context/HarvestingContext';
import Header from './components/Header/Header';
import Disclaimer from './components/Disclaimer/Disclaimer';
import CapitalGainsCards from './components/CapitalGainsCards/CapitalGainsCards';
import RecommendationPanel from './components/RecommendationPanel/RecommendationPanel';
import HoldingsTable from './components/HoldingsTable/HoldingsTable';
import './App.css';

const AppContent: React.FC = () => {
  const {
    state,
    preGains,
    afterGains,
    savings,
    toggleHolding,
    selectAll,
    deselectAll,
    selectRecommended,
    allSelected,
    someSelected,
    retry,
  } = useHarvesting();

  if (state.error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">Failed to load data</h3>
          <p className="error-message">{state.error}</p>
          <button className="error-retry-btn" onClick={retry} id="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Tax Harvesting</h1>
          <div className="how-widget">
            <a href="#how-it-works" className="how-it-works-link" id="how-it-works-link">
              How it works?
            </a>
            <div className="info-tooltip" role="dialog" aria-label="Tax harvesting information">
              <p>
                Lorem ipsum dolor sit amet consectetur. Euismod id posuere nibh semper mattis scelerisque tellus.
                Vel mattis diam duis morbi tellus dui consectetur.
              </p>
              <a href="#learn-more" className="info-tooltip-link">
                Learn More
              </a>
            </div>
          </div>
        </div>

        <Disclaimer />

        <RecommendationPanel
          holdings={state.holdings}
          selectedIds={state.selectedIds}
          loading={state.loading}
          onSelectRecommended={selectRecommended}
        />

        <CapitalGainsCards
          preGains={preGains}
          afterGains={afterGains}
          savings={savings}
          loading={state.loading}
        />

        <HoldingsTable
          holdings={state.holdings}
          selectedIds={state.selectedIds}
          allSelected={allSelected}
          someSelected={someSelected}
          onToggle={toggleHolding}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          loading={state.loading}
        />
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <HarvestingProvider>
    <AppContent />
  </HarvestingProvider>
);

export default App;
