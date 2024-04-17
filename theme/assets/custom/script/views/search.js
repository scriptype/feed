import Modes from '../modes.js'
import Intros from '../intros.js'
import Intro from '../components/intro.js'
import SearchForm from '../components/search-form.js'
import ActivityChart from '../components/activity-chart.js'
import Pagination from '../components/pagination.js'
import Content from '../components/content.js'

const render = ({ links, searchQuery, }) => {
  Intro.render(Intros.search, {
    searchQuery,
    links
  })

  SearchForm.setInputValue(searchQuery)

  Content.render({
    links
  })

  ActivityChart.render({
    readonly: true,
    mode: Modes.full,
    links,
    pages: [links]
  })

  Pagination.remove()
}

export default {
  render
}
