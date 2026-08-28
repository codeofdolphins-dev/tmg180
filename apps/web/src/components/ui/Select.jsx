import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { ChevronDown, X } from 'lucide-react';

/**
 * The app's select control — react-select, rendered `unstyled` so every class
 * comes from Tailwind and it sits inside the portal's design system rather
 * than fighting it.
 *
 * This is the first screen that needed a select (see the frontend stack note in
 * the project memory), so the styling lives here once: pages pass options and a
 * value, never class names. Two looks, both from the Figma frames:
 *   pill — the participant portal's white rounded-full field (default)
 *   box  — the worker/admin bordered field
 *
 * Values are plain strings on the outside; the { value, label } shape react-
 * select wants stays inside this component.
 */

const CONTROL_BASE =
  'flex items-center w-full min-h-12.5 text-base text-[#0b1c30] transition-colors cursor-pointer';

const CONTROL_LOOK = {
  pill: 'bg-white rounded-full px-4',
  box: 'bg-white border border-slate-300 rounded-full px-4',
};

const selectClassNames = (look = 'pill') => ({
  control: ({ isFocused, isDisabled }) =>
    [
      CONTROL_BASE,
      CONTROL_LOOK[look],
      isFocused ? 'ring-2 ring-brand-600/40' : '',
      isDisabled ? 'opacity-60 cursor-not-allowed' : '',
    ].join(' '),
  valueContainer: () => 'flex flex-wrap items-center gap-1.5 py-1.5',
  placeholder: () => 'text-[#6b7280]',
  singleValue: () => 'text-[#0b1c30]',
  input: () => 'text-[#0b1c30]',
  multiValue: () => 'flex items-center gap-2 bg-[#007a53]/20 rounded-full pl-3 pr-2 py-1',
  multiValueLabel: () => 'text-xs font-bold text-[#00291b]',
  multiValueRemove: () => 'text-[#00291b] hover:opacity-70',
  indicatorsContainer: () => 'flex items-center gap-1 text-slate-500',
  indicatorSeparator: () => 'hidden',
  menu: () =>
    'mt-2 bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden z-20',
  menuList: () => 'py-2 max-h-64 overflow-y-auto',
  option: ({ isFocused, isSelected }) =>
    [
      'px-4 py-2.5 text-base cursor-pointer transition-colors',
      isSelected ? 'bg-brand-600 text-white' : isFocused ? 'bg-brand-50 text-[#0b1c30]' : 'text-[#0b1c30]',
    ].join(' '),
  noOptionsMessage: () => 'px-4 py-3 text-sm text-slate-500',
  loadingMessage: () => 'px-4 py-3 text-sm text-slate-500',
  groupHeading: () => 'px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400',
});

const components = {
  DropdownIndicator: () => <ChevronDown size={18} className="text-slate-500" />,
  ClearIndicator: (props) => (
    <span {...props.innerProps} aria-label="Clear" className="text-slate-400 hover:text-slate-600">
      <X size={15} />
    </span>
  ),
  MultiValueRemove: (props) => (
    <span {...props.innerProps} aria-label="Remove">
      <X size={13} />
    </span>
  ),
};

export default function Select({ look = 'pill', creatable = false, ...props }) {
  const Component = creatable ? CreatableSelect : ReactSelect;
  return (
    <Component
      unstyled
      classNamePrefix="tmg-select"
      classNames={selectClassNames(look)}
      components={components}
      {...props}
    />
  );
}
