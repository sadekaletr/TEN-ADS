const NEW_DAYS = 30;

export function isCreatorNew(listingCreatedAt: string): boolean {
  const age = Date.now() - new Date(listingCreatedAt).getTime();
  return age < NEW_DAYS * 24 * 60 * 60 * 1000;
}
