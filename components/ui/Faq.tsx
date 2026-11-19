/**
 * FAQ repliable, en `details`/`summary` natifs : fonctionne au clavier et sans JavaScript.
 * Le balisage FAQPage (schema.org) sera ajouté au lot 10, à partir des mêmes données.
 */

export type QuestionFaq = { q: string; a: string };

export function Faq({ questions, premiereOuverte = false }: { questions: QuestionFaq[]; premiereOuverte?: boolean }) {
  return (
    <div className="flex flex-col border-t border-grey-dark">
      {questions.map((item, i) => (
        <details key={item.q} open={premiereOuverte && i === 0} className="group border-b border-grey-dark">
          <summary className="flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-6 py-3 font-display text-xl font-medium md:text-[22px] [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden="true"
              className="flex-none font-sans text-[28px] font-normal leading-none transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="m-0 mb-6 max-w-[640px] text-base leading-relaxed">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
