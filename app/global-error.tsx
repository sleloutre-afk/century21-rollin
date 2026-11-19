"use client";

import "./globals.css";

/** Erreur dans le gabarit racine lui-même (rare) : page autonome, en français. */
export default function ErreurGlobale({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="fr">
      <body className="flex min-h-dvh items-center bg-grey-dark text-white">
        <main className="conteneur flex flex-col gap-6 py-20">
          <p className="m-0 font-display text-sm uppercase tracking-[0.28em] text-gold">Erreur 500</p>
          <h1 className="m-0 text-[40px] font-medium uppercase leading-none md:text-6xl">Un problème est survenu</h1>
          <p className="m-0 max-w-[560px] text-lg text-grey-light">
            Réessayez dans un instant, ou appelez l&apos;agence au{" "}
            <a href="tel:+33557877979" className="font-bold text-gold">
              05 57 87 79 79
            </a>
            .
          </p>
          <button type="button" onClick={() => retry()} className="min-h-14 self-start cursor-pointer border-0 bg-gold px-8 font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-grey-dark">
            Réessayer
          </button>
        </main>
      </body>
    </html>
  );
}
