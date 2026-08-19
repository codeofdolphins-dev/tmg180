import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  BookOpen,
  Bookmark,
  ChevronRight,
  FileText,
  FolderOpen,
  Handshake,
  Info,
  Lightbulb,
  LoaderCircle,
  ScrollText,
  Sparkles,
  TriangleAlert,
  Users,
} from 'lucide-react';
import {
  LEARNING_LIBRARIES,
  LEARNING_LIBRARY_TABS,
  LEARNING_RESOURCE_STATUS,
  learningKindLabel,
} from '@tmg180/shared';
import { useLearningHub } from '../../hooks/worker/learning';
import { useWorkerProfile } from '../../hooks/worker/profile';
import { WORKER_PATHS, workerLearningPath } from '../../routes/paths';

/**
 * Learning Hub — Figma 1169:3676, on the UI scale.
 *
 * The module cards and the Core Library / Optional Reading split come from the
 * frame; the readings under them come from `GET /worker/learning`, along with
 * this worker's own progress on each one.
 *
 * The content map is unwritten (it is Sue's), so the four canonical manuals
 * are listed exactly where the frame puts them and say plainly that their text
 * is still to come — nothing is invented in their place, and a reading that
 * cannot be read is not a live-looking link. The readings that *are* published
 * are the ones about how this workspace itself works, which are ours to write.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

/**
 * Per-module icon and accent, verbatim from the frame — a circular tile per
 * topic. Colour distinguishes topic here, it is not decoration, so it stays
 * even though the card chrome around it is on the shared scale.
 */
const MODULE_STYLE = {
  mandatory_policies: { icon: ScrollText, tile: 'bg-[#ffdad6] text-[#a80710]' },
  practice_standards: { icon: BadgeCheck, tile: 'bg-[#007a53] text-white' },
  support_interpretation: { icon: Handshake, tile: 'bg-[#2170e4] text-white' },
  relational_discipline: { icon: Users, tile: 'bg-[#861fdd] text-white' },
  templates_how_to: { icon: FolderOpen, tile: 'bg-[#cbdbf5] text-[#2170e4]' },
};

const KIND_ICON = {
  manual: BookOpen,
  framework: BookOpen,
  quick_guide: Lightbulb,
  explainer: Lightbulb,
  how_to: FileText,
  template: FileText,
};

/**
 * One link row inside a module card — the frame's pill: icon, one line, chevron.
 *
 * The single line is the reading's own title once there is one to name, and
 * falls back to the kind ("Full manual", "Quick guide") while its text is still
 * to come. That reproduces the frame exactly for the four canonical modules,
 * whose readings are all unwritten, without leaving the six published readings
 * under "How-to guide" five times over.
 */
function ReadingRow({ reading, onOpen }) {
  const available = reading.status === LEARNING_RESOURCE_STATUS.PUBLISHED;
  const Icon = KIND_ICON[reading.kind] ?? FileText;
  const done = Boolean(reading.progress?.completedAt);

  return (
    <button
      onClick={available ? onOpen : undefined}
      disabled={!available}
      title={available ? undefined : 'Not published yet'}
      className={`w-full flex items-center justify-between gap-3 rounded-full px-4 py-3.5 text-left transition-colors ${
        available ? 'bg-[#f8f9ff] hover:bg-purple-50' : 'bg-[#f8f9ff]/60 cursor-not-allowed'
      }`}
    >
      <span className="flex items-center gap-3 min-w-0">
        <Icon size={16} className={available ? 'text-brand-600 shrink-0' : 'text-slate-400 shrink-0'} />
        <span
          className={`text-sm font-medium truncate ${
            available ? 'text-slate-900' : 'text-slate-500'
          }`}
        >
          {available ? reading.title : learningKindLabel(reading.kind)}
        </span>
      </span>
      <span className="flex items-center gap-2 shrink-0">
        {reading.progress?.savedAt && <Bookmark size={13} className="text-brand-600" />}
        {done && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            Read
          </span>
        )}
        {available ? (
          <ChevronRight size={15} className="text-slate-400" />
        ) : (
          <span className="text-[11px] text-slate-400">To come</span>
        )}
      </span>
    </button>
  );
}

/**
 * The frame lays five cards over three columns: three modules on the top row,
 * then Relational Discipline beside a double-width Templates & How-to Guides.
 * `wide` is what earns that second column, and only that card carries a blurb
 * under its title — the others are a title and their two links, as drawn.
 */
function ModuleCard({ module, readings, wide, onOpen }) {
  const style = MODULE_STYLE[module.key] ?? MODULE_STYLE.templates_how_to;
  const Icon = style.icon;
  return (
    <section className={`${CARD} ${wide ? 'md:col-span-2' : ''} flex flex-col`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${style.tile}`}>
          <Icon size={21} />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900 leading-snug">{module.title}</h2>
          {wide && <p className="text-xs text-slate-500 mt-0.5">{module.blurb}</p>}
        </div>
      </div>
      <div className={`grid gap-3 mt-6 ${wide ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
        {readings.map((reading) => (
          <ReadingRow key={reading.slug} reading={reading} onOpen={() => onOpen(reading)} />
        ))}
        {readings.length === 0 && (
          <p className="text-sm text-slate-500">Nothing published in this module yet.</p>
        )}
      </div>
    </section>
  );
}

export default function LearningHub() {
  const navigate = useNavigate();
  const hub = useLearningHub();
  const profile = useWorkerProfile();
  const [library, setLibrary] = useState(LEARNING_LIBRARIES.CORE);

  const data = hub.data;
  const inLibrary = data?.resources.filter((reading) => reading.library === library) ?? [];
  const open = (reading) => navigate(workerLearningPath.resource(reading.slug));

  // R-07: publishing is optional and never gates the workspace, so the pill
  // only appears while the profile is unpublished — and says so in those terms.
  const showOnboardingPill = profile.data && !profile.data.publication.isPublished;

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      {showOnboardingPill && (
        <button
          onClick={() => navigate(WORKER_PATHS.profile)}
          className="inline-flex items-center gap-2.5 bg-amber-50 text-amber-700 rounded-full px-4 py-2 w-fit hover:bg-amber-100 transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          <span className="text-sm font-medium">
            Complete onboarding to publish your profile to the directory — optional.
          </span>
        </button>
      )}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">Learning Hub</h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl">
          Micro-explainers, templates, and guidance to support your independent worker practice.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="bg-white/80 rounded-full p-1 flex items-center gap-1">
          {LEARNING_LIBRARY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setLibrary(tab.key)}
              className={`text-sm rounded-full px-5 py-2 transition-colors ${
                library === tab.key
                  ? 'bg-brand-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="inline-flex items-center gap-2 bg-purple-50 rounded-full px-3.5 py-1.5">
          <Sparkles size={13} className="text-brand-600" />
          <span className="text-xs font-semibold text-brand-700">
            AI search uses Core Library only.
          </span>
        </span>
      </div>

      {(hub.isLoading || profile.isLoading) && (
        <div className={`flex items-center gap-3 text-slate-500 ${CARD}`}>
          <LoaderCircle size={18} className="animate-spin" />
          Loading your readings…
        </div>
      )}
      {hub.error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn’t load the Learning Hub.</p>
            <p className="text-sm mt-1">{hub.error.message}</p>
          </div>
        </div>
      )}

      {data && inLibrary.length === 0 && (
        <div className={`${CARD} text-center py-12`}>
          <div className="w-14 h-14 rounded-full bg-purple-50 text-brand-600 flex items-center justify-center mx-auto">
            <BookOpen size={24} />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mt-4">Nothing in Optional Reading yet</h2>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
            Supplementary material will appear here once it is published. Everything you need is in the
            Core Library.
          </p>
        </div>
      )}

      {data && inLibrary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.modules.map((module) => {
            const readings = inLibrary.filter((reading) => reading.moduleKey === module.key);
            if (readings.length === 0) return null;
            return (
              <ModuleCard
                key={module.key}
                module={module}
                readings={readings}
                wide={readings.length > 2}
                onOpen={open}
              />
            );
          })}
        </div>
      )}

      {data && (
        <div className="border-t border-slate-200 pt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            {data.summary.completed} of {data.summary.published} available readings marked as read
            {data.summary.awaitingContent > 0 &&
              ` · ${data.summary.awaitingContent} still to be published`}
            .
          </p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <Info size={12} />
            Optional Reading is excluded from AI retrieval.
          </p>
        </div>
      )}
    </div>
  );
}
