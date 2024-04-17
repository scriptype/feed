import Modes from '../modes.js'
import ViewResources from '../view-resources.js'
import Intros from '../intros.js'
import Intro from '../components/intro.js'
import SearchForm from '../components/search-form.js'
import ActivityChart from '../components/activity-chart.js'
import Pagination from '../components/pagination.js'
import Content from '../components/content.js'
import { scrollToTop, getPages, getPageLinks } from '../helpers.js'

const resources = new ViewResources({
  stylesheets: {
    'tag-stylesheet': 'style/tag-page.css'
  }
})

const render = ({
  tag,
  links,
  pageNumber,
  navigatedFrom,
  onPaginate
}) => {
  const pages = getPages({ links })
  const pageLinks = getPageLinks({ pages, pageNumber })

  resources.load()

  Intro.render(Intros.tag, {
    links,
    tag
  })

  SearchForm.setInputValue('')

  if (navigatedFrom.pagination === 'ActivityChart') {
    ActivityChart.updateCurrentPage({
      pageNumber
    })
  } else {
    ActivityChart.render({
      mode: Modes.full,
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
  }

  Content.render({
    links: pageLinks
  })

  Pagination.render({
    mode: Modes.full,
    tag,
    pageNumber,
    totalPages: pages.length,
    onPaginate
  })

  if (navigatedFrom.pagination !== 'ActivityChart') {
    scrollToTop()
  }
}

export default {
  render
}
