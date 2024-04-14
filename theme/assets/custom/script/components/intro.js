import { debounce, region, transition } from '../helpers.js'

const render = debounce(async (template, data) => {
  const $el = region('intro')
  const { html, transitionSettings } = template(data)
  const $newEl = $el.cloneNode(true)
  $newEl.innerHTML = html
  await transition({
    target: $el,
    className: 'exiting',
    duration: (transitionSettings || {}).exit || 500,
    crossFade: 2/3
  })
  $el.parentElement.prepend($newEl)
  await transition({
    target: $newEl,
    className: 'entering',
    duration: (transitionSettings || {}).enter || 500,
    crossFade: 2/3
  })
  $el.remove()
}, 500)

export default {
  render
}
