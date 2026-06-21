const productName = "VC-CABLE CONVERTIDOR SEÑAL DE HDMI A RCA";
const productCategory = "Cable UTP ";
const productCode = "N/A";
const keywords = [ 'un', 'tip', 'para', 'ven', 'mas', 'hoy' ];

function isFuzzyMatch(keyword, targetField) {
  if (!targetField) return false;
  const normalizedTarget = targetField.toLowerCase();
  if (normalizedTarget.includes(keyword)) return true;

  const words = normalizedTarget.split(/[\s\-,\/()]+/);
  for (const w of words) {
      if (w.includes(keyword) || keyword.includes(w)) {
          console.log(`    > Keyword "${keyword}" matches word "${w}" because w.includes(keyword) or keyword.includes(w)`);
          return true;
      }
      if (Math.abs(w.length - keyword.length) > 3) continue;

      let commonChars = 0;
      let lastIdx = -1;
      for (let i = 0; i < keyword.length; i++) {
          const idx = w.indexOf(keyword[i], lastIdx + 1);
          if (idx > -1) {
              commonChars++;
              lastIdx = idx;
          }
      }
      const ratio = commonChars / Math.max(keyword.length, w.length);
      if (ratio >= 0.70) {
          console.log(`    > Keyword "${keyword}" matches word "${w}" fuzzy (ratio ${ratio})`);
          return true;
      }
  }
  return false;
}

keywords.forEach(kw => {
  console.log(`Checking keyword "${kw}":`);
  const matchName = isFuzzyMatch(kw, productName);
  const matchCat = isFuzzyMatch(kw, productCategory);
  const matchCode = productCode.toLowerCase().includes(kw);
  console.log(`  Name Match: ${matchName}, Cat Match: ${matchCat}, Code Match: ${matchCode}`);
});
