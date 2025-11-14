import React, {createContext, useState, useContext, ReactNode} from 'react';

interface LoadingContextData {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  setLoadingWithDelay: (minDelay?: number) => Promise<void>;
}

const LoadingContext = createContext<LoadingContextData>(
  {} as LoadingContextData,
);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => {
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  // Show loading for at least minDelay milliseconds
  const setLoadingWithDelay = async (minDelay: number = 1000) => {
    const startTime = Date.now();
    setIsLoading(true);

    return new Promise<void>(resolve => {
      const checkAndHide = () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = minDelay - elapsedTime;

        if (remainingTime > 0) {
          setTimeout(() => {
            setIsLoading(false);
            resolve();
          }, remainingTime);
        } else {
          setIsLoading(false);
          resolve();
        }
      };

      checkAndHide();
    });
  };

  return (
    <LoadingContext.Provider
      value={{isLoading, showLoading, hideLoading, setLoadingWithDelay}}>
      {children}
    </LoadingContext.Provider>
  );
};

export function useLoading(): LoadingContextData {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }

  return context;
}
