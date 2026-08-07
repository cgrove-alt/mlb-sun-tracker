/**
 * Shared react-select styling for the game/venue dropdowns.
 *
 * This 38-line object was duplicated byte-for-byte in GameSelector.tsx and
 * UnifiedGameSelector.tsx. The two components are genuinely different — one is
 * MLB-only, the other handles MLB/MiLB/NFL plus a mobile layout — so neither is
 * redundant, but their styling had no reason to be maintained twice: a colour
 * tweak in one silently left the other looking different.
 *
 * Defined at module scope rather than inside a component so the object identity
 * is stable across renders (react-select re-computes styles when it changes).
 */
export const customSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: 'white',
    color: '#000',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#000',
    fontWeight: 600,
    opacity: 1,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#666',
    fontWeight: 500,
    opacity: 1,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    color: state.isSelected ? 'white' : '#000',
    backgroundColor: state.isSelected ? '#1a237e' : state.isFocused ? '#f5f5f5' : 'white',
    fontWeight: state.isSelected ? 600 : 500,
    opacity: 1,
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'white',
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#000',
    opacity: 1,
  }),
};
