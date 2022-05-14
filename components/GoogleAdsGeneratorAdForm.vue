<template>
  <v-form
    ref="form"
    v-model="isFormValid"
  >
    <v-text-field
      v-model="form.headlines[0]"
      :counter="limits.titleMaxLength"
      label="Заголовок 1 *"
      placeholder="Например: {KeyWord:[KeyWord]}"
      :rules="[requiredField, maxSymbols(limits.titleMaxLength)]"
    />

    <v-text-field
      v-model="form.headlines[1]"
      :counter="limits.titleMaxLength"
      label="Заголовок 2 *"
      placeholder="2-й заголовок"
      :rules="[requiredField, maxSymbols(limits.titleMaxLength)]"
    />

    <v-text-field
      v-model="form.headlines[2]"
      :counter="limits.titleMaxLength"
      label="Заголовок 3 *"
      placeholder="3-й заголовок"
      :rules="[requiredField, maxSymbols(limits.titleMaxLength)]"
    />

    <div v-for="(_, index) in form.headlines" :key="`headline-${index + 1}`">
      <v-text-field
        v-if="index > 2"
        v-model="form.headlines[index]"
        :counter="limits.titleMaxLength"
        :label="`Заголовок ${index + 1}`"
        :placeholder="`${index + 1}-й заголовок`"
        :rules="[maxSymbols(limits.titleMaxLength)]"
      />
    </div>

    <v-row v-if="isShowAddHeadlineBtn">
      <v-col class="d-flex justify-center">
        <v-btn small color="primary" @click="addHeadline">Добавить заголовок</v-btn>
      </v-col>
    </v-row>

    <v-textarea
      v-model="form.descriptions[0]"
      :counter="limits.descMaxLength"
      rows="2"
      label="Описание 1 *"
      :rules="[requiredField, maxSymbols(limits.descMaxLength)]"
    />

    <v-textarea
      v-model="form.descriptions[1]"
      :counter="limits.descMaxLength"
      rows="2"
      label="Описание 2 *"
      :rules="[requiredField, maxSymbols(limits.descMaxLength)]"    />

    <div v-for="(_, index) in form.descriptions" :key="`description-${index + 1}`">
      <v-textarea
        v-if="index > 1"
        v-model="form.descriptions[index]"
        rows="2"
        :counter="limits.descMaxLength"
        :label="`Описание ${index + 1}`"
        :placeholder="`${index + 1}-й описание`"
        :rules="[maxSymbols(limits.descMaxLength)]"
      />
    </div>

    <v-row v-if="isShowAddDescriptionBtn">
      <v-col class="d-flex justify-center">
        <v-btn small color="primary" @click="addDescription">Добавить описание</v-btn>
      </v-col>
    </v-row>

    <v-layout row>
      <v-flex>
        <v-text-field
          v-model="form.paths[0]"
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
          v-model="form.paths[1]"
          :counter="limits.pathMaxLength"
          label="Путь 2"
          :rules="[maxSymbols(limits.pathMaxLength)]"
        />
      </v-flex>
    </v-layout>
    <v-text-field
      v-model="form.url"
      label="Адрес целевой страницы *"
      placeholder="https://yaroshenko.tools"
      type="url"
      :rules="[requiredField]"
    />
  </v-form>
</template>
<script>
import {ref} from "@nuxtjs/composition-api";
import { limits, maxSymbols, requiredField } from "~/common/helpers/rules";

export default {
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
  },
  setup({ formData }, { emit, refs }) {
    const formObject = 'headlines' in formData ? formData : {
      headlines: ['', '', ''],
      descriptions: ['', ''],
      paths: ['', ''],
      url:''
    }

    const form = reactive(formObject)

    const isFormValid = ref(false)

    const addHeadline = () => {
      form.headlines.push('')
    }

    const addDescription = () => {
      form.descriptions.push('')
    }

    const isShowAddHeadlineBtn = computed(() => {
      return form.headlines.length < 15
    })

    const isShowAddDescriptionBtn = computed(() => {
      return form.descriptions.length < 4
    })

    const validateForm = () => refs.form.validate()

    watch(form, (val) => {
      emit('update:form-data', val)
    });

    watch(isFormValid, (val) => {
      emit('update:form-valid', val)
    });

    return {
      form,
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
  }
}
</script>