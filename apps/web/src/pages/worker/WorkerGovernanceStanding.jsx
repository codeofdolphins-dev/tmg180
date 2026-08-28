import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CalendarCheck2,
  ChevronRight,
  ClipboardClock,
  Clock,
  FolderCheck,
  LoaderCircle,
  NotebookPen,
  ShieldCheck,
  ShieldOff,
  TriangleAlert,
  UserRoundCheck,
  X,
} from 'lucide-react';
import {
  CREDENTIAL_STATUS,
  GOVERNANCE_ITEM_STATUS,
  credentialStatusLabel,
  governanceItemStatusLabel,
} from '@tmg180/shared';
import DateField from '../../components/ui/DateField';
import { formatShortDate } from '../../lib/dates';
import { governanceKeys, useGovernanceStanding } from '../../hooks/worker/governance';
import { useUpdateCredential } from '../../hooks/worker/credentials';
import { queryClient } from '../../lib/queryClient';
import { workerGovernancePath } from '../../routes/paths';

/**
 * Governance Standing — Figma 1169:3916, on the UI scale.
 *
 * Everything on it is the worker's own: the items they have read and
 * confirmed, and the credentials they hold. Two rules from canon shape it:
 *
 *  - **Standing is a count, never a rating.** The frame's "Excellent" badge is
 *    gone; the card says how many things are in order out of how many, and
 *    "Needs review" means "you have not told us yet", not a finding.
 *  - **Acknowledgements are append-only per version.** Confirming happens on
 *    the item's own page, after the item has been read; there is no way to
 *    un-confirm one, here or anywhere.
 *
 * Renewals are editable in place — this is the screen the dashboard's "Update
 * documents" button points at, so the dates have to be recordable here.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

const GROUP_STYLE = {
  acknowledgement: { icon: BookOpenCheck, tile: 'bg-brand-50 text-brand-600' },
  document: { icon: FolderCheck, tile: 'bg-[#dce9ff] text-[#2170e4]' },
  readiness: { icon: UserRoundCheck, tile: 'bg-emerald-50 text-[#005f40]' },
};

const ITEM_CHIP = {
  [GOVERNANCE_ITEM_STATUS.CONFIRMED]: 'bg-emerald-50 text-emerald-700',
  [GOVERNANCE_ITEM_STATUS.NEEDS_REVIEW]: 'bg-amber-50 text-amber-700',
  [GOVERNANCE_ITEM_STATUS.NOT_STARTED]: 'bg-slate-100 text-slate-600',
};

const CREDENTIAL_CHIP = {
  [CREDENTIAL_STATUS.UP_TO_DATE]: 'bg-emerald-50 text-emerald-700',
  [CREDENTIAL_STATUS.DUE_SOON]: 'bg-amber-50 text-amber-700',
  [CREDENTIAL_STATUS.EXPIRED]: 'bg-rose-50 text-rose-700',
  [CREDENTIAL_STATUS.NEEDS_REVIEW]: 'bg-slate-100 text-slate-600',
};

const CREDENTIAL_DOT = {
  [CREDENTIAL_STATUS.UP_TO_DATE]: 'bg-emerald-200',
  [CREDENTIAL_STATUS.DUE_SOON]: 'bg-amber-300',
  [CREDENTIAL_STATUS.EXPIRED]: 'bg-rose-300',
  [CREDENTIAL_STATUS.NEEDS_REVIEW]: 'bg-slate-200',
};

function LoadError({ title, error }) {
  return (
    <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
      <TriangleAlert size={18} className="shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, tone, label, value, note, chip, chipTone }) {
  return (
    <div className={CARD}>
      <div className="flex items-start justify-between gap-3">
        <Icon size={22} className={tone} />
        {chip && (
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${chipTone}`}>{chip}</span>
        )}
      </div>
      <p className="text-sm text-slate-600 mt-6">{label}</p>
      <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
      {note && <p className="text-xs text-slate-500 mt-1">{note}</p>}
    </div>
  );
}

function ItemRow({ item, onOpen }) {
  const confirmed = item.status === GOVERNANCE_ITEM_STATUS.CONFIRMED;
  return (
    <button
      onClick={onOpen}
      className="w-full text-left flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 hover:bg-slate-50 transition-colors"
    >
      <div className="min-w-0">
        <p className="text-base font-medium text-slate-900">{item.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {confirmed && item.acknowledgedAt
            ? `Confirmed ${formatShortDate(item.acknowledgedAt)} · ${item.acknowledgedVersion}`
            : item.summary}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${ITEM_CHIP[item.status]}`}>
          {governanceItemStatusLabel(item.status)}
        </span>
        <ChevronRight size={16} className="text-slate-400" />
      </div>
    </button>
  );
}

function GroupCard({ group, items, onOpen }) {
  const style = GROUP_STYLE[group.key] ?? GROUP_STYLE.document;
  const Icon = style.icon;
  return (
    <section className={CARD}>
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${style.tile}`}>
          <Icon size={19} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{group.label}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{group.blurb}</p>
        </div>
      </div>
      <div className="pt-2">
        {items.map((item) => (
          <ItemRow key={item.key} item={item} onOpen={() => onOpen(item)} />
        ))}
      </div>
    </section>
  );
}

/** Recording what you hold. Clearing both dates takes a credential back to "Needs review". */
function CredentialForm({ credential, onDone }) {
  const [fields, setFields] = useState({
    issuedAt: credential.issuedAt ?? '',
    expiresAt: credential.expiresAt ?? '',
    reference: credential.reference ?? '',
  });
  const save = useUpdateCredential();
  const errors = save.error?.data ?? {};

  const submit = (event) => {
    event.preventDefault();
    save.mutate(
      { type: credential.type, fields },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: governanceKeys.standing() });
          onDone();
        },
      }
    );
  };

  return (
    /* Sits inside the credential's own card, which already names it — so this
       is an inset panel with a job title, not a second copy of the heading. */
    <form onSubmit={submit} className="bg-slate-50 rounded-lg p-3 mt-3">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {credential.expiresAt ? 'Update details' : 'Record dates'}
        </p>
        <button type="button" onClick={onDone} aria-label="Close" className="text-slate-400 hover:text-slate-600">
          <X size={15} />
        </button>
      </div>

      <label className="block text-sm text-slate-600 mb-2" htmlFor={`issued-${credential.type}`}>
        Issued
      </label>
      <DateField
        id={`issued-${credential.type}`}
        look="box"
        value={fields.issuedAt}
        onChange={(value) => setFields((current) => ({ ...current, issuedAt: value }))}
        ariaLabel={`${credential.label} issue date`}
      />
      {errors.issuedAt && <p className="text-xs text-rose-600 mt-1">{errors.issuedAt}</p>}

      <label className="block text-sm text-slate-600 mt-3 mb-2" htmlFor={`expires-${credential.type}`}>
        Expires
      </label>
      <DateField
        id={`expires-${credential.type}`}
        look="box"
        value={fields.expiresAt}
        onChange={(value) => setFields((current) => ({ ...current, expiresAt: value }))}
        ariaLabel={`${credential.label} expiry date`}
      />
      {errors.expiresAt && <p className="text-xs text-rose-600 mt-1">{errors.expiresAt}</p>}

      <label className="block text-sm text-slate-600 mt-3 mb-2" htmlFor={`ref-${credential.type}`}>
        Reference <span className="text-slate-400">(optional)</span>
      </label>
      <input
        id={`ref-${credential.type}`}
        value={fields.reference}
        onChange={(event) => setFields((current) => ({ ...current, reference: event.target.value }))}
        placeholder="Certificate or policy number"
        className="w-full bg-white border border-slate-300 rounded-full px-4 h-12.5 text-base text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-600/40"
      />
      {errors.reference && <p className="text-xs text-rose-600 mt-1">{errors.reference}</p>}

      {save.error && !Object.keys(errors).length && (
        <p className="text-xs text-rose-600 mt-3">{save.error.message}</p>
      )}

      <button
        type="submit"
        disabled={save.isPending}
        className="w-full bg-brand-600 text-white text-sm rounded-full py-2.5 mt-4 shadow-md hover:bg-brand-700 disabled:opacity-60 transition-colors"
      >
        {save.isPending ? 'Please wait…' : 'Save details'}
      </button>
      <p className="text-xs text-slate-500 mt-3 leading-relaxed">
        Standing is worked out from the expiry date each time this screen loads — it is never stored.
        {credential.verifiedAt &&
          ' Saving changes takes off TMG180’s verification until an administrator reviews the new details.'}
      </p>
    </form>
  );
}

function credentialNote(credential) {
  if (credential.status === CREDENTIAL_STATUS.NEEDS_REVIEW) return 'No dates recorded yet';
  if (credential.status === CREDENTIAL_STATUS.EXPIRED) {
    return `Expired ${formatShortDate(credential.expiresAt)}`;
  }
  return `Expires ${formatShortDate(credential.expiresAt)}`;
}

function Renewals({ credentials }) {
  const [editing, setEditing] = useState(null);

  // Soonest first; anything with no date recorded sits at the bottom, because
  // it is a gap to fill rather than a deadline.
  const ordered = [...credentials].sort((a, b) => {
    if (a.daysLeft === null) return 1;
    if (b.daysLeft === null) return -1;
    return a.daysLeft - b.daysLeft;
  });
  const settled = credentials.filter((c) => c.status === CREDENTIAL_STATUS.UP_TO_DATE).length;

  return (
    <section className="bg-[#eff4ff]/70 rounded-xl p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Clock size={18} className="text-brand-600 shrink-0" />
          My Credentials
        </h2>
        <span className="text-xs font-medium text-slate-500 shrink-0">
          {settled} of {credentials.length} current
        </span>
      </div>
      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
        Record what you hold — TMG180 reviews and verifies it.
      </p>

      <div className="flex flex-col gap-3 mt-4">
        {ordered.map((credential) => (
          <div key={credential.type} className="bg-white/80 rounded-lg p-4">
            <div className="flex items-start gap-2.5">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                  CREDENTIAL_DOT[credential.status]
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 leading-snug">
                  {credential.label}
                </p>
                <p className="text-xs text-slate-500 mt-1">{credentialNote(credential)}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span
                className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  CREDENTIAL_CHIP[credential.status]
                }`}
              >
                {credentialStatusLabel(credential.status)}
              </span>
              {credential.verifiedAt && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  <BadgeCheck size={12} className="shrink-0" />
                  Verified
                </span>
              )}
            </div>

            {editing === credential.type ? (
              <CredentialForm credential={credential} onDone={() => setEditing(null)} />
            ) : (
              <button
                onClick={() => setEditing(credential.type)}
                className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 mt-2.5"
              >
                {credential.expiresAt ? 'Update details' : 'Record dates'}
                <ArrowRight size={12} className="shrink-0" />
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed border-t border-slate-200 mt-4 pt-4">
        <BadgeCheck size={14} className="text-slate-400 mt-0.5 shrink-0" />
        <span>
          On a published profile, participants see the dates and whether TMG180 has
          verified them — never your reference numbers or notes.
        </span>
      </p>
    </section>
  );
}

export default function WorkerGovernanceStanding() {
  const navigate = useNavigate();
  const standing = useGovernanceStanding();
  const data = standing.data;

  const nextRenewal = data?.summary.nextRenewal
    ? data.credentials.find((credential) => credential.type === data.summary.nextRenewal.type)
    : null;

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Governance Standing</h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl">
          Everything about your own standing in one place. Documents open on their own page —
          you read one there, then confirm it. Credentials are recorded right here, under
          &ldquo;My Credentials&rdquo;. Confirmations and notes are never shown to participants.
        </p>
      </div>

      {standing.isLoading && (
        <div className={`flex items-center gap-3 text-slate-500 ${CARD}`}>
          <LoaderCircle size={18} className="animate-spin" />
          Loading your standing…
        </div>
      )}
      {standing.error && <LoadError title="We couldn’t load your standing." error={standing.error} />}

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard
              icon={ShieldCheck}
              tone="text-brand-600"
              label="Overall readiness"
              value={`${data.summary.readiness.inOrder} of ${data.summary.readiness.total} in order`}
              note="Items confirmed and credentials up to date. Not a score."
              chip={data.summary.allInOrder ? 'All in order' : 'Needs attention'}
              chipTone={
                data.summary.allInOrder ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }
            />
            <SummaryCard
              icon={ClipboardClock}
              tone="text-[#2170e4]"
              label="Awaiting your review"
              value={
                data.summary.awaitingReview === 0
                  ? 'Nothing waiting'
                  : `${data.summary.awaitingReview} ${data.summary.awaitingReview === 1 ? 'item' : 'items'}`
              }
              note={data.summary.awaitingReview === 0 ? 'Every item is confirmed.' : 'Read, then confirm.'}
            />
            <SummaryCard
              icon={CalendarCheck2}
              tone="text-[#005f40]"
              label="Next renewal milestone"
              value={nextRenewal ? nextRenewal.label : 'None recorded'}
              note={
                nextRenewal
                  ? `Expires ${formatShortDate(nextRenewal.expiresAt)}`
                  : 'Record a credential’s expiry date to see it here.'
              }
              chip={
                data.summary.nextRenewal
                  ? `${data.summary.nextRenewal.daysLeft} ${
                      data.summary.nextRenewal.daysLeft === 1 ? 'day' : 'days'
                    }`
                  : null
              }
              chipTone="bg-slate-100 text-slate-600"
            />
          </div>

          {/* The rail carries editable date fields, not just labels — 300px
              squeezed the calendar and wrapped every chip onto its own line. */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
            <div className="flex flex-col gap-6">
              {data.groups.map((group) => {
                const items = data.items.filter((item) => item.group === group.key);
                if (items.length === 0) return null;
                return (
                  <GroupCard
                    key={group.key}
                    group={group}
                    items={items}
                    onOpen={(item) => navigate(workerGovernancePath.item(item.key))}
                  />
                );
              })}

              {data.items.length === 0 && (
                <div className={`${CARD} text-center py-12`}>
                  <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                    <NotebookPen size={24} />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 mt-4">
                    No governance items yet
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                    Items appear here once they are published. Nothing is waiting on you.
                  </p>
                </div>
              )}
            </div>

            <Renewals credentials={data.credentials} />
          </div>

          <p className="flex items-start gap-2 text-xs text-slate-500">
            <ShieldOff size={13} className="shrink-0 mt-0.5" />
            Confirmations are recorded against the version you read and are never removed. If a document
            is published in a new version, its item returns to this list.
          </p>
        </>
      )}
    </div>
  );
}
