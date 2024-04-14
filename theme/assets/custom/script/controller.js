import Dictionary from '../../common/dictionary.js'
import Finder from './finder.js'
import Resources from './resources.js'
import Modes from './modes.js'
import Intros from './intros.js'
import Header from './components/header.js'
import SearchForm from './components/search-form.js'
import Intro from './components/intro.js'
import TagsList from './components/tags-list.js'
import ActivityChart from './components/activity-chart.js'
import Pagination from './components/pagination.js'
import Content from './components/content.js'
import Links from './links.js'
import Router from './router.js'
import {
  chunk,
  getTagFromUrl,
  getPageNumberFromUrl,
  getSearchQueryFromUrl,
  scrollToTop
} from './helpers.js'

const debug = false

const getPages = ({ links, linksPerPage = 15 }) => {
  return chunk(links, linksPerPage)
}

const getPageLinks = ({ links, pages, pageNumber, linksPerPage = 15 }) => {
  const _pages = pages || getPages({ links, linksPerPage })

  return pageNumber > 1 ?
    _pages[pageNumber - 1] :
    _pages[0]
}

const logState = (msg, { tag, links, pageNumber, searchQuery }) => {
  if (!debug) {
    return
  }
  console.log(
    `ctl.${msg}`,
    'tag', tag,
    'links', links.length,
    'pageNumber', pageNumber,
    'searchQuery', searchQuery
  )
}

const createController = () => {
  let state = {}
  let linkFinder = null

  const start = async () => {
    document.body.classList.add('js-enhanced')

    Links.fetch('posts.min.json')

    Header.render({
      onClickLogo: navigateHomepage
    })

    TagsList.render({
      onClickTag: navigateTagPage
    })

    linkFinder = new Finder({
      entries: await Links.all()
    })

    const searchQuery = getSearchQueryFromUrl()
    const tag = getTagFromUrl()
    const pageNumber = getPageNumberFromUrl()
    const links = tag ? await Links.findByTag(tag) : await Links.all()
    const pages = getPages({ links })

    ActivityChart.render({
      mode: Modes.hydration,
      tag,
      links,
      pages,
      pageNumber,
      onPaginate: (payload) => navigatePage({
        ...payload,
        tag,
        paginationType: 'ActivityChart'
      })
    })

    Pagination.render({
      mode: Modes.hydration,
      tag,
      onPaginate: navigatePage
    })

    state = {
      tag,
      links,
      pageNumber,
      searchQuery
    }
    logState('start', state)

    Dictionary.ready(() => {
      SearchForm.render({
        onSearch: (payload) => {
          onSearch(payload)
          state.searchQuery = payload.query
          Router.search(state)
        },
        onReset: onResetSearch
      })

      if (searchQuery) {
        onSearch({ query: searchQuery })
      }
    })

    Router.start(state, navigateBack)
  }

  const navigateBack = async (event) => {
    if (!event.state) {
      console.log('no')
      return
    }
    const { links, pageNumber, tag, searchQuery } = event.state
    const pages = getPages({ links })
    const navigatedFrom = {
      differentPage: state.searchQuery || state.tag !== tag
    }

    if (tag) {
      Resources.tag.load()
    } else {
      Resources.homepage.load()
    }

    if (navigatedFrom.differentPage) {
      Intro.render(tag ? Intros.tag : Intros.homepage, {
        links,
        tag
      })
      ActivityChart.render({
        mode: Modes.full,
        tag,
        links,
        pages,
        pageNumber,
        onPaginate: (payload) => navigatePage({
          ...payload,
          tag,
          paginationType: 'ActivityChart'
        })
      })
    } else {
      ActivityChart.updateCurrentPage({
        pageNumber
      })
    }

    Content.render({
      links: getPageLinks({ pages, pageNumber })
    })

    Pagination.render({
      mode: Modes.full,
      tag,
      pageNumber,
      totalPages: pages.length,
      onPaginate: navigatePage
    })

    state = {
      tag,
      links,
      pageNumber,
      searchQuery
    }
    logState('navigateBack', state)

    if (searchQuery) {
      onSearch({ query: searchQuery })
    } else {
      SearchForm.setInputValue('')
    }

    scrollToTop()
  }

  const navigatePage = async ({ tag, pageNumber, paginationType }) => {
    const links = await Links.findByTag(tag)
    const pages = getPages({ links })
    const pageLinks = getPageLinks({ pages, pageNumber })

    SearchForm.setInputValue('')

    ActivityChart.updateCurrentPage({
      pageNumber
    })

    Content.render({
      links: pageLinks
    })

    Pagination.render({
      mode: Modes.full,
      tag,
      pageNumber,
      totalPages: pages.length,
      onPaginate: navigatePage
    })

    state = {
      tag,
      links,
      pageNumber,
      searchQuery: ''
    }
    logState('navigatePage', state)

    if (paginationType !== 'ActivityChart') {
      scrollToTop()
    }

    if (tag) {
      Router.tag(state)
    } else {
      Router.homepage(state)
    }
  }

  const navigateHomepage = async ()  => {
    const links = await Links.all()
    const pages = getPages({ links })
    const navigatedFrom = {
      differentPage: state.searchQuery || state.tag,
      pagination: state.pageNumber > 0
    }

    Resources.homepage.load()

    Intro.render(Intros.homepage, {
      links
    })

    SearchForm.setInputValue('')

    if (navigatedFrom.differentPage || navigatedFrom.pagination) {
      if (navigatedFrom.differentPage) {
        ActivityChart.render({
          mode: Modes.full,
          links,
          pages,
          onPaginate: (payload) => navigatePage({
            ...payload,
            paginationType: 'ActivityChart'
          })
        })
      } else {
        ActivityChart.updateCurrentPage({
          pageNumber: 0
        })
      }

      Content.render({
        links: pages[0]
      })

      Pagination.render({
        mode: Modes.full,
        pageNumber: 0,
        totalPages: pages.length,
        onPaginate: navigatePage
      })
    }

    state = {
      links,
      pageNumber: 0,
      searchQuery: ''
    }
    logState('navigateHomepage', state)

    scrollToTop()

    Router.homepage(state)
  }

  const navigateTagPage = async ({ tag } = {})  => {
    const links = await Links.findByTag(tag)
    const pages = getPages({ links })
    const navigatedFrom = {
      differentPage: state.searchQuery || state.tag !== tag,
      pagination: state.pageNumber > 0
    }

    Resources.tag.load()

    Intro.render(Intros.tag, {
      links,
      tag
    })

    SearchForm.setInputValue('')

    if (navigatedFrom.differentPage || state.pageNumber > 0) {
      if (navigatedFrom.differentPage) {
        ActivityChart.render({
          mode: Modes.full,
          tag,
          links,
          pages,
          onPaginate: (payload) => navigatePage({
            ...payload,
            tag,
            paginationType: 'ActivityChart'
          })
        })
      } else {
        ActivityChart.updateCurrentPage({
          pageNumber: 0
        })
      }

      Content.render({
        links: pages[0]
      })

      Pagination.render({
        mode: Modes.full,
        pageNumber: 0,
        totalPages: pages.length,
        onPaginate: navigatePage
      })
    }

    state = {
      tag,
      links,
      pageNumber: 0,
      searchQuery: ''
    }
    logState('navigateTagPage', state)

    scrollToTop()

    Router.tag(state)
  }

  const onSearch = ({ query }) => {
    const links = linkFinder.find(query)

    Intro.render(Intros.search, {
      query,
      links
    })

    SearchForm.setInputValue(query)

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

  const onResetSearch = async () => {
    const tag = getTagFromUrl()
    const pageNumber = getPageNumberFromUrl()
    const links = tag ? await Links.findByTag(tag) : await Links.all()
    const pages = getPages({ links })

    const intro = tag ? Intros.tag : Intros.homepage
    Intro.render(intro, {
      links,
      tag
    })

    ActivityChart.render({
      mode: Modes.full,
      tag,
      links,
      pages,
      onPaginate: (payload) => navigatePage({
        ...payload,
        tag,
        paginationType: 'ActivityChart'
      })
    })

    ActivityChart.updateCurrentPage({
      pageNumber
    })

    Content.render({
      links: getPageLinks({ pages, pageNumber })
    })

    Pagination.render({
      mode: Modes.full,
      pageNumber,
      totalPages: pages.length,
      onPaginate: navigatePage
    })

    state.searchQuery = ''
    if (tag) {
      Router.tag(state)
    } else {
      Router.homepage(state)
    }
  }

  return {
    start,
    onSearch,
    onResetSearch,
    navigatePage,
    navigateHomepage,
    navigateTagPage
  }
}

export default createController
