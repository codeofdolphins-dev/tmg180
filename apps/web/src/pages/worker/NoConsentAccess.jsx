import {
  Key,
  ArrowLeft,
  HelpCircle,
  Compass,
  SquarePen,
  Folder,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { WORKER_PATHS } from '../../routes/paths';

const SUGGESTIONS = [
  {
    icon: SquarePen,
    text: 'Review your own Daily Support Evidence Logs',
  },
  {
    icon: Folder,
    text: 'Check your worker resources',
  },
  {
    icon: User,
    text: 'Update your profile',
  },
];

export default function NoConsentAccess() {
  const navigate = useNavigate();
  return (
    <div className="max-w-238 mx-auto flex flex-col lg:flex-row gap-4 items-start">
      <div className="flex-1 bg-slate-200/40 rounded-3xl p-10 flex flex-col items-center text-center">
        <div className="w-28 h-28 rounded-full border-2 border-dashed border-teal-300 bg-slate-100 flex items-center justify-center mb-6">
          <Key size={40} className="text-teal-600" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Access not available
        </h1>

        <p className="text-slate-600 text-base max-w-lg mb-2 leading-relaxed">
          This participant-owned information is not available unless the
          participant has given consent.
        </p>
        <p className="text-slate-400 text-sm mb-8">
          TMG180 respects participant control over their information.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            icon={ArrowLeft}
            onClick={() => navigate(WORKER_PATHS.participants)}
          >
            Back to Participants I support
          </Button>
          <Button
            variant="secondary"
            icon={HelpCircle}
            onClick={() => navigate(WORKER_PATHS.help)}
          >
            Open Help Centre
          </Button>
        </div>
      </div>

      <div className="w-full lg:w-72 shrink-0 bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Compass size={18} className="text-brand-600" />
          <h2 className="text-sm font-semibold text-slate-800">
            What you can do
          </h2>
        </div>
        <ul className="flex flex-col gap-4">
          {SUGGESTIONS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-brand-600" />
              </span>
              <p className="text-sm text-slate-600 leading-snug">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
