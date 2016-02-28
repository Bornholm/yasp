/* jshint browser:true */
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import Cache from 'i18next-localstorage-cache';
import isDebug from './debug';

i18next
  .use(Cache)
  .use(XHR)
  .init({
    fallbackLng: 'fr',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    load: 'languageOnly',
    cache: {
      enabled: !isDebug()
    }
  })
;

export default i18next;
