/** Formatage des nombres à la française (espaces fines insécables, virgule décimale). */

const euros = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const decimal = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });

/** 1099000 → « 1 099 000 € ». `null` → emplacement « [prix à fournir] ». */
export function formaterPrix(montant: number | null): string {
  return montant === null ? "[prix à fournir]" : euros.format(montant);
}

/** 278.84 → « 278,84 m² ». */
export function formaterSurface(m2: number): string {
  return `${decimal.format(m2)} m²`;
}
