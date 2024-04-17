import Modes from '../modes.js'
import ViewResources from '../view-resources.js'
import Intros from '../intros.js'
import Intro from '../components/intro.js'
import Header from '../components/header.js'
import SearchForm from '../components/search-form.js'
import ActivityChart from '../components/activity-chart.js'
import Pagination from '../components/pagination.js'
import Content from '../components/content.js'
import { scrollToTop, getPages, getPageLinks } from '../helpers.js'

const resources = new ViewResources({
  stylesheets: {
    'homepage-stylesheet': 'style/homepage.css'
  }
})

const render = ({
  links,
  pageNumber,
  navigatedFrom,
  onPaginate
}) => {
  const pages = getPages({ links })
  const pageLinks = getPageLinks({ pages, pageNumber })

  resources.load()

  SearchForm.setInputValue('')

  Intro.render(Intros.homepage, {
    links
  })

  if (navigatedFrom.pagination === 'ActivityChart') {
    ActivityChart.updateCurrentPage({
      pageNumber
    })
  } else {
    ActivityChart.render({
      mode: Modes.full,
      links,
      pages,
      pageNumber,
      onPaginate: (payload) => onPaginate({
        ...payload,
        paginationType: 'ActivityChart'
      })
    })
  }

  Content.render({
    links: pageLinks
  })

  Pagination.render({
    mode: Modes.full,
    pageNumber,
    totalPages: pages.length,
    onPaginate
  })

  if (navigatedFrom.pagination !== 'ActivityChart') {
    scrollToTop()
  }

  Header.blur()
}

export default {
  render
}
