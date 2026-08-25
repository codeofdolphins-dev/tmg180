import { SlidersHorizontal } from 'lucide-react';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

/**
 * Settings — governance portal. Renders inside GovernanceLayout (shared
 * fixed sidebar + top bar); this file is content only, on the portal card
 * idiom shared with the participant / worker workspaces.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-2">{label}</label>
      {children}
    </div>
  );
}

function TextInput(props) {
  return (
    <input
      type="text"
      className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-600"
      {...props}
    />
  );
}

/** Shared react-select in the portal theme; plain string options in, string out. */
function SelectField({ options, defaultValue, ...props }) {
  return (
    <Select
      look="box"
      defaultValue={defaultValue ? { value: defaultValue, label: defaultValue } : null}
      options={options.map((o) => ({ value: o, label: o }))}
      {...props}
    />
  );
}

export default function SettingsPage() {
  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-slate-900">Settings</h1>

      <section className={CARD}>
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal size={16} className="text-sky-600" />
          <h2 className="text-base font-bold text-slate-900">Platform Essentials</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <Field label="Platform Name">
            <TextInput defaultValue="TMG180 Governance" />
          </Field>
          <Field label="Default Timezone">
            <SelectField
              inputId="default-timezone"
              aria-label="Default Timezone"
              defaultValue="Australia/Sydney (AEST)"
              options={['Australia/Sydney (AEST)', 'UTC', 'America/New_York (EST)']}
            />
          </Field>
          <Field label="Default Language">
            <SelectField
              inputId="default-language"
              aria-label="Default Language"
              defaultValue="English (Australia)"
              options={['English (Australia)', 'English (US)', 'French']}
            />
          </Field>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex justify-end">
          <Button variant="primary" className="w-auto! px-6! py-2.5!">
            Save Changes
          </Button>
        </div>
      </section>
    </div>
  );
}
