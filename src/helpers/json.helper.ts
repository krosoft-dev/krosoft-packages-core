export const tryParseJson = (str: string): unknown => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

export const beautifyJson = (str: string): string => {
  const parsed = tryParseJson(str);
  return JSON.stringify(parsed, null, 2);
};
