import { ArrowLeft, ArrowRight, Mail, LoaderCircle } from 'lucide-react';

/**
 * Shared bottom navigation for the 11 profile section pages.
 *
 * The Figma frames used three different button systems across the sections
 * ("Save & Exit / Save & Continue" vs "Save Draft / Next Step" vs a bare
 * "Continue" — flagged as W-06 in the design audit). Standardised here to one
 * bar with all four actions: Previous | Save Draft · Save & Exit · Save & Continue.
 *
 * Wire it straight from useSectionForm:
 *   <ProfileSectionFooter {...useSectionForm('about-me')} />
 * (extra hook fields are ignored). Every save action posts the section before
 * navigating; Previous never saves.
 */
export default function ProfileSectionFooter({
  isSaving,
  goPrevious,
  saveDraft,
  saveAndExit,
  saveAndContinue,
  /** "Save & Finish" on the last section, where continue lands on the hub. */
  continueLabel = 'Save & Continue',
}) {
  return (
    <div className="border-t border-slate-200 pt-8 flex items-center justify-between">
      <button
        onClick={goPrevious}
        className="flex items-center gap-2 bg-white border border-slate-200 text-[#434655] text-base rounded-full px-8 py-3 hover:bg-slate-50 transition-colors"
      >
        <ArrowLeft size={16} />
        Previous
      </button>
      <div className="flex items-center gap-4">
        <button
          onClick={saveDraft}
          disabled={isSaving}
          className="flex items-center gap-2 bg-white border border-slate-200 text-[#434655] text-base rounded-full px-6 py-3 hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          <Mail size={18} />
          Save Draft
        </button>
        <button
          onClick={saveAndExit}
          disabled={isSaving}
          className="bg-white border border-brand-200 text-brand-600 text-base rounded-full px-8 py-3 hover:bg-brand-50 disabled:opacity-50 transition-colors"
        >
          Save &amp; Exit
        </button>
        <button
          onClick={saveAndContinue}
          disabled={isSaving}
          className="flex items-center gap-2 bg-brand-600 text-white text-base rounded-full px-8 py-3 shadow-md hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {isSaving && <LoaderCircle size={16} className="animate-spin" />}
          {continueLabel}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
