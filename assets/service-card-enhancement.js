(() => {
  'use strict'

  const serviceCards = {
    '/services/dementia-care': {
      src: '/images/services/dementia-care.jpg',
      alt: 'An older man and carer exploring family photographs from a memory box.',
    },
    '/services/autism-neurodiversity': {
      src: '/images/services/autism-neurodiversity.webp',
      alt: 'A support worker and young person using a visual day planner in a calm room.',
    },
    '/services/personal-care': {
      src: '/images/services/personal-care.jpg',
      alt: 'An older woman choosing clothing with a carer in a bright home bathroom.',
    },
    '/services/companionship': {
      src: '/images/services/companionship.jpg',
      alt: 'Two men enjoying a game of chess together outdoors.',
    },
    '/services/respite-reablement': {
      src: '/images/services/respite-reablement.jpg',
      alt: 'An older woman practising a garden-path walk with a carer close by.',
    },
    '/services/medication-support': {
      src: '/images/services/medication-support.jpg',
      alt: 'An older woman and carer reviewing a weekly pill organiser beside a clock.',
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
