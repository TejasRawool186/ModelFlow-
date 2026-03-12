const { LingoDotDevEngine } = require('lingo.dev/sdk');

const LINGODEV_API_KEY = process.env.LINGODEV_API_KEY || "";

const lingodevService = {
  /**
   * Translate an array of texts into multiple target languages using @lingo.dev/sdk
   * Falls back to mock translations if API key is not configured.
   */
  async expandDataset(texts, sourceLanguage, targetLanguages) {
    if (!LINGODEV_API_KEY) {
      console.log(
        "[LingodevService] No API key — using mock translations for demo"
      );
      return this.mockTranslate(texts, sourceLanguage, targetLanguages);
    }

    const lingoDotDev = new LingoDotDevEngine({
      apiKey: LINGODEV_API_KEY,
    });
    
    const results = [];

    try {
      for (const lang of targetLanguages) {
        try {
          console.log(`[LingodevService] Translating ${texts.length} texts to ${lang}...`);
          
          // LingoDev SDK localizeObject expects a dictionary/record, not an array.
          // Map array into a dictionary representation: { "0": "text", "1": "text" }
          const textsDict = {};
          texts.forEach((text, i) => { textsDict[i] = text; });

          const translatedDict = await lingoDotDev.localizeObject(
            textsDict, 
            {
              sourceLocale: sourceLanguage,
              targetLocale: lang,
              fast: true, // Prioritize speed 
            }
          );

          // Convert the translated dictionary back into an ordered array
          const translatedTexts = texts.map((_, i) => translatedDict[i]);
          
          results.push({
            language: lang,
            translations: translatedTexts,
          });
        } catch (err) {
          console.error(`Failed to translate to ${lang}:`, err.message);
          results.push({
            language: lang,
            translations: texts.map((t) => `[${lang}] ${t}`),
            error: err.message,
          });
        }
      }
    } catch (err) {
      console.error('Fatal Lingo.dev error:', err);
    }

    return results;
  },

  /**
   * Mock translation for demo/testing without API key.
   * Prefixes text with language code to simulate translation.
   */
  mockTranslate(texts, sourceLanguage, targetLanguages) {
    const mockPrefixes = {
      hi: "हिन्दी: ",
      mr: "मराठी: ",
      es: "Español: ",
      fr: "Français: ",
      de: "Deutsch: ",
      pt: "Português: ",
      ja: "日本語: ",
      zh: "中文: ",
      ar: "عربي: ",
      ko: "한국어: ",
    };

    return targetLanguages.map((lang) => ({
      language: lang,
      translations: texts.map(
        (t) => `${mockPrefixes[lang] || `[${lang}] `}${t}`
      ),
    }));
  },
};

module.exports = lingodevService;
