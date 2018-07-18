export default ({ baseUrl = '/' }) => {
  const getJSON = endpoint =>
    fetch(endpoint).then(res => res.json())

  const getLinks = ({ page = 1 }) =>
    getJSON(`${baseUrl}/test-data/page-${page}.json`)

  const getStats = () =>
    getJSON(`${baseUrl}/test-data/stats.json`)

  return {
    getLinks,
    getStats
  }
}
