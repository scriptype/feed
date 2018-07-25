export const isDev = () =>
  new URLSearchParams(document.location.search).has('dev')

export const truncate = (text, limit, ellipsis) =>
  text.length > limit
    ? `${ text.slice(0, limit).trim() }${ ellipsis ? '...' : '' }`
    : text
