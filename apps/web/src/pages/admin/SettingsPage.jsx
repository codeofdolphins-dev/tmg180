import { SlidersHorizontal, ChevronDown, UserCircle, Settings } from 'lucide-react';
import GovernanceLayout from '../../components/layout/admin/GovernanceLayout';
import { GOV_NAV_ITEMS } from '../../components/layout/admin/GovernanceSidebar';
import Button from '../../components/ui/Button';

const NAV_ITEMS = [...GOV_NAV_ITEMS, { label: 'Settings', icon: Settings }];
const BOTTOM_ITEMS = [{ label: 'Admin Profile', icon: UserCircle }];

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

function Select({ options, defaultValue }) {
  return (
    <div className="relative">
      <select
        defaultValue={defaultValue}
        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-600"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <GovernanceLayout
      portalLabel="Admin Console"
      activeItem="Settings"
      logo="diamond"
      uppercaseLabel={false}
      activeStyle="soft"
      navItems={NAV_ITEMS}
      bottomItems={BOTTOM_ITEMS}
      showHelp
      showSupport={false}
    >
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Settings</h1>

      <div className="bg-white border border-slate-200 rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal size={16} className="text-sky-600" />
          <h2 className="text-base font-bold text-slate-900">Platform Essentials</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <Field label="Platform Name">
            <TextInput defaultValue="TMG180 Governance" />
          </Field>
          <Field label="Default Timezone">
            <Select
              defaultValue="Australia/Sydney (AEST)"
              options={['Australia/Sydney (AEST)', 'UTC', 'America/New_York (EST)']}
            />
          </Field>
          <Field label="Default Language">
            <Select
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
      </div>
    </GovernanceLayout>
  );
}
