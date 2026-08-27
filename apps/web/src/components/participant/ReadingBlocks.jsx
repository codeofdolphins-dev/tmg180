/**
 * Renders a reading's content blocks (@tmg180/shared participantLibrary):
 * `h2` headings, `p` paragraphs and `list` items, in source order, on the
 * participant type scale. Purely presentational — the text is the document's.
 */
export default function ReadingBlocks({ blocks, compact = false }) {
  const body = compact ? 'text-sm text-slate-600' : 'text-base text-slate-700';
  return (
    <div className={`flex flex-col ${compact ? 'gap-2' : 'gap-3'}`}>
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;
        if (block.kind === 'h2') {
          return (
            <h2 key={key} className={`${index > 0 ? 'mt-4' : ''} text-lg font-semibold text-slate-900`}>
              {block.text}
            </h2>
          );
        }
        if (block.kind === 'list') {
          return (
            <ul key={key} className={`list-disc pl-6 flex flex-col gap-1 ${body} leading-relaxed`}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={key} className={`${body} leading-relaxed`}>
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
