/** Ajoute `value` s'il est absent, le retire s'il est présent. Retourne un nouveau tableau (immutable). */
export const toggleValue = <T>(values: T[], value: T): T[] => (values.includes(value) ? values.filter(v => v !== value) : [...values, value]);

/** Regroupe les éléments d'une liste par la clé renvoyée par `getKey`. */
export const groupBy = <T, K extends PropertyKey>(items: T[], getKey: (item: T) => K): Record<K, T[]> => {
  const groups: Partial<Record<K, T[]>> = {};

  for (const item of items) {
    const key = getKey(item);
    const bucket = groups[key] ?? [];
    bucket.push(item);
    groups[key] = bucket;
  }

  return groups as Record<K, T[]>;
};
