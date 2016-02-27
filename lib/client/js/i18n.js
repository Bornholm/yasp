import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import LngDetector from 'i18next-browser-languagedetector';
import Cache from 'i18next-localstorage-cache';

i18next
  .use(Cache)
  .use(XHR)
  .use(LngDetector)
  .init({
    fallbackLng: 'fr',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    load: 'languageOnly',
    cache: {
      enabled: false
    }
  })
;

export default i18next;
