import { useState } from 'react';
import {
  Info,
  Heart,
  MapPin,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { PARTICIPANT_PATHS } from '../../routes/paths';

const TABS = ['All Workers', 'Favourites'];

const WORKERS = [
  {
    name: 'Sarah Miller',
    location: 'Melbourne, VIC',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    supportTypes: ['Daily living', 'Mobility', 'Community'],
    languages: 'English, Spanish',
    availability: 'Weekdays, Eves',
  },
  {
    name: 'David Chen',
    location: 'Geelong, VIC',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    supportTypes: ['Transport', 'Household'],
    languages: 'English, Mandarin',
    availability: 'Weekends',
  },
];

function WorkerCard({ worker }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
          <img src={worker.photo} alt={worker.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 truncate">{worker.name}</h3>
            <Heart size={16} className="text-rose-500 fill-rose-500 shrink-0" />
          </div>
          <p className="flex items-center gap-1 text-sm text-slate-500 mt-0.5">
            <MapPin size={12} className="text-slate-400" />
            {worker.location}
          </p>
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-2">
        Support Types
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {worker.supportTypes.map((t) => (
          <span
            key={t}
            className="text-xs font-medium text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
            Languages
          </p>
          <p className="text-sm text-slate-700">{worker.languages}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
            Availability
          </p>
          <p className="text-sm text-slate-700">{worker.availability}</p>
        </div>
      </div>

      <button
        onClick={() => navigate(PARTICIPANT_PATHS.directoryProfile)}
        className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-brand-600 text-sm font-medium rounded-full py-2.5 transition-colors"
      >
        View Profile
      </button>
    </div>
  );
}

export default function WorkerDirectory() {
  const [activeTab, setActiveTab] = useState('Favourites');

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Browse verified worker profiles
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Use filters to find the right fit. You choose who to contact directly.
              </p>
            </div>

            <div className="flex items-center gap-6 border-b border-slate-200">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm pb-3 -mb-px border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'text-brand-700 font-medium border-brand-600'
                      : 'text-slate-500 border-transparent hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-start gap-3 bg-sky-50 rounded-2xl px-5 py-4">
              <Info size={16} className="text-sky-600 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-700 leading-relaxed">
                <span className="font-semibold">Note:</span> TMG180 does not coordinate
                services. Contact happens directly with the worker using their
                preferred method.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WORKERS.map((w) => (
                <WorkerCard key={w.name} worker={w} />
              ))}
            </div>
    </div>
  );
}
