import { useState, useCallback } from 'react';

interface LoadingState {
  vanta: 'idle' | 'loading' | 'loaded' | 'error';
  images: 'idle' | 'loading' | 'loaded';
  animations: 'idle' | 'loading' | 'loaded';
}

interface LoadingActions {
  setVantaState: (state: LoadingState['vanta']) => void;
  setImagesState: (state: LoadingState['images']) => void;
  setAnimationsState: (state: LoadingState['animations']) => void;
  isLoading: boolean;
  hasErrors: boolean;
}

export function useLoadingState(): LoadingState & LoadingActions {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    vanta: 'idle',
    images: 'idle',
    animations: 'idle'
  });

  const setVantaState = useCallback((state: LoadingState['vanta']) => {
    setLoadingState(prev => ({ ...prev, vanta: state }));
  }, []);

  const setImagesState = useCallback((state: LoadingState['images']) => {
    setLoadingState(prev => ({ ...prev, images: state }));
  }, []);

  const setAnimationsState = useCallback((state: LoadingState['animations']) => {
    setLoadingState(prev => ({ ...prev, animations: state }));
  }, []);

  const isLoading = Object.values(loadingState).some(state => state === 'loading');
  const hasErrors = Object.values(loadingState).some(state => state === 'error');

  return {
    ...loadingState,
    setVantaState,
    setImagesState,
    setAnimationsState,
    isLoading,
    hasErrors
  };
}