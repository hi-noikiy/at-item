import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './zh'
import en from './en'
import ko from './ko'
import mn from './mn'
import { getCookie, setCookie } from '@/comApi/cookie.js'

Vue.use(VueI18n)
const lang = getCookie('lan') || 'en_US'
export const i18n = new VueI18n({
  locale: lang,
  messages: {
    zh_CN: {
      ...zh
    },
    en_US: {
      ...en
    },
    ko_KR: {
      ...ko
    },
    el_GR: {
      ...zh
    },
    mn_MN: {
      ...mn
    }
  }
})

export function changeLanguage (lang) {
  i18n.locale = lang
  setCookie('lan', lang)
}
