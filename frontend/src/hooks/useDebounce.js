// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    // Cleanup timeout jika value atau delay berubah sebelum timeout selesai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Hanya re-call effect jika value atau delay berubah
  return debouncedValue;
}