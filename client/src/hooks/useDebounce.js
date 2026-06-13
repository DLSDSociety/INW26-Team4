import { useState, useEffect } from 'react';
 
/**
 * Returns 'value' but only after it has been unchanged for 'delay' ms.
 * Use case: useDebounce(searchInput, 400) — fire API only when user stops typing.
 */
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
 
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
 
    // Cleanup — cancel previous timer if value changes again
    return () => clearTimeout(timer);
  }, [value, delay]);
 
  return debounced;
};
 
export default useDebounce;

