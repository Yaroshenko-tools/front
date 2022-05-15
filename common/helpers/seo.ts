export const createHeaders = (title: string, description: string) => {
  return {
    title,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: description,
      },
    ],
  }
}
