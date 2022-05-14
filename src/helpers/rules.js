export const requiredField = v => !!v || 'Поле обязательно'
export const maxSymbols = maxSymbols => v => (v || '').length <= maxSymbols ||
  `Вы превысили максимальное ${maxSymbols} количество символов`

export const limits = {
  titleMaxLength: 30,
  descMaxLength: 90,
  pathMaxLength: 15,
}
