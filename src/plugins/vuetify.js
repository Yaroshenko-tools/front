import Vue from 'vue'
import Vuetify, {
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VBtn,
  VCard,
  VCardText,
  VCheckbox,
  VCol,
  VContent,
  VContainer,
  VDivider,
  VExpansionPanels,
  VExpansionPanel,
  VExpansionPanelContent,
  VExpansionPanelHeader,
  VFlex,
  VIcon,
  VLayout,
  VList,
  VListItem,
  VListItemAction,
  VListItemContent,
  VListItemTitle,
  VListItemSubtitle,
  VNavigationDrawer,
  VProgressCircular,
  VRow,
  VSnackbar,
  VSpacer,
  VTextField,
  VTextarea,
  VToolbar,
  VToolbarTitle,
  VTooltip,
} from 'vuetify/lib'

Vue.use(Vuetify, {
  components: {
    VApp,
    VAppBar,
    VAppBarNavIcon,
    VBtn,
    VCard,
    VCardText,
    VCheckbox,
    VCol,
    VContent,
    VContainer,
    VDivider,
    VExpansionPanels,
    VExpansionPanel,
    VExpansionPanelContent,
    VExpansionPanelHeader,
    VFlex,
    VIcon,
    VLayout,
    VList,
    VListItem,
    VListItemAction,
    VListItemContent,
    VListItemTitle,
    VListItemSubtitle,
    VNavigationDrawer,
    VProgressCircular,
    VRow,
    VSnackbar,
    VSpacer,
    VTextField,
    VTextarea,
    VToolbar,
    VToolbarTitle,
    VTooltip,
  },
})

const opts = {
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#42a5f5',
      },
      dark: {
        primary: '#2196F3'
      },
    },
  },
  options: {
    customProperties: true,
  },
  icons: {
    iconfont: 'md', // default is 'mdi'
  },
}

export default new Vuetify(opts)
