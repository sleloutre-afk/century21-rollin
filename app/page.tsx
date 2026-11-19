import { getAgence } from "@/lib/data";

// Page provisoire du lot 0 : vérifie les couleurs, les polices et l'accès aux données.
// Remplacée par l'accueil au lot 2.
export default function Accueil() {
  const agence = getAgence();

  return (
    <main className="flex min-h-dvh flex-col">
      <div className="h-2 bg-gold" aria-hidden="true" />
      <section className="flex flex-1 items-center bg-grey-dark px-4 py-24 text-white md:px-16">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-display text-sm font-medium uppercase tracking-[0.2em] text-gold">Site en construction</p>
          <h1 className="mt-4 font-display text-4xl font-semibold md:text-6xl">{agence.nomTexte}</h1>
          <p className="mt-6 max-w-xl text-lg text-grey-light">
            {agence.adresse.rue}, {agence.adresse.codePostal} {agence.adresse.ville}
          </p>
          <a
            href={`tel:${agence.telephoneE164}`}
            className="mt-10 inline-flex min-h-12 items-center bg-gold px-6 font-display text-lg font-medium text-grey-dark transition-colors hover:bg-gold-dark"
          >
            {agence.telephone}
          </a>
        </div>
      </section>
    </main>
  );
}
