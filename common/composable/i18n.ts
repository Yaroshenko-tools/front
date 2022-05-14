import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { computed, getCurrentInstance ,useContext} from '@nuxtjs/composition-api'
import type { WritableComputedRef } from '@nuxtjs/composition-api'

export interface Composer {
  locale: WritableComputedRef<string>
  t: typeof VueI18n.prototype.t
  tc: typeof VueI18n.prototype.tc
  te: typeof VueI18n.prototype.te
  d: typeof VueI18n.prototype.d
  n: typeof VueI18n.prototype.n,
  localePath: string,
}

export function useI18n(): Composer {
  const { app } = useContext();

  const i18nInstance = app.i18n;

  if (!i18nInstance) throw new Error('nuxt-i18n not initialized')

  const i18n = i18nInstance

  const instance = getCurrentInstance();
  const vm = instance?.proxy || new Vue({});

  const locale = computed({
    get() {
      return i18n.locale
    },
    set(v: string) {
      i18n.locale = v
    }
  })

  return {
    locale,
    t: vm.$t.bind(vm),
    tc: vm.$tc.bind(vm),
    d: vm.$d.bind(vm),
    te: vm.$te.bind(vm),
    n: vm.$n.bind(vm),
    localePath: vm.localePath.bind(vm),
  }
}
