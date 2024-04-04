const init = () => {
  const listToggle = document.querySelector('.tags-list-toggle')
  const listToggleBtn = listToggle.querySelector('.tags-list-toggle-label')
  const toggleLabels = {
    clickToOpen: 'Show topics',
    clickToClose: 'Hide topics'
  }

  const listToggleAutoExpandHandler = () => {
    if (window.innerWidth <= 900 && listToggle.hasAttribute('open')) {
      listToggle.removeAttribute('open')
      listToggleBtn.textContent = toggleLabels.clickToOpen
    }
    if (window.innerWidth > 900) {
      listToggle.setAttribute('open', true)
      listToggleBtn.textContent = toggleLabels.clickToClose
    }
  }

  listToggleBtn.addEventListener('click', () => {
    if (listToggleBtn.textContent === toggleLabels.clickToClose) {
      listToggleBtn.textContent = toggleLabels.clickToOpen
    } else {
      listToggleBtn.textContent = toggleLabels.clickToClose
    }
  })

  window.addEventListener('resize', listToggleAutoExpandHandler)
  window.addEventListener('orientationchange', listToggleAutoExpandHandler)
  listToggleAutoExpandHandler()
}

export default {
  init
}
