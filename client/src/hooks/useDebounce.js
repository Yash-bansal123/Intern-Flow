import { useState, useEffect } from 'react';

/**
 * useDebounce – debounce a value with configurable delay.
 * @param {*} value - the value to debounce
 * @param {number} delay - debounce delay in ms (default 300)
 * @returns {*} debounced value
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
