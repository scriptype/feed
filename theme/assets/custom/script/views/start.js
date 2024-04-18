import Modes from '../modes.js'
import ViewResources from '../view-resources.js'
import Intros from '../intros.js'
import Intro from '../components/intro.js'
import Header from '../components/header.js'
import TagsList from '../components/tags-list.js'
import SearchForm from '../components/search-form.js'
import ActivityChart from '../components/activity-chart.js'
import Pagination from '../components/pagination.js'
import Content from '../components/content.js'
import { scrollToTop, getPages } from '../helpers.js'

const render = async ({
  onClickLogo,
  onClickTag,
  onSearch,
  onResetSearch,
  onPaginate,
  tag,
  links,
  pageNumber
}) => {
  const pages = getPages({ links })

  Header.render({ onClickLogo })

  TagsList.render({ onClickTag })

  ActivityChart.render({
    mode: Modes.hydration,
    tag,
    links,
    pages,
    pageNumber,
    onPaginate: (payload) => onPaginate({
      ...payload,
      tag,
      paginationType: 'ActivityChart'
    })
  })

  Content.render({
    mode: Modes.hydration,
    links
  })

  Pagination.render({
    mode: Modes.hydration,
    tag,
    onPaginate: onPaginate
  })

  await SearchForm.render({
    onSearch,
    onReset: onResetSearch
  })
}

export default {
  render
}
