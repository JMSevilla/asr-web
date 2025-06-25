import { ClickAwayListener, Portal } from '@mui/base';
import { Box, useTheme } from '@mui/material';
import React, { ChangeEvent, useRef, useState } from 'react';
import { Address, AddressSummary, SearchAddressParams } from '../../../api/mdp/types';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useDebounce } from '../../../core/hooks/useDebounce';
import { AddressSearchInput } from './AddressSearchInput';
import { AddressSearchList } from './AddressSearchList';
import { AddressSearchListItem } from './AddressSearchListItem';

const DEBOUNCE_MS = 300;

interface Props {
  id?: string;
  locale: string;
  inline?: boolean;
  placeholder?: string;
  value?: string;
  country?: string | null;
  onSelect(address: Address): void;
  onAddressDetailsLookup(addressId: string): Promise<Address[]>;
  onAddressSummaryLookup(params: SearchAddressParams): Promise<AddressSummary[]>;
}

export const AddressSearch: React.FC<Props> = ({
  id,
  locale,
  inline,
  placeholder,
  country,
  onSelect,
  onAddressDetailsLookup,
  onAddressSummaryLookup,
}) => {
  const theme = useTheme();
  const { labelByKey } = useGlobalsContext();
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSummary[]>([]);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);
  const anchorRef = useRef<HTMLDivElement>(null);
  const rect = anchorRef.current?.getBoundingClientRect();
  const [loading, setLoading] = useState(false);

  useDebounce(
    () => {
      if (value === '') {
        return clearSelection();
      }
      lookupItems(value, '', country).then(setSuggestions);
    },
    DEBOUNCE_MS,
    [value],
  );

  return (
    <Box position="relative" ref={anchorRef} data-testid="address-search">
      <AddressSearchInput
        autoComplete="off"
        onChange={handleChange}
        value={value}
        onKeyDown={e => e.code === 'Escape' && clearSelection}
        placeholder={placeholder}
        inputProps={{ id, 'data-testid': 'address-lookup-field', 'aria-label': labelByKey('address_lookup_field') }}
      />

      <Portal container={document.body} disablePortal={inline}>
        <ClickAwayListener onClickAway={clearSelection}>
          <AddressSearchList
            style={{
              position: 'absolute',
              top: rect?.height ?? 0,
              left: 0,
              width: rect?.width ?? undefined,
            }}
            loading={loading}
            hidden={!suggestions.length}
          >
            {suggestions.map((suggestion, i) => (
              <AddressSearchListItem
                tabIndex={0}
                ref={element => (itemsRef.current[i] = element)}
                key={suggestion.addressId + i}
                onClick={() => handleSelect(suggestion)}
                onKeyDown={handleKeyDown(suggestion, i)}
                value={value}
                suggestion={suggestion}
                style={{
                  borderBottom: i !== suggestions.length - 1 ? `1px solid ${theme.palette.divider}` : 'unset',
                }}
              >
                {suggestion.text} {suggestion.description}
              </AddressSearchListItem>
            ))}
          </AddressSearchList>
        </ClickAwayListener>
      </Portal>
    </Box>
  );

  function handleKeyDown(suggestion: AddressSummary, index: number) {
    return (e: React.KeyboardEvent<HTMLElement>) => {
      switch (e.code) {
        case 'Enter':
        case 'Space':
          handleSelect(suggestion);
          break;
        case 'ArrowUp': {
          itemsRef.current[index - 1]?.focus();
          break;
        }
        case 'ArrowDown': {
          itemsRef.current[index + 1]?.focus();
          break;
        }
        case 'Escape': {
          setSuggestions([]);
          break;
        }
        default:
          break;
      }
    };
  }

  async function handleSelect({ type, addressId }: AddressSummary) {
    setLoading(true);
    if (type !== 'Address') {
      const items = await lookupItems(value, addressId);
      setSuggestions(items);
      setLoading(false);
      return;
    }

    const data = await onAddressDetailsLookup(addressId);

    if (data.length) {
      clearSelection();
    }

    onSelect(data[0]);
    setValue('');
    setLoading(false);
  }

  function clearSelection() {
    setSuggestions([]);
  }

  async function lookupItems(text: string, container?: string, countries?: string | null) {
    const language = parseLanguageCodeFromLocale(locale);
    const data = await onAddressSummaryLookup({ text, container, countries, language });
    return data || [];
  }

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }
};

const parseLanguageCodeFromLocale = (locale: string): string => locale.split('_')[0];
