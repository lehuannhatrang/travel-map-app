import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { AsyncStorage } from 'react-native';
import enTranslation from "./translation/en/index.json";
import vnTranslation from "./translation/vn/index.json";
// Set the key-value pairs for the different languages you want to support.

i18n.translations = {
  'vi-VN': vnTranslation,
  en: enTranslation,
};
AsyncStorage.getItem('customLocale')
.then(customLocale => {
  if(!!customLocale) i18n.locale = customLocale
  else i18n.locale = Localization.locale;
})
console.log(Localization.locales)
// Set the locale once at the beginning of your app.
// i18n.locale = Localization.locale;
i18n.fallbacks = true;

export default i18n