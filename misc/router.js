/*
 * During SPA transition, I first thought I would be using a full-fledged router
 * and reactively render the app. Not that this router is robust at all. But it
 * would do the job.
 *
 * Soon I realized that's not what I want. I didn't want to run cycles
 * unnecessarily re-rendering everything on every route. Maybe I could still
 * use this to imperatively manage things, but, at the time, it didn't seem like
 * it would have obvious advantages compared to a simpler solution.
 *
 * Simpler solution being: controller injects callbacks into components
 *
 * To keep things simpler, I decided to abandon this for now. And implemented
 * a dead-simple history wrapper.
 *
 * If I hadn't, here's how I would be using this router:
 *
 * const Router = createRouter()
 *
 * Router
 *   .on('/', Controller.homepage)
 *   .on('/page/:pageNumber', Controller.homepage)
 *   .on('/tags/:tag', Controller.tag)
 *   .on('/tags/:tag/:pageNumber', Controller.tag)
 *   .on('#search?q=:query', Controller.search) // This wouldn't work
 *   .start()
*/

import { fetchPrefix } from './helpers.js'

const createRouter = () => {
  const routes = {}

  const getRouteParts = (route) => {
    return route
      .replace(/^\//, '')
      .replace(/\/$/, '')
      .split('/')
  }

  const checkMatch = (actualRoute) => {
    let routeParams
    let matchingRoute
    for (const route in routes) {
      if (!routes.hasOwnProperty(route)) {
        continue
      }
      const parts = [
        getRouteParts(route),
        getRouteParts(actualRoute)
      ]
      if (parts[0].length !== parts[1].length) {
        continue
      }
      routeParams = parts[1].reduce((acc, part, i) => {
        if (!part.startsWith(':') && parts[0][i] === part) {
          return acc
        }
        if (parts[0][i].startsWith(':')) {
          return {
            ...acc,
            [parts[0][i].replace(/^:/, '')]: part
          }
        }
        return false
      }, {})
      if (routeParams) {
        matchingRoute = route
        break
      }
    }
    return {
      route: matchingRoute,
      params: routeParams
    }
  }

  return {
    start(initialState = {}) {
      window.history.replaceState(initialState, '', document.location.href)
      window.addEventListener("popstate", (event) => {
        console.log('router popstate event', event)
        const route = document.location.pathname.replace(new RegExp('^' + fetchPrefix), '')
        const match = checkMatch(route)
        if (match) {
          console.log('routing to', match.route)
          this.navigate(route, event.state)
        }
      })
      console.log('router start')
      return this
    },

    on(route, handler) {
      routes[route] = handler
      return this
    },

    navigate(route, state) {
      window.history.pushState(state, '', route)
      const match = checkMatch(route)
      if (!match) {
        console.info('Unknown route', route)
      }
      const handler = routes[match.route]
      handler(state || match.params)
    }
  }
}

export default createRouter
