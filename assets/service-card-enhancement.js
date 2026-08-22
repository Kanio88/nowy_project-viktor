(() => {
  'use strict'

  const serviceCards = {
    '/services/dementia-care': {
      src: '/images/services/dementia-care.jpg',
      alt: 'An older adult and carer looking through a photo album together at home.',
    },
    '/services/autism-neurodiversity': {
      src: '/images/services/autism-neurodiversity.jpg',
      alt: 'An adult and carer sharing a quiet creative activity at home.',
    },
    '/services/personal-care': {
      src: '/images/services/personal-care.jpg',
      alt: 'An older adult and carer choosing comfortable clothing together at home.',
    },
    '/services/companionship': {
      src: '/images/services/companionship.jpg',
      alt: 'An older adult and carer sharing a relaxed conversation over tea.',
    },
    '/services/respite-reablement': {
      src: '/images/services/respite-reablement.jpg',
      alt: 'An older adult building confidence while walking with a carer nearby.',
    },
    '/services/medication-support': {
      src: '/images/services/medication-support.jpg',
      alt: 'An older adult and carer calmly reviewing a weekly medication organiser.',
    },
  }

  function enhanceServiceCards() {
    let enhancedCount = 0

    Object.entries(serviceCards).forEach(([path, image]) => {
      const links = document.querySelectorAll(`a[href="${path}"]`)

      links.forEach((link) => {
        const card = link.querySelector('div.bg-white.rounded-2xl')
        if (!card || card.dataset.serviceImageEnhanced === 'true') return

        const title = card.querySelector('h3')
        const description = card.querySelector('p')
        if (!title || !description) return

        const oldIcon = card.querySelector('span.text-3xl')
        if (oldIcon) oldIcon.remove()

        const media = document.createElement('figure')
        media.className = 'service-card-media'

        const photo = document.createElement('img')
        photo.src = image.src
        photo.alt = image.alt
        photo.loading = 'lazy'
        photo.decoding = 'async'
        photo.width = 2304
        photo.height = 1536

        media.append(photo)
        card.insertBefore(media, title)
        card.dataset.serviceImageEnhanced = 'true'
        link.classList.add('service-card-link')
        enhancedCount += 1
      })
    })

    return enhancedCount
  }

  function initialise() {
    if (enhanceServiceCards() === Object.keys(serviceCards).length) return

    const observer = new MutationObserver(() => {
      if (enhanceServiceCards() === Object.keys(serviceCards).length) observer.disconnect()
    })

    observer.observe(document.documentElement, { childList: true, subtree: true })
    window.setTimeout(() => observer.disconnect(), 8000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true })
  } else {
    initialise()
  }
})()
