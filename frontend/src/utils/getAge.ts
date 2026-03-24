// Calcule l'âge à partir d'une date de naissance.
// Retourne "X mois" si moins d'un an, sinon "X ans".
export function getAge(birthDate: string) {
  const d = new Date(birthDate);
  const now = new Date();
  let years = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) years--;
  if (years < 1) {
    const months =
      (now.getFullYear() - d.getFullYear()) * 12 +
      now.getMonth() -
      d.getMonth() -
      (now.getDate() < d.getDate() ? 1 : 0);
    return `${months} mois`;
  }
  return `${years} ans`;
}
