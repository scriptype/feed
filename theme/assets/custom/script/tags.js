const init = () => {
  const outsideRegions = document.querySelectorAll('header.header, main.content, footer.footer')
  const listContainer = document.querySelector('.tags-list-container')
  const listToggleBtn = listContainer.querySelector('.tags-list-toggle-label')
  const toggleLabels = {
    clickToOpen: 'Show topics',
    clickToClose: 'Hide topics'
  }

  const listToggleAutoExpandHandler = () => {
    if (window.innerWidth <= 900 && listContainer.hasAttribute('open')) {
      listContainer.removeAttribute('open')
      listToggleBtn.textContent = toggleLabels.clickToOpen
    }
    if (window.innerWidth > 900) {
      listContainer.setAttribute('open', true)
      listToggleBtn.textContent = toggleLabels.clickToClose
    }
  }

  listToggleBtn.addEventListener('click', () => {
    if (listToggleBtn.textContent === toggleLabels.clickToClose) {
      // Changing toggle text immediately somehow causes mobile safari
      // not to expand the details element at all.
      setTimeout(() => {
        listToggleBtn.textContent = toggleLabels.clickToOpen
        document.body.classList.remove('tags-list-is-open')
        outsideRegions.forEach(region => {
          region.removeAttribute('inert')
        })
      }, 200)
    } else {
      setTimeout(() => {
        listToggleBtn.textContent = toggleLabels.clickToClose
        document.body.classList.add('tags-list-is-open')
        if (window.innerWidth <= 900) {
          outsideRegions.forEach(region => region.inert = true)
        }
      }, 200)
    }
  })

  window.addEventListener('resize', listToggleAutoExpandHandler)
  window.addEventListener('orientationchange', listToggleAutoExpandHandler)
  listToggleAutoExpandHandler()
}

export default {
  init
}
