import createApp from './App.js'
import createApi from './Api.js'
import createState from './State.js'
import createActions from './Actions.js'
import initialState from './initialState.js'

const App = createApp()
const Api = createApi({ baseUrl: '.' })
const State = createState(initialState, App.render)
const Actions = createActions(State, Api)

App.init(Actions, State)
