import React, { useState, useCallback } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import useDebounce from '../../hooks/useDebounce';
import { useEffect } from 'react';

/**
 * SearchBar – debounced search input with clear button.
 *
 * @param {{
 *   value?: string,
 *   onChange: (value: string) => void,
 *   placeholder?: string,
 *   debounceMs?: number,
 *   sx?: object,
 * }} props
 */
const SearchBar = ({
  value: externalValue,
  onChange,
  placeholder = 'Search…',
  debounceMs = 300,
  sx = {},
  ...rest
}) => {
  const [localValue, setLocalValue] = useState(externalValue || '');
  const debouncedValue = useDebounce(localValue, debounceMs);

  // Fire callback on debounced change
  useEffect(() => {
    onChange?.(debouncedValue);
  }, [debouncedValue]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync with external value when it changes
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== localValue) {
      setLocalValue(externalValue);
    }
  }, [externalValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange?.('');
  }, [onChange]);

  return (
    <TextField
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          </InputAdornment>
        ),
        endAdornment: localValue ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear} edge="end">
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        minWidth: 220,
        '& .MuiOutlinedInput-root': {
          bgcolor: 'background.paper',
        },
        ...sx,
      }}
      {...rest}
    />
  );
};

export default SearchBar;
