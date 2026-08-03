import { Paperclip, Send } from 'lucide-react';

export default function CommentInput({ placeholder = 'Add a note...' }) {
  return (
    <div className="flex items-center gap-2 border border-slate-200 rounded-full px-3 py-2 bg-white">
      <button className="text-slate-400 hover:text-slate-600">
        <Paperclip size={16} />
      </button>
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 text-sm text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
      />
      <button className="w-8 h-8 rounded-full bg-brand-700 hover:bg-brand-800 text-white flex items-center justify-center shrink-0 transition-colors">
        <Send size={14} />
      </button>
    </div>
  );
}
