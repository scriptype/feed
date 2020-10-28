export default ({ baseUrl = '/' }) => {
  const getJSON = endpoint =>
    fetch(endpoint).then(res => res.json())

  const getLinks = ({ page = 1 }) =>
    getJSON(`${baseUrl}/page-${page}.json`)

  const getStats = () =>
    getJSON(`${baseUrl}/stats.json`)

  return Object.freeze({
    getLinks,
    getStats
  })
}
