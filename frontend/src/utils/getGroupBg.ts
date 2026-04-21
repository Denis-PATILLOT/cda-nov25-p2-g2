// Retourne la couleur de fond CSS d'un groupe à partir de son id.
// Les couleurs sont définies dans globals.css :
// --color-group1 (orange), --color-group2 (vert), --color-group3 (violet)
export function getGroupBg(groupId: string) {
  return `var(--color-group${groupId})`;
}
