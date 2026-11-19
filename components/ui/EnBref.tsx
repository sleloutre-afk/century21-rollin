/** Bloc « En bref » des pages quartier et articles : 3 à 5 points factuels (brief §9). */

export function EnBref({ points, id = "en-bref" }: { points: string[]; id?: string }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-[18px] bg-grey-light p-6 md:p-10">
      <h2 id={id} className="m-0 text-[26px] font-medium uppercase md:text-3xl">
        En bref
      </h2>
      <ul className="m-0 flex list-none flex-col p-0">
        {points.map((point) => (
          <li key={point} className="flex gap-3.5 border-t border-grey-dark py-3 text-base leading-[1.45]">
            <span aria-hidden="true" className="mt-[7px] size-2 flex-none bg-grey-dark" />
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}
