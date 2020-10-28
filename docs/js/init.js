import createApp from './App.js'
import createApi from './Api.js'
import createStore from './lib/Store.js'
import createActions from './Actions.js'
import Reducers from './Reducers.js'
import { isDev } from './lib/utils.js'

const baseUrl = isDev()
  ? './test-data'
  : './data'

const App = createApp()
const Api = createApi({ baseUrl })
const Store = createStore(Reducers, App.render)
const Actions = createActions(Store, Api)

App.init(Actions, Store)
