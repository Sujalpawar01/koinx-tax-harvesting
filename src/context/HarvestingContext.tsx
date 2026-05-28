import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import type { CapitalGains, Holding, ComputedGains } from '../types';
import { fetchCapitalGains } from '../api/capitalGainsApi';
import { fetchHoldings } from '../api/holdingsApi';

interface HarvestingState {
  baseGains: CapitalGains | null;
  holdings: Holding[];
  selectedIds: Set<number>;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'SET_DATA'; payload: { gains: CapitalGains; holdings: Holding[] } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'TOGGLE_HOLDING'; payload: number }
  | { type: 'SELECT_ALL' }
  | { type: 'DESELECT_ALL' }
  | { type: 'SELECT_MANY'; payload: number[] };

const initialState: HarvestingState = {
  baseGains: null,
  holdings: [],
  selectedIds: new Set(),
  loading: true,
  error: null,
};

function reducer(state: HarvestingState, action: Action): HarvestingState {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        baseGains: action.payload.gains,
        holdings: action.payload.holdings,
        loading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'TOGGLE_HOLDING': {
      const newSelected = new Set(state.selectedIds);
      if (newSelected.has(action.payload)) {
        newSelected.delete(action.payload);
      } else {
        newSelected.add(action.payload);
      }
      return { ...state, selectedIds: newSelected };
    }
    case 'SELECT_ALL': {
      const allIds = new Set(state.holdings.map((_, i) => i));
      return { ...state, selectedIds: allIds };
    }
    case 'DESELECT_ALL':
      return { ...state, selectedIds: new Set() };
    case 'SELECT_MANY': {
      const newSelected = new Set(state.selectedIds);
      action.payload.forEach((id) => newSelected.add(id));
      return { ...state, selectedIds: newSelected };
    }
    default:
      return state;
  }
}

function computeGains(base: CapitalGains): ComputedGains {
  const stcgNet = base.stcg.profits - base.stcg.losses;
  const ltcgNet = base.ltcg.profits - base.ltcg.losses;
  return {
    stcg: { profits: base.stcg.profits, losses: base.stcg.losses, net: stcgNet },
    ltcg: { profits: base.ltcg.profits, losses: base.ltcg.losses, net: ltcgNet },
    realisedGains: stcgNet + ltcgNet,
  };
}

function computeAfterGains(
  base: CapitalGains,
  holdings: Holding[],
  selectedIds: Set<number>
): ComputedGains {
  let stcgProfits = base.stcg.profits;
  let stcgLosses = base.stcg.losses;
  let ltcgProfits = base.ltcg.profits;
  let ltcgLosses = base.ltcg.losses;

  selectedIds.forEach((idx) => {
    const holding = holdings[idx];
    if (!holding) return;
    if (holding.stcg.gain > 0) stcgProfits += holding.stcg.gain;
    else if (holding.stcg.gain < 0) stcgLosses += Math.abs(holding.stcg.gain);
    if (holding.ltcg.gain > 0) ltcgProfits += holding.ltcg.gain;
    else if (holding.ltcg.gain < 0) ltcgLosses += Math.abs(holding.ltcg.gain);
  });

  const stcgNet = stcgProfits - stcgLosses;
  const ltcgNet = ltcgProfits - ltcgLosses;
  return {
    stcg: { profits: stcgProfits, losses: stcgLosses, net: stcgNet },
    ltcg: { profits: ltcgProfits, losses: ltcgLosses, net: ltcgNet },
    realisedGains: stcgNet + ltcgNet,
  };
}

interface HarvestingContextValue {
  state: HarvestingState;
  preGains: ComputedGains | null;
  afterGains: ComputedGains | null;
  savings: number;
  toggleHolding: (idx: number) => void;
  selectAll: () => void;
  deselectAll: () => void;
  selectRecommended: (indices: number[]) => void;
  allSelected: boolean;
  someSelected: boolean;
  retry: () => void;
}

const HarvestingContext = createContext<HarvestingContextValue | null>(null);

export function HarvestingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadData = async () => {
    try {
      const [gainsResponse, holdingsData] = await Promise.all([
        fetchCapitalGains(),
        fetchHoldings(),
      ]);
      const sorted = [...holdingsData].sort(
        (a, b) => Math.abs(b.stcg.gain) - Math.abs(a.stcg.gain)
      );
      dispatch({
        type: 'SET_DATA',
        payload: { gains: gainsResponse.capitalGains, holdings: sorted },
      });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data. Please try again.' });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const preGains = state.baseGains ? computeGains(state.baseGains) : null;
  const afterGains = state.baseGains
    ? computeAfterGains(state.baseGains, state.holdings, state.selectedIds)
    : null;

  const savings = preGains && afterGains ? preGains.realisedGains - afterGains.realisedGains : 0;

  const toggleHolding = (idx: number) => dispatch({ type: 'TOGGLE_HOLDING', payload: idx });
  const selectAll = () => dispatch({ type: 'SELECT_ALL' });
  const deselectAll = () => dispatch({ type: 'DESELECT_ALL' });
  const selectRecommended = (indices: number[]) => dispatch({ type: 'SELECT_MANY', payload: indices });

  const allSelected = state.holdings.length > 0 && state.selectedIds.size === state.holdings.length;
  const someSelected = state.selectedIds.size > 0 && !allSelected;

  const retry = () => { loadData(); };

  return (
    <HarvestingContext.Provider
      value={{
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
      }}
    >
      {children}
    </HarvestingContext.Provider>
  );
}

export function useHarvesting(): HarvestingContextValue {
  const ctx = useContext(HarvestingContext);
  if (!ctx) throw new Error('useHarvesting must be used within HarvestingProvider');
  return ctx;
}
