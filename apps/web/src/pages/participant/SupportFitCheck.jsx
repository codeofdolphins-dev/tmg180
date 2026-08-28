import { ArrowRight, Clock, Compass, Quote, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PARTICIPANT_PATHS, participantProfilePath } from '../../routes/paths';

/**
 * Autonomy & support fit check.
 *
 * The 23 Aug 2026 Document Control Register names this — "the Participant
 * Autonomy & Support Fit Check" — as a Core Library tool and puts it in the
 * build plan after M-05. What the documents give it is its reason to exist:
 *
 *   Governance Manual: "A worker may be competent and still not the right
 *   relational fit for a particular support context" → "worker profiles,
 *   participant choice tools, fit/reflection standards and transition
 *   pathways"; "autonomy and safeguarding must be held together".
 *   Legislative Alignment Map: NDIS Act s 4 → "participant check-ins, choice
 *   prompts, worker fit tools"; s 17A → "fit and reflection standards,
 *   transition pathways".
 *
 * What no document gives it is a question set. None has been delivered, so
 * none is invented here: the page says what the check is for, says plainly
 * that its questions are still to come, and points at the parts of the portal
 * that already do part of this job — in the participant's own words, with no
 * score, because the framework's "optional preference indicators" are
 * information for the participant, not a rating of anyone.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

const MEANWHILE = [
  {
    title: 'About You — your personality and communication style',
    text: 'The Personal Profile asks what type of personality and communication style you feel most comfortable around. Workers on the platform complete a similar section. There is no formal matching service — this is a tool to help you understand your own preferences.',
    path: participantProfilePath.section('about_me'),
    action: 'Open that section',
  },
  {
    title: 'Safety & Support Preferences — what a good support relationship feels like',
    text: 'The same profile asks what you feel most comfortable with in support relationships: boundaries kept, feedback given safely, warmth without pressure, feeling safe to say no.',
    path: participantProfilePath.section('safety_preferences'),
    action: 'Open that section',
  },
  {
    title: 'Verified Profiles Directory — read how a worker supports people',
    text: 'Every worker profile leads with how they naturally support people, how they communicate and where they do their best work — the relational fit, before the résumé.',
    path: PARTICIPANT_PATHS.browseWorkers,
    action: 'Browse verified workers',
  },
  {
    title: 'Raise a concern — when a fit is not working',
    text: 'If support does not feel right, you can say so early, in your own words, without fear of retaliation. You can also change workers at any time, pause or stop support, and say no without explanation.',
    path: PARTICIPANT_PATHS.concerns,
    action: 'Raise a concern',
  },
];

export default function SupportFitCheck() {
  const navigate = useNavigate();

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Autonomy &amp; support fit check</h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl">
          A private self-check about whether your support is working the way you want it to —
          whether you are directing it, and whether the people around you are the right fit for
          you. For you, not about anyone else.
        </p>
      </div>

      <section className="bg-[#eff4ff] rounded-xl p-6 flex items-start gap-4">
        <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
          <Clock size={18} />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">The questions are still to come</h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-2">
            This check is named in TMG180&rsquo;s governance plan as a Core Library tool, but its
            question set has not been delivered yet. Nothing has been written in its place — when
            the questions arrive from the framework&rsquo;s authors they will appear here as
            written. In the meantime, the parts of the portal below already do some of this.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="flex flex-col gap-4">
          {MEANWHILE.map((item) => (
            <section key={item.title} className={CARD}>
              <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed mt-2">{item.text}</p>
              <button
                onClick={() => navigate(item.path)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors mt-4"
              >
                {item.action}
                <ArrowRight size={14} />
              </button>
            </section>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <section className={CARD}>
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-brand-600" />
              <h2 className="text-base font-semibold text-slate-900">What choice and control means here</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              The participant receives information they can understand, is supported to express
              their will and preferences, has real options, meaningfully influences decisions that
              affect them, and can review or change those decisions within lawful and safe limits.
            </p>
            <p className="text-xs text-slate-500 mt-3">TMG180 Governance Manual, §7 Choice and Control in Practice</p>
          </section>

          <section className={CARD}>
            <div className="flex items-center gap-2">
              <Quote size={16} className="text-brand-600" />
              <h2 className="text-base font-semibold text-slate-900">On fit</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mt-3 italic">
              &ldquo;A worker may be competent and still not the right relational fit for a
              particular support context.&rdquo;
            </p>
            <p className="text-xs text-slate-500 mt-3">TMG180 Governance Manual</p>
          </section>

          <section className={CARD}>
            <div className="flex items-center gap-2">
              <Scale size={16} className="text-brand-600" />
              <h2 className="text-base font-semibold text-slate-900">Your rights, always</h2>
            </div>
            <ul className="mt-3 list-disc pl-5 flex flex-col gap-1.5 text-sm text-slate-600">
              <li>choose which workers to contact</li>
              <li>decide whether to engage a worker</li>
              <li>change workers at any time</li>
              <li>pause or stop support</li>
              <li>decide what support looks like</li>
              <li>say no without explanation</li>
            </ul>
            <p className="text-xs text-slate-500 mt-3">Mandatory Policy 5, Choice, Control, and Voluntary Engagement</p>
          </section>
        </div>
      </div>
    </div>
  );
}
