<template>
  <table id="table-result">
    <thead>
      <tr class="text-xs-left">
        <th v-for="(item, index) in headers" :key="`header-${index}`">
          {{ item }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, indexRow) in body" :key="`row-${indexRow}`">
        <td v-for="(column, index) in row" :key="`column-${index}`">
          {{ column }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const headers = props.items[0]
    const body = props.items.slice(1, props.items.length)

    return {
      headers,
      body,
    }
  },
}
</script>
