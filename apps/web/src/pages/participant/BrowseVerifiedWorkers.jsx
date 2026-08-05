import {
  Search,
  MapPin,
  Network,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Info,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { PARTICIPANT_PATHS } from '../routes/paths';

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const WORKERS = [
  {
    name: 'Sarah Jenkins',
    initials: 'SJ',
    avatarClass: 'bg-purple-200 text-brand-700',
    quote: '"I believe in empowering individuals to live their most independent lives."',
    communicationStyle: ['Visual Aids', 'Patient', 'Clear Speech'],
    supportStyle: 'Empowering & Active',
    preferredEnv: 'Outdoors & Community',
    location: 'Melbourne, VIC',
    nextAvailable: 'Tomorrow, 9 AM',
    availability: [true, true, false, true, true, false, false],
    supportAreas: ['Community Access', 'Daily Living', 'Skill Building'],
  },
  {
    name: 'David Chen',
    initials: 'DC',
    avatarClass: 'bg-amber-200 text-amber-800',
    quote: '"Helping others discover their passions through meaningful connection."',
    communicationStyle: ['Sign Language (Basic)', 'Active Listening'],
    supportStyle: 'Calm & Structured',
    preferredEnv: 'Home & Creative Spaces',
    location: 'Box Hill, VIC',
    nextAvailable: 'Wednesday, 2 PM',
    availability: [false, false, true, true, true, true, true],
    supportAreas: ['Learning Support', 'Social Outings', 'Assistive Tech'],
  },
  {
    name: 'Maya Rodriguez',
    initials: 'MR',
    avatarClass: 'bg-rose-200 text-rose-800',
    quote: '"Adventure is better when shared with friends!"',
    communicationStyle: ['Bilingual (Spanish)', 'Direct'],
    supportStyle: 'Energetic & Social',
    preferredEnv: 'Clubs & Sporting Events',
    location: 'Richmond, VIC',
    nextAvailable: 'Saturday, 10 AM',
    availability: [false, false, false, false, true, true, true],
    supportAreas: ['Social Companionship', 'Transport'],
  },
  {
    name: 'Robert Wilson',
    initials: 'RW',
    avatarClass: 'bg-emerald-200 text-emerald-800',
    quote: '"Dignity and respect are at the heart of everything I do."',
    communicationStyle: ['Reassuring', 'Low-Volume'],
    supportStyle: 'Careful & Mindful',
    preferredEnv: 'Home Environment',
    location: 'Brunswick, VIC',
    nextAvailable: 'Today, 4 PM',
    availability: [true, true, true, true, true, false, false],
    supportAreas: ['Personal Care', 'Medication Admin', 'Cooking'],
  },
];

function WorkerCard({ worker }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm flex flex-col overflow-hidden">
      <div className="p-5 pb-4">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${worker.avatarClass}`}
          >
            {worker.initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-bold text-slate-900 truncate">{worker.name}</h3>
              <BadgeCheck size={17} className="text-emerald-600 shrink-0" />
            </div>
            <p className="text-sm italic text-slate-500 leading-relaxed mt-1">
              {worker.quote}
            </p>
          </div>
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Communication Style
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {worker.communicationStyle.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold text-brand-700 bg-purple-100 px-2.5 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Support Style
            </p>
            <p className="text-sm text-slate-700">{worker.supportStyle}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Preferred Env.
            </p>
            <p className="text-sm text-slate-700">{worker.preferredEnv}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 p-5 pt-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-4">
          <span className="flex items-center gap-1.5 text-sm text-slate-600">
            <MapPin size={14} className="text-brand-600 shrink-0" />
            {worker.location}
          </span>
          <span className="text-right">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Next Available
            </span>
            <span className="block text-sm font-bold text-emerald-700">
              {worker.nextAvailable}
            </span>
          </span>
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Availability Summary
        </p>
        <div className="grid grid-cols-7 gap-1.5 mb-4">
          {worker.availability.map((available, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span
                className={`w-full h-2 rounded-full ${
                  available ? 'bg-emerald-300' : 'bg-slate-300'
                }`}
              />
              <span className="text-[10px] text-slate-400">{DAY_LETTERS[i]}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {worker.supportAreas.map((area) => (
            <span
              key={area}
              className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-md"
            >
              {area}
            </span>
          ))}
        </div>

        <button
          onClick={() => navigate(PARTICIPANT_PATHS.browseWorkersProfile)}
          className="mt-auto w-full bg-purple-100 hover:bg-purple-200 text-brand-600 text-sm font-bold rounded-xl py-3 transition-colors"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}

function PageDot({ label, active }) {
  return (
    <button
      className={`w-9 h-9 rounded-full text-sm font-medium flex items-center justify-center transition-colors ${
        active
          ? 'bg-brand-600 text-white'
          : 'text-slate-500 hover:bg-white hover:text-slate-700'
      }`}
    >
      {label}
    </button>
  );
}

export default function BrowseVerifiedWorkers() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <div>
              <p className="text-sm text-slate-400 mb-2">
                Home <span className="mx-1">/</span>
                <span className="text-slate-600">Browse Verified Workers</span>
              </p>
              <h1 className="text-4xl font-bold text-slate-900">Browse Verified Workers</h1>
              <p className="text-base text-slate-500 mt-2">
                Connect with experienced support professionals in your community.
              </p>
            </div>

            <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm p-5">
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_auto] gap-4 items-end">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Search Keywords</p>
                  <div className="flex items-center gap-2.5 bg-slate-100 rounded-xl px-3.5 py-3">
                    <Search size={15} className="text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-400">
                      Specialties, skills, or names...
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Location</p>
                  <div className="flex items-center gap-2.5 bg-slate-100 rounded-xl px-3.5 py-3">
                    <MapPin size={15} className="text-slate-500 shrink-0" />
                    <span className="text-sm text-slate-700 flex-1">All Locations</span>
                    <ChevronDown size={15} className="text-slate-400 shrink-0" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Support Area</p>
                  <div className="flex items-center gap-2.5 bg-slate-100 rounded-xl px-3.5 py-3">
                    <Network size={15} className="text-slate-500 shrink-0" />
                    <span className="text-sm text-slate-700 flex-1">All Categories</span>
                    <ChevronDown size={15} className="text-slate-400 shrink-0" />
                  </div>
                </div>
                <button className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl px-6 py-3 transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-purple-50 border border-purple-100 rounded-2xl px-5 py-4">
              <Info size={15} className="text-brand-600 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-600 leading-relaxed">
                TMG180 does not coordinate services. Participants contact independent
                workers directly using the worker's preferred method.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {WORKERS.map((worker) => (
                <WorkerCard key={worker.name} worker={worker} />
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 pt-4">
              <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                <ChevronLeft size={16} />
              </button>
              <PageDot label="1" active />
              <PageDot label="2" />
              <PageDot label="3" />
              <span className="text-sm text-slate-400 px-1">...</span>
              <PageDot label="12" />
              <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
    </div>
  );
}
