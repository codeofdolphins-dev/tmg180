import { useState } from 'react';
import {
  User,
  Info,
  ChevronRight,
  Heart,
  Clock,
  MessageCircle,
  MapPin,
  Languages,
  Sparkles,
  LoaderCircle,
  TriangleAlert,
} from 'lucide-react';
import {
  DEFAULT_SESSION_PREFERENCES,
  SESSION_PREFERENCE_GROUPS,
  SESSION_PREFERENCE_STATUS,
} from '@tmg180/shared';
import Button from '../../components/ui/Button';
import { toggleInList } from '../../hooks/participant/profile';
import {
  useSessionPreferences,
  useSaveSessionPreferences,
} from '../../hooks/participant/sessionPreferences';

/** Presentation only — each group's label, subtitle and options live in @tmg180/shared. */
const GROUP_ICONS = {
  support_focus: { icon: Heart, tone: 'bg-sky-100 text-sky-600' },
  availability: { icon: Clock, tone: 'bg-purple-100 text-brand-600' },
  communication_format: { icon: MessageCircle, tone: 'bg-emerald-100 text-emerald-600' },
  setting: { icon: MapPin, tone: 'bg-sky-100 text-sky-600' },
  languages: { icon: Languages, tone: 'bg-purple-100 text-brand-600' },
  relational_style: { icon: Sparkles, tone: 'bg-slate-200 text-slate-700' },
};

const groupOf = (key) => SESSION_PREFERENCE_GROUPS.find((group) => group.key === key);

function Chip({ label, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
        selected
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );
}

function SectionCard({ groupKey, selected, onToggle }) {
  const group = groupOf(groupKey);
  const { icon: Icon, tone } = GROUP_ICONS[groupKey];
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-center gap-2.5 mb-1">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tone}`}
        >
          <Icon size={15} />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">{group.label}</h2>
      </div>
      {group.subtitle && <p className="text-xs text-slate-500 mb-4 ml-10.5">{group.subtitle}</p>}
      <div className={`flex flex-wrap gap-2 ${group.subtitle ? '' : 'mt-4'}`}>
        {group.options.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={selected.includes(option)}
            onToggle={() => onToggle(option)}
          />
        ))}
      </div>
    </div>
  );
}

export default function SessionPreferences() {
  const { data, isLoading, error } = useSessionPreferences();
  const save = useSaveSessionPreferences();

  // A null draft means "not edited yet — mirror the server". Editing copies
  // the current selections; a successful save clears back to mirroring, so a
  // background refetch can never wipe unsaved chips.
  const [draft, setDraft] = useState(null);
  const selections = draft ?? data?.selections ?? DEFAULT_SESSION_PREFERENCES;

  const toggle = (groupKey) => (option) =>
    setDraft({ ...selections, [groupKey]: toggleInList(selections[groupKey], option) });

  const saveAs = (status) =>
    save.mutate({ selections, status }, { onSuccess: () => setDraft(null) });

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <User size={12} />
        <span>My Profile</span>
        <ChevronRight size={12} />
        <span className="font-semibold text-brand-600 tracking-wide">PREFERENCES</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">Session Preferences</h1>
        <p className="text-base text-slate-500 mt-1">
          Set preferences for your filters and planning.
        </p>
      </div>

      <div className="flex items-center gap-3 bg-purple-50 rounded-full px-4 py-3">
        <Info size={16} className="text-brand-600 shrink-0" />
        <p className="text-sm text-slate-700">
          These preferences help you filter and plan. You choose who to contact directly.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 text-slate-500 bg-white/80 rounded-xl p-6">
          <LoaderCircle size={18} className="animate-spin" />
          Loading your preferences…
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn&rsquo;t load your preferences.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {data && (
        <>
          <SectionCard
            groupKey="support_focus"
            selected={selections.support_focus}
            onToggle={toggle('support_focus')}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard
              groupKey="availability"
              selected={selections.availability}
              onToggle={toggle('availability')}
            />
            <SectionCard
              groupKey="communication_format"
              selected={selections.communication_format}
              onToggle={toggle('communication_format')}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard
              groupKey="setting"
              selected={selections.setting}
              onToggle={toggle('setting')}
            />
            <SectionCard
              groupKey="languages"
              selected={selections.languages}
              onToggle={toggle('languages')}
            />
          </div>

          <SectionCard
            groupKey="relational_style"
            selected={selections.relational_style}
            onToggle={toggle('relational_style')}
          />

          {save.error && (
            <p className="text-sm text-rose-700 text-right">{save.error.message}</p>
          )}

          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              className="w-auto! px-5! py-2.5!"
              disabled={save.isPending}
              onClick={() => saveAs(SESSION_PREFERENCE_STATUS.DRAFT)}
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              className="w-auto! px-5! py-2.5!"
              disabled={save.isPending}
              onClick={() => saveAs(SESSION_PREFERENCE_STATUS.SAVED)}
            >
              {save.isPending ? 'Saving…' : 'Save Preferences'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
