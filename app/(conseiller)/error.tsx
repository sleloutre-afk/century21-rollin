"use client";

import { ErreurSegment } from "@/components/layout/ErreurSegment";

/** Page 500 de ce groupe de pages : l'en-tête et le pied de page restent affichés. */
export default function Erreur(props: { error: unknown; retry: () => void }) {
  return <ErreurSegment {...props} />;
}
