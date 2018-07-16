export default ({ baseUrl = '/' }) => {
  const getJSON = endpoint =>
    fetch(endpoint).then(res => res.json())

  const getLinks = ({ page = 1 }) =>
    getJSON(`${baseUrl}/data/page-${page}.json`)

  const getStats = () =>
    getJSON(`${baseUrl}/data/stats.json`)

  return {
    getLinks,
    getStats
  }
}
