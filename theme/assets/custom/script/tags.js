const init = () => {
  const listToggle = document.querySelector('.tags-list-toggle')
  const listToggleBtn = listToggle.querySelector('.tags-list-toggle-label')
  const toggleLabels = {
    clickToOpen: 'Show topics',
    clickToClose: 'Hide topics'
  }

  const listToggleAutoExpandHandler = () => {
    if (window.innerWidth <= 900 && listToggle.getAttribute('open') === 'true') {
      listToggleBtn.textContent = toggleLabels.clickToOpen
      listToggle.removeAttribute('open')
    }
    if (window.innerWidth > 900 && !listToggle.hasAttribute('open')) {
      listToggleBtn.textContent = toggleLabels.clickToClose
      listToggle.setAttribute('open', true)
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
