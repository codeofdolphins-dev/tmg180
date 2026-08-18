import { useState } from 'react';
import {
  Search,
  UserRound,
  FilePen,
  Download,
  Compass,
  ShieldCheck,
  Info,
  Plus,
  Minus,
  Headset,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PARTICIPANT_PATHS } from '../../routes/paths';

/**
 * Help Centre (Figma 1169:2152).
 *
 * Structure follows the frame — the bento grid of five topics with Privacy &
 * Sharing spanning two columns, the two-column FAQ, the support card — but the
 * type scale and card treatment are the portal's own (see
 * md/frontend/TMG180_Participant_UI_Scale.md). The frame's 48px title, 24px
 * card headings and per-card hues would read as a different product beside the
 * rest of the participant screens.
 *
 * The search box filters the topics and questions on this page — there is no
 * search service, and a box that swallows what you type would be worse than
 * one that does something small and honest. The FAQ answers are written from
 * what the portal actually does today; they need Sue's sign-off before launch.
 */

/**
 * Icon colours are the frame's, one per topic (1169:2152) — they are how the
 * five topics tell themselves apart. The tile behind them is the same #dce9ff
 * on every card, so the set still reads as one system.
 */
const TOPICS = [
  {
    title: 'Personal Profile',
    desc: 'Manage your personal profile information and preferences.',
    icon: UserRound,
    iconColor: 'text-[#0058be]',
    path: PARTICIPANT_PATHS.profile,
  },
  {
    title: 'Evidence & Snapshots',
    desc: 'Learn how to log daily support and track monthly progress.',
    icon: FilePen,
    iconColor: 'text-[#7800ce]',
    path: PARTICIPANT_PATHS.dailyLog,
  },
  {
    title: 'Snapshot Exports',
    desc: 'Guidance on downloading and sharing locked monthly reports.',
    icon: Download,
    iconColor: 'text-[#005f40]',
    path: PARTICIPANT_PATHS.snapshotExports,
  },
  {
    title: 'Verified Directory',
    desc: 'Navigating profiles and understanding direct worker contact.',
    icon: Compass,
    iconColor: 'text-[#2170e4]',
    path: PARTICIPANT_PATHS.browseWorkers,
  },
];

const PRIVACY_TOPIC = {
  title: 'Privacy & Sharing',
  desc: 'Information regarding data control, sharing settings, and regulatory governance standing.',
  note: 'Includes Australian Privacy Act 1988 (APPs) & Notifiable Data Breaches info.',
  path: PARTICIPANT_PATHS.privacySharing,
};

const FAQS = [
  {
    q: 'How do I update my Personal Profile?',
    a: 'Open My Personal Profile from the sidebar and choose any of the eleven sections. Nothing is locked — you can save a draft, leave, and pick up where you left off. Your profile keeps track of where you were up to.',
  },
  {
    q: 'How do I add a Daily Support Evidence Log?',
    a: 'Go to Daily Log and start a new log. Record the date, the goals it relates to and the areas of daily life it touched, then write what happened in your own words. A log needs between one and three goals and at least one area before you can submit it.',
  },
  {
    q: 'How do Monthly Snapshots work?',
    a: 'A snapshot gathers the logs you submitted in a month and counts what they say — days logged, goals worked on, how the month compared with your usual pattern. You add your own words, and nothing is final until you approve it.',
  },
  {
    q: 'How do I export a locked snapshot?',
    a: 'Once you have approved a snapshot, open it and choose Export Snapshot, or use Snapshot Exports for the full list. Your browser makes the PDF, so the document is created on your own device.',
  },
  {
    q: 'How does direct worker contact work?',
    a: 'You browse verified worker profiles and contact whoever you choose, directly. TMG180 never matches, ranks or assigns anyone to you, and no one is notified about who you looked at.',
  },
  {
    q: 'Who controls my information?',
    a: 'You do. Everything you record belongs to you and is private by default. A worker sees something only where you have given consent, and you can see and change that from Privacy & Sharing.',
  },
];

/** One card treatment across the portal — see the UI scale note above. */
const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';
const CARD_HOVER = 'hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow';

function TopicCard({ topic, onOpen }) {
  const Icon = topic.icon;
  return (
    <button onClick={onOpen} className={`text-left ${CARD} ${CARD_HOVER}`}>
      <div
        className={`w-11 h-11 rounded-xl bg-[#dce9ff] flex items-center justify-center ${topic.iconColor}`}
      >
        <Icon size={20} />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mt-4">{topic.title}</h2>
      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{topic.desc}</p>
    </button>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    // <div className="bg-white/80 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
    <div className="bg-white/80 rounded-xl shadow-md">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
      >
        <span className="text-sm font-medium text-slate-700">{item.q}</span>
        {open ? (
          <Minus size={15} className="text-brand-600 shrink-0" />
        ) : (
          <Plus size={15} className="text-slate-400 shrink-0" />
        )}
      </button>
      {open && (
        <p className="px-5 pb-4 -mt-1 text-sm text-slate-600 leading-relaxed">{item.a}</p>
      )}
    </div>
  );
}

export default function ParticipantHelpCentre() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const term = query.trim().toLowerCase();

  const matches = (...parts) =>
    !term || parts.filter(Boolean).some((part) => part.toLowerCase().includes(term));

  // Four topics and six questions — filtering them on every keystroke costs
  // nothing, and memoising a closure over the search term only adds a trap.
  const topics = TOPICS.filter((topic) => matches(topic.title, topic.desc));
  const showPrivacy = matches(PRIVACY_TOPIC.title, PRIVACY_TOPIC.desc, PRIVACY_TOPIC.note);
  const faqs = FAQS.filter((item) => matches(item.q, item.a));
  const nothingFound = topics.length === 0 && !showPrivacy && faqs.length === 0;

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Help Centre</h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl mx-auto">
          Find guidance about your profile, evidence logs, snapshots, exports, privacy and
          directory use.
        </p>

        <div className="mt-6 mx-auto max-w-xl bg-white/80 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-3 pl-5 pr-2 py-2">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search help topics"
            placeholder="Search help topics..."
            className="flex-1 min-w-0 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => setQuery(query.trim())}
            className="bg-brand-600 text-white text-sm rounded-full px-5 py-2 shadow-md hover:bg-brand-700 transition-colors shrink-0"
          >
            Search
          </button>
        </div>
      </div>

      {nothingFound ? (
        <p className="text-center text-sm text-slate-500">
          Nothing here matches &ldquo;{query.trim()}&rdquo;. Try another word, or ask us
          below.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <TopicCard key={topic.title} topic={topic} onOpen={() => navigate(topic.path)} />
          ))}

          {showPrivacy && (
            // The one card the frame tints — it carries the privacy notice, and
            // the blue is what marks it out from the four topic cards.
            <button
              onClick={() => navigate(PRIVACY_TOPIC.path)}
              className={`text-left relative bg-linear-to-r from-[#eff4ff] to-[#e5eeff] rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${CARD_HOVER} sm:col-span-2`}
            >
              <span className="absolute top-6 right-6 text-xs font-semibold text-[#f6e6ff] bg-[#9333ea] px-3 py-1 rounded-full">
                Important
              </span>
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[#0b1c30]">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mt-4">
                {PRIVACY_TOPIC.title}
              </h2>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-xl">
                {PRIVACY_TOPIC.desc}
              </p>
              <span className="mt-4 flex items-center gap-2 bg-white/60 rounded-full px-4 py-2.5">
                <Info size={13} className="text-[#4d4354] shrink-0" />
                <span className="text-xs text-[#4d4354]">{PRIVACY_TOPIC.note}</span>
              </span>
            </button>
          )}
        </div>
      )}

      {faqs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Frequently Asked Questions</h2>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {faqs.map((item) => (
              <FaqItem
                key={item.q}
                item={item}
                open={openFaq === item.q}
                onToggle={() => setOpenFaq(openFaq === item.q ? null : item.q)}
              />
            ))}
          </div>
        </div>
      )}

      <div
        className={`relative overflow-hidden ${CARD} flex flex-wrap items-center justify-between gap-6`}
      >
        <div className="absolute -right-12 -top-8 w-48 h-48 rounded-full bg-brand-600/10 blur-2xl pointer-events-none" />
        <div className="relative max-w-xl">
          <h2 className="text-xl font-semibold text-slate-900">Need more help?</h2>
          <p className="text-base text-slate-600 mt-2 leading-relaxed">
            Our support team is here to assist you with navigating the platform and
            ensuring your experience is seamless and secure.
          </p>
        </div>
        <button
          type="button"
          disabled
          title="A support contact address has not been set up yet."
          className="relative flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 shadow-md opacity-60 cursor-not-allowed shrink-0"
        >
          <Headset size={16} />
          Contact support
        </button>
      </div>
    </div>
  );
}
