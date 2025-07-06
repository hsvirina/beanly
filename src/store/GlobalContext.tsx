import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  type ReactNode,
} from 'react';
import axios from 'axios';
import type { Cafe } from '../types/Cafe';

type GlobalContextType = {
  cafes: Cafe[];
  loading: boolean;
  error: string | null;
  refetchCafes: () => void;
};

export const GlobalContext = createContext<GlobalContextType>({
  cafes: [],
  loading: false,
  error: null,
  refetchCafes: () => {},
});

type Props = {
  children: ReactNode;
};

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCafes = useCallback(() => {
    setLoading(true);
    setError(null);

    axios
      .get('http://ec2-54-221-160-23.compute-1.amazonaws.com/api/cafes')
      .then(response => {
        setCafes(response.data);
      })
      .catch(err => {
        setError(err.message || 'Ошибка при загрузке кафе');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchCafes();
  }, [fetchCafes]);

  const value = useMemo(
    () => ({
      cafes,
      loading,
      error,
      refetchCafes: fetchCafes,
    }),
    [cafes, loading, error, fetchCafes]
  );

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};