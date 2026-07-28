const ITEM_TEXT_FIXES = [
  // INVERSIÓN
  ["INVERSIï¿½N", "INVERSIÓN"],
  ["INVERSI\uFFFDN", "INVERSIÓN"],
  ["INVERSIÃ“N", "INVERSIÓN"],
  ["INVERSIN", "INVERSIÓN"],
  // RELACIÓN
  ["RELACIï¿½N", "RELACIÓN"],
  ["RELACI\uFFFDN", "RELACIÓN"],
  ["RELACIÃ“N", "RELACIÓN"],
  ["RELACIN", "RELACIÓN"],
];

/** Corrige mojibake típico de -IÓN (Ó → ï¿½ / U+FFFD / Ã“) */
const normalizeSpanishIonEnding = (value) =>
  value
    .replaceAll(/Iï¿½N/gi, (match) =>
      match.startsWith("i") ? "ión" : "IÓN"
    )
    .replaceAll(/I\uFFFDN/gi, (match) =>
      match.startsWith("i") ? "ión" : "IÓN"
    )
    .replaceAll(/IÃ“N/gi, (match) => (match.startsWith("i") ? "ión" : "IÓN"));

export const normalizeItemText = (value) => {
  if (typeof value !== "string" || value.length === 0) return value;

  const withExplicitFixes = ITEM_TEXT_FIXES.reduce(
    (normalizedValue, [brokenText, fixedText]) =>
      normalizedValue.replaceAll(brokenText, fixedText),
    value
  );

  return normalizeSpanishIonEnding(withExplicitFixes);
};

export const normalizeItemRecord = (item) => {
  if (!item) return item;

  return {
    ...item,
    name: normalizeItemText(item.name),
    type: normalizeItemText(item.type),
  };
};
