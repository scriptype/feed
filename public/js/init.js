import createApp from './App.js'
import createApi from './Api.js'
import createStore from './Store.js'
import createActions from './Actions.js'
import Reducer from './Reducer.js'

const App = createApp()
const Api = createApi({ baseUrl: '.' })
const Store = createStore(Reducer, App.render)
const Actions = createActions(Store, Api)

App.init(Actions, Store)
