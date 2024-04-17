import Finder from './finder.js'
import * as Views from './views/index.js'
import Links from './links.js'
import Router from './router.js'
import { getTagFromUrl, getPageNumberFromUrl, getSearchQueryFromUrl } from './helpers.js'

const debug = false

const createController = () => {
  let state = {}
  let linkFinder = null

  const start = async () => {
    document.body.classList.add('js-enhanced')

    Links.fetch('posts.min.json')

    linkFinder = new Finder({
      entries: await Links.all()
    })

    const searchQuery = getSearchQueryFromUrl()
    const tag = getTagFromUrl()
    const pageNumber = getPageNumberFromUrl()
    const links = tag ? await Links.findByTag(tag) : await Links.all()

    state = {
      tag,
      links,
      pageNumber,
      searchQuery
    }

    await Views.Start.render({
      onClickLogo: navigateHomepage,
      onClickTag: navigateTagPage,
      onPaginate: navigatePage,
      onSearch: (payload) => {
        onSearch(payload)
        state.searchQuery = payload.query
        Router.search(state)
      },
      onResetSearch,
      tag,
      links,
      pageNumber
    })

    if (searchQuery) {
      onSearch({ query: searchQuery })
    }

    Router.start(state, navigateBack, { debug })
  }

  const navigateBack = async (event) => {
    if (!event.state) {
      console.log('no')
      return
    }
    const { links, pageNumber, tag, searchQuery } = event.state
    const navigatedFrom = {
      differentPage: state.searchQuery || state.tag !== tag
    }
    state = {
      tag,
      links,
      pageNumber,
      searchQuery
    }

    if (searchQuery) {
      return onSearch({ query: searchQuery })
    }

    if (tag) {
      return Views.Tag.render({
        tag,
        links,
        pageNumber,
        navigatedFrom,
        onPaginate: navigatePage
      })
    }

    return Views.Homepage.render({
      links,
      pageNumber,
      navigatedFrom,
      onPaginate: navigatePage
    })
  }

  const navigatePage = async ({ tag, pageNumber, paginationType }) => {
    const links = await Links.findByTag(tag)
    const navigatedFrom = {
      pagination: paginationType || true
    }

    state = {
      tag,
      links,
      pageNumber,
      searchQuery: ''
    }

    if (tag) {
      Views.Tag.render({
        tag,
        links,
        pageNumber,
        navigatedFrom,
        onPaginate: navigatePage
      })

      return Router.tag(state)
    }

    Views.Homepage.render({
      links,
      pageNumber,
      navigatedFrom,
      onPaginate: navigatePage
    })

    Router.homepage(state)
  }

  const navigateHomepage = async ()  => {
    const links = await Links.all()
    const navigatedFrom = {
      differentPage: state.searchQuery || state.tag,
      pagination: state.pageNumber > 0
    }

    state = {
      links,
      pageNumber: 0,
      searchQuery: ''
    }

    Views.Homepage.render({
      links,
      pageNumber: 0,
      navigatedFrom,
      onPaginate: navigatePage
    })

    Router.homepage(state)
  }

  const navigateTagPage = async ({ tag } = {})  => {
    const links = await Links.findByTag(tag)
    const navigatedFrom = {
      differentPage: state.searchQuery || state.tag !== tag,
      pagination: state.pageNumber > 0
    }
    state = {
      tag,
      links,
      pageNumber: 0,
      searchQuery: ''
    }

    Views.Tag.render({
      tag,
      links,
      pageNumber: 0,
      navigatedFrom,
      onPaginate: navigatePage
    })

    Router.tag(state)
  }

  const onSearch = ({ query }) => {
    const links = linkFinder.find(query)

    Views.Search.render({
      links,
      searchQuery: query
    })
  }

  const onResetSearch = async () => {
    const tag = getTagFromUrl()
    const pageNumber = getPageNumberFromUrl()
    const links = tag ? await Links.findByTag(tag) : await Links.all()
    const navigatedFrom = {
      differentPage: false,
      pagination: false
    }
    state.searchQuery = ''

    if (tag) {
      Views.Tag.render({
        tag,
        links,
        pageNumber,
        navigatedFrom,
        onPaginate: navigatePage
      })

      return Router.tag(state)
    }

    Views.Homepage.render({
      links,
      pageNumber,
      navigatedFrom,
      onPaginate: navigatePage
    })

    return Router.homepage(state)
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
