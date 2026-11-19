"use client";

import { useState } from "react";

/** « Partager » : menu de partage du téléphone si disponible, sinon copie du lien. */
export function BoutonPartager({ titre }: { titre: string }) {
  const [copie, setCopie] = useState(false);

  const partager = async () => {
    const url = window.location.href.split("#")[0];
    if (navigator.share) {
      try {
        await navigator.share({ title: titre, url });
      } catch {
        /* partage annulé */
      }
      return;
    }
    await navigator.clipboard?.writeText(url);
    setCopie(true);
    setTimeout(() => setCopie(false), 2500);
  };

  return (
    <>
      <button type="button" onClick={partager} className="min-h-12 flex-1 cursor-pointer border border-grey-dark bg-white px-4 text-[15px] text-grey-dark hover:bg-grey-light">
        Partager
      </button>
      <span role="status" className="sr-only">
        {copie ? "Lien copié" : ""}
      </span>
      {copie && <span className="self-center text-sm font-bold">Lien copié</span>}
    </>
  );
}
