const init = () => {
  const listToggle = document.querySelector('.tags-list-toggle')
  const listToggleBtn = listToggle.querySelector('.tags-list-toggle-label')
  const toggleLabels = {
    clickToOpen: 'Show topics',
    clickToClose: 'Hide topics'
  }

  const listToggleAutoExpandHandler = () => {
    if (window.innerWidth <= 900 && listToggle.getAttribute('open') === 'true') {
      listToggle.removeAttribute('open')
    }
    if (window.innerWidth > 900 && !listToggle.hasAttribute('open')) {
      listToggle.setAttribute('open', true)
    }
  }

  listToggleBtn.addEventListener('click', () => {
    if (listToggleBtn.getAttribute('aria-label') === toggleLabels.clickToClose) {
      listToggleBtn.setAttribute('aria-label', toggleLabels.clickToOpen)
    } else {
      listToggleBtn.setAttribute('aria-label', toggleLabels.clickToClose)
    }
  })

  window.addEventListener('resize', listToggleAutoExpandHandler)
  window.addEventListener('orientationchange', listToggleAutoExpandHandler)
  listToggleAutoExpandHandler()

  listToggleBtn.setAttribute('aria-label', toggleLabels.clickToOpen)
}

export default {
  init
}
