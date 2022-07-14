<template>
  <v-form ref="form" v-model="isFormValid">
    <v-text-field
      v-model="formValues.headlines[0]"
      :counter="limits.titleMaxLength"
      label="Заголовок 1 *"
      placeholder="Например: {KeyWord:[KeyWord]}"
      :rules="[requiredField, maxSymbols(limits.titleMaxLength)]"
    />

    <v-text-field
      v-model="formValues.headlines[1]"
      :counter="limits.titleMaxLength"
      label="Заголовок 2 *"
      placeholder="2-й заголовок"
      :rules="[requiredField, maxSymbols(limits.titleMaxLength)]"
    />

    <v-text-field
      v-model="formValues.headlines[2]"
      :counter="limits.titleMaxLength"
      label="Заголовок 3 *"
      placeholder="3-й заголовок"
      :rules="[requiredField, maxSymbols(limits.titleMaxLength)]"
    />

    <div
      v-for="(_, index) in formValues.headlines"
      :key="`headline-${index + 1}`"
    >
      <v-text-field
        v-if="index > 2"
        v-model="formValues.headlines[index]"
        :counter="limits.titleMaxLength"
        :label="`Заголовок ${index + 1}`"
        :placeholder="`${index + 1}-й заголовок`"
        :rules="[maxSymbols(limits.titleMaxLength)]"
      />
    </div>

    <v-row v-if="isShowAddHeadlineBtn">
      <v-col class="d-flex justify-center">
        <v-btn small color="primary" @click="addHeadline"
          >Добавить заголовок</v-btn
        >
      </v-col>
    </v-row>

    <v-textarea
      v-model="formValues.descriptions[0]"
      :counter="limits.descMaxLength"
      rows="2"
      label="Описание 1 *"
      :rules="[requiredField, maxSymbols(limits.descMaxLength)]"
    />

    <v-textarea
      v-model="formValues.descriptions[1]"
      :counter="limits.descMaxLength"
      rows="2"
      label="Описание 2 *"
      :rules="[requiredField, maxSymbols(limits.descMaxLength)]"
    />

    <div
      v-for="(_, index) in formValues.descriptions"
      :key="`description-${index + 1}`"
    >
      <v-textarea
        v-if="index > 1"
        v-model="formValues.descriptions[index]"
        rows="2"
        :counter="limits.descMaxLength"
        :label="`Описание ${index + 1}`"
        :placeholder="`${index + 1}-й описание`"
        :rules="[maxSymbols(limits.descMaxLength)]"
      />
    </div>

    <v-row v-if="isShowAddDescriptionBtn">
      <v-col class="d-flex justify-center">
        <v-btn small color="primary" @click="addDescription"
          >Добавить описание</v-btn
        >
      </v-col>
    </v-row>

    <v-layout row>
      <v-flex>
        <v-text-field
          v-model="formValues.paths[0]"
          :counter="limits.pathMaxLength"
          label="Путь 1"
          :rules="[maxSymbols(limits.pathMaxLength)]"
        />
      </v-flex>
      <v-flex class="my-auto">
        <v-icon>/</v-icon>
      </v-flex>
      <v-flex>
        <v-text-field
          v-model="formValues.paths[1]"
          :counter="limits.pathMaxLength"
          label="Путь 2"
          :rules="[maxSymbols(limits.pathMaxLength)]"
        />
      </v-flex>
    </v-layout>
    <v-text-field
      v-model="formValues.url"
      label="Адрес целевой страницы *"
      placeholder="https://yaroshenko.tools"
      type="url"
      :rules="[requiredField]"
    />
  </v-form>
</template>
<script>
import {
  computed,
  onMounted,
  reactive,
  ref,
  watch,
} from '@nuxtjs/composition-api'
import { limits, maxSymbols, requiredField } from '~/common/helpers/rules'

export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit, refs }) {
    let formValues = reactive({
      headlines: ['', '', ''],
      descriptions: ['', ''],
      paths: ['', ''],
      url: '',
    })

    onMounted(() => {
      if ('headlines' in props.formData) {
        formValues = props.formData
      }
    })

    const isFormValid = ref(false)

    const addHeadline = () => {
      formValues.headlines.push('')
    }

    const addDescription = () => {
      formValues.descriptions.push('')
    }

    const isShowAddHeadlineBtn = computed(() => {
      return formValues.headlines.length < 15
    })

    const isShowAddDescriptionBtn = computed(() => {
      return formValues.descriptions.length < 4
    })

    const validateForm = () => refs.form.validate()

    watch(formValues, (val) => {
      emit('update:form-data', val)
    })

    watch(isFormValid, (val) => {
      emit('update:form-valid', val)
    })

    return {
      formValues,
      isFormValid,
      validateForm,

      limits,

      isShowAddHeadlineBtn,
      isShowAddDescriptionBtn,

      addHeadline,
      addDescription,

      requiredField,
      maxSymbols,
    }
  },
}
</script>
