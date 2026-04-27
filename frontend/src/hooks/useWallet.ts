import { useEffect } from 'react';
import { useWalletStore } from '../stores/wallet.store';

export function useWallet() {
  const store = useWalletStore();

  useEffect(() => {
    store.fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return store;
}
