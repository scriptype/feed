export const isDev = () =>
  new URLSearchParams(document.location.search).has('dev')
