import { query } from '../helpers.js'

const findLogo = () => query('.logo-container')

const render = ({ onClickLogo }) => {
  findLogo().addEventListener('click', event => {
    event.preventDefault()
    onClickLogo()
  })
}

const blurLogo = () => {
  findLogo().blur()
}

export default {
  render,
  blur: blurLogo
}
