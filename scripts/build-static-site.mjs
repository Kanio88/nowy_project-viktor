import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const canonicalHost = 'https://every-day-care.com'

const business = {
  name: 'Everyday Care Plus Ltd',
  url: canonicalHost,
  telephone: '+447563011244',
  email: 'greg@every-day-care.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '22 Tudor Court',
    addressLocality: 'Tipton',
    addressRegion: 'West Midlands',
    postalCode: 'DY4 8UU',
    addressCountry: 'GB',
  },
  areaServed: ['Sandwell', 'Dudley', 'Tipton', 'Oldbury', 'West Bromwich', 'Smethwick', 'Walsall'],
}

const routes = [
  {
    path: '/',
    title: 'Home Care in Sandwell & Dudley | Everyday Care Plus',
    description: 'Compassionate, person-centred home care in Sandwell and Dudley. Dementia, autism, personal care, companionship, respite and medication support. Call 07563 011 244.',
    h1: 'Compassionate Home Care in Sandwell & Dudley',
    intro: 'Everyday Care Plus provides dignified, person-centred support that helps adults live independently at home. Speak with us about a free, no-obligation home-care assessment.',
    sections: [
      ['Our home-care services', 'We offer dementia care, autism and neurodiversity support, personal care, companionship, respite and reablement, and medication support. Care is planned around the individual, their family, and their routine.'],
      ['Areas we cover', 'Our local team supports families across Sandwell and Dudley, including Tipton, Oldbury, West Bromwich, Smethwick, and Walsall where service availability allows.'],
    ],
  },
  {
    path: '/services',
    title: 'Home Care Services in Sandwell & Dudley | Everyday Care Plus',
    description: 'Explore personalised home-care services in Sandwell and Dudley, including dementia care, autism support, personal care, companionship, respite and medication support.',
    h1: 'Home Care Services for Sandwell & Dudley Families',
    intro: 'We provide flexible, personalised home support designed around each person’s needs, preferences, routines, and family circumstances.',
    sections: [
      ['Specialist support at home', 'Our service range includes dementia care, autism and neurodiversity support, personal care, companionship, respite and reablement, and medication support.'],
      ['Start with an assessment', 'Contact us to discuss the kind of support you are looking for. We will explain the assessment process and next steps clearly.'],
    ],
  },
  {
    path: '/services/dementia-care',
    title: 'Dementia Care at Home in Sandwell & Dudley | Everyday Care Plus',
    description: 'Specialist dementia home care in Sandwell and Dudley, designed to maintain routine, dignity, safety and family confidence. Book a free assessment.',
    h1: 'Dementia Care at Home',
    intro: 'Our dementia care is planned to support familiarity, dignity, and day-to-day wellbeing for people living with dementia and the families who care about them.',
    sections: [
      ['What support can include', 'Care may include routine-based visits, companionship, memory-supporting activities, meal support, medication reminders, overnight support, and practical reassurance for families.'],
      ['Planning care together', 'We begin by listening to the individual and those close to them, then create a care plan that reflects established routines, communication preferences, and safety needs.'],
    ],
  },
  {
    path: '/services/autism-neurodiversity',
    title: 'Autism & Neurodiversity Home Support in Sandwell & Dudley | Everyday Care Plus',
    description: 'Structured, sensory-aware home support for autistic and neurodivergent adults in Sandwell and Dudley. Discuss personalised care with Everyday Care Plus.',
    h1: 'Autism & Neurodiversity Support at Home',
    intro: 'We provide structured, sensory-aware support designed around each individual’s preferences, communication style, routines, and goals.',
    sections: [
      ['A personalised approach', 'Support is developed with the individual, their family, and relevant professionals where appropriate. We focus on predictability, respectful communication, and continuity.'],
      ['Discuss your needs', 'An initial conversation helps us understand the kind of support that may be helpful and whether our service is the right fit.'],
    ],
  },
  {
    path: '/services/personal-care',
    title: 'Personal Care at Home in Sandwell & Dudley | Everyday Care Plus',
    description: 'Respectful personal care at home in Sandwell and Dudley, including support with daily routines, meals, dressing and personal hygiene.',
    h1: 'Personal Care at Home',
    intro: 'Our personal care support is delivered respectfully and with attention to dignity, privacy, routine, and individual preference.',
    sections: [
      ['Daily living support', 'Depending on the agreed care plan, visits may support bathing, dressing, meals, mobility, personal routines, and day-to-day wellbeing.'],
      ['Care with dignity', 'We take time to understand what matters to each person and aim to provide consistent, professional support in the familiarity of home.'],
    ],
  },
  {
    path: '/services/companionship',
    title: 'Companionship Care in Sandwell & Dudley | Everyday Care Plus',
    description: 'Friendly companionship care in Sandwell and Dudley, with conversation, outings, practical support and meaningful routine at home.',
    h1: 'Companionship Care at Home',
    intro: 'Companionship visits provide friendly, dependable time with a trusted carer, helping people stay connected to their interests, routines, and community.',
    sections: [
      ['Meaningful visits', 'Visits can include conversation, shared activities, local outings, practical help, and support to maintain a regular, enjoyable routine.'],
      ['Support for families', 'Companionship can also offer reassurance to families who want a loved one to have regular social contact and support.'],
    ],
  },
  {
    path: '/services/respite-reablement',
    title: 'Respite & Reablement Care in Sandwell & Dudley | Everyday Care Plus',
    description: 'Respite and reablement support for families in Sandwell and Dudley. Arrange flexible home care that supports independence and family carers.',
    h1: 'Respite & Reablement Care',
    intro: 'Respite care gives family carers time to rest, while reablement-focused support can help people build or maintain confidence with daily living.',
    sections: [
      ['Flexible support', 'Care plans can be arranged around the family’s circumstances, including regular visits or temporary support when a carer needs a break.'],
      ['Supporting independence', 'We work with the individual and family to understand priorities, routines, and realistic goals for maintaining independence at home.'],
    ],
  },
  {
    path: '/services/medication-support',
    title: 'Medication Support at Home in Sandwell & Dudley | Everyday Care Plus',
    description: 'Safe, person-centred medication support at home in Sandwell and Dudley. Speak to Everyday Care Plus about a tailored care assessment.',
    h1: 'Medication Support at Home',
    intro: 'Medication support is planned around the individual’s care needs, preferences, prescribed arrangements, and the responsibilities agreed in the care plan.',
    sections: [
      ['A careful care-plan approach', 'We discuss the appropriate level of medication support during assessment and ensure the plan is clear for the individual, family, and care team.'],
      ['Talk to us first', 'Contact us to discuss your circumstances and whether this service is suitable for the support you need.'],
    ],
  },
  {
    path: '/about',
    title: 'About Everyday Care Plus | Home Care in Sandwell & Dudley',
    description: 'Learn about Everyday Care Plus, a local home-care provider supporting adults and families across Sandwell and Dudley.',
    h1: 'About Everyday Care Plus',
    intro: 'Everyday Care Plus is a local home-care provider focused on respectful, person-centred support for adults and families across Sandwell and Dudley.',
    sections: [
      ['Our approach', 'We listen first, create care plans around the individual, and aim to provide dependable support that feels personal, professional, and practical.'],
      ['Our local focus', 'Being local helps us understand the communities we serve and makes it easier for families to speak with us about the support they need.'],
    ],
  },
  {
    path: '/testimonials',
    title: 'Home Care Testimonials | Everyday Care Plus',
    description: 'Read feedback from families about Everyday Care Plus and our approach to compassionate home support in Sandwell and Dudley.',
    h1: 'What Families Say About Everyday Care Plus',
    intro: 'Families value care that is compassionate, dependable, and respectful. The feedback shared on this page reflects their experience of our service.',
    sections: [
      ['Considering home care', 'We welcome questions from families who are comparing care options and want to understand what a first assessment is like.'],
      ['Start with a conversation', 'Contact us for a no-obligation discussion about the kind of support you are looking for.'],
    ],
  },
  {
    path: '/faq',
    title: 'Home Care FAQs for Sandwell & Dudley Families | Everyday Care Plus',
    description: 'Answers to common home-care questions for families in Sandwell and Dudley, including assessments, visits, funding and getting started.',
    h1: 'Frequently Asked Questions About Home Care',
    intro: 'These answers address common questions from families who are considering care at home. Please contact us if you would like to discuss your own situation.',
    sections: [
      ['How do we begin?', 'The first step is a conversation about the person’s needs, preferred routine, and the kind of support the family is looking for.'],
      ['Can support be tailored?', 'Yes. Care planning should reflect the individual’s circumstances, preferences, and agreed goals.'],
    ],
  },
  {
    path: '/blog',
    title: 'Home Care Guides & Family Resources | Everyday Care Plus',
    description: 'Practical home-care guides for families in Sandwell and Dudley, covering dementia, funding, respite, autism support and choosing care.',
    h1: 'Guides for Families Considering Home Care',
    intro: 'Our guides are designed to help families ask useful questions, understand care options, and prepare for conversations about support at home.',
    sections: [
      ['Explore our guides', 'Read practical articles about dementia support, choosing a home-care provider, funding, respite, and supporting autistic adults at home.'],
      ['Need to talk?', 'A guide cannot replace a conversation about a real person’s circumstances. Contact us for a no-obligation discussion.'],
    ],
  },
  {
    path: '/blog/understanding-dementia-guide-families',
    title: 'Understanding Dementia: A Guide for Families | Everyday Care Plus',
    description: 'A practical family guide to understanding dementia, supportive routines and questions to ask when considering care at home.',
    h1: 'Understanding Dementia: A Guide for Families',
    intro: 'Dementia affects people differently. This guide offers practical questions and considerations for families who are exploring support at home.',
    sections: [['Practical next steps', 'Families often find it helpful to discuss routines, communication, safety, medication arrangements, and the kind of support that would make everyday life easier.']],
  },
  {
    path: '/blog/choosing-right-home-care-provider',
    title: 'How to Choose a Home Care Provider | Everyday Care Plus',
    description: 'Questions to ask when choosing a home-care provider in Sandwell or Dudley, including care planning, communication, continuity and next steps.',
    h1: 'How to Choose the Right Home Care Provider',
    intro: 'Choosing home care is an important decision. Families should have time to ask questions about care planning, communication, continuity, and how support will be reviewed.',
    sections: [['Questions to consider', 'Ask how needs are assessed, how carers are matched, who to contact with concerns, how the care plan is reviewed, and what happens if circumstances change.']],
  },
  {
    path: '/blog/funding-care-nhs-council-private',
    title: 'Funding Home Care: NHS, Council & Private Options | Everyday Care Plus',
    description: 'A starting guide to discussing home-care funding, local authority assessment and private arrangements. Check current official guidance for your circumstances.',
    h1: 'Funding Your Care: NHS, Council & Private Options',
    intro: 'Funding arrangements depend on individual circumstances and can change. Use this guide as a starting point, then check current official advice and seek appropriate support.',
    sections: [['Finding reliable information', 'Families can ask their local authority about an assessment and should use current official information when considering funding, eligibility, or financial decisions.']],
  },
  {
    path: '/blog/autism-home-care-what-to-expect',
    title: 'Autism Home Care: What to Expect | Everyday Care Plus',
    description: 'What families can discuss when arranging autism-informed home support, including routines, sensory preferences and communication.',
    h1: 'Autism Home Care: What to Expect',
    intro: 'Autism-informed home support should begin with the individual’s preferences, communication style, sensory needs, routines, and goals.',
    sections: [['Planning together', 'A good assessment allows the person and those close to them to explain what helps, what causes stress, and how support should be introduced.']],
  },
  {
    path: '/blog/respite-care-when-family-carers-need-break',
    title: 'When Family Carers Need a Break: Respite Care | Everyday Care Plus',
    description: 'A family guide to respite care at home, including questions to ask when arranging temporary or regular support.',
    h1: 'When Family Carers Need a Break: Respite Care',
    intro: 'Caring for someone can be demanding. Respite support can create time for family carers to rest while ensuring the person they support receives planned care.',
    sections: [['Arranging respite', 'Start by explaining the existing routine, care needs, important preferences, and the type of support that would give the family confidence.']],
  },
  {
    path: '/blog/everyday-care-plus-launches-sandwell',
    title: 'Everyday Care Plus Supports Families in Sandwell | Everyday Care Plus',
    description: 'Everyday Care Plus provides person-centred home support for adults and families in Sandwell and Dudley.',
    h1: 'Everyday Care Plus Supports Families in Sandwell',
    intro: 'Everyday Care Plus is focused on providing compassionate, person-centred home support for adults and families across Sandwell and Dudley.',
    sections: [['Speak with our team', 'If you are considering support for yourself or a loved one, contact us to discuss the kind of care you are looking for.']],
  },
  {
    path: '/blog/sensory-needs-autistic-adults',
    title: 'Supporting Sensory Needs for Autistic Adults at Home | Everyday Care Plus',
    description: 'Practical considerations for supporting sensory needs and predictable routines for autistic adults at home.',
    h1: 'Supporting Sensory Needs for Autistic Adults at Home',
    intro: 'Sensory preferences are individual. Support planning should listen carefully to what helps a person feel comfortable, safe, and in control at home.',
    sections: [['Practical planning', 'Discuss lighting, sound, personal space, routines, communication, and the way new support is introduced. Review the plan as needs and preferences change.']],
  },
  {
    path: '/blog/autism-community-support-sandwell',
    title: 'Autism Community Support in Sandwell | Everyday Care Plus',
    description: 'A practical guide to considering community and home-support options for autistic adults and families in Sandwell.',
    h1: 'Autism Community Support in Sandwell',
    intro: 'Families may benefit from understanding the local and community support options available alongside personalised care at home.',
    sections: [['Finding support', 'Use current official and community information, and discuss individual needs with relevant professionals or organisations where appropriate.']],
  },
  {
    path: '/blog/autism-routines-home-care',
    title: 'Why Routines Matter in Autism Home Care | Everyday Care Plus',
    description: 'How predictable routines, communication and respectful planning can support autistic adults receiving care at home.',
    h1: 'Why Routines Matter in Autism Home Care',
    intro: 'Consistent routines can help home support feel more predictable. Each plan should be shaped around the person’s own preferences and communication needs.',
    sections: [['Respectful consistency', 'Discuss the daily routine, preferred ways to communicate, how change is introduced, and what support should look like on a good day and a difficult day.']],
  },
  {
    path: '/book',
    title: 'Book a Free Home Care Assessment | Everyday Care Plus',
    description: 'Book a free, no-obligation home-care assessment with Everyday Care Plus for support in Sandwell and Dudley.',
    h1: 'Book Your Free Home Care Consultation',
    intro: 'Arrange a no-obligation conversation about the support you or your family member may need. Choose a home visit, telephone call, or online meeting where available.',
    sections: [['What to expect', 'We will listen to your situation, explain the assessment process, and discuss appropriate next steps. You can also call 07563 011 244.']],
  },
  {
    path: '/contact',
    title: 'Contact Everyday Care Plus | Home Care in Sandwell & Dudley',
    description: 'Contact Everyday Care Plus to discuss home-care support for adults and families in Sandwell and Dudley. Call 07563 011 244.',
    h1: 'Contact Everyday Care Plus',
    intro: 'Talk to us about home care for yourself or a loved one. We will listen to your situation and explain the next steps clearly.',
    sections: [['Get in touch', 'Call 07563 011 244 or email greg@every-day-care.com. You can also request a free consultation through our booking page.']],
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Everyday Care Plus',
    description: 'Read the Everyday Care Plus privacy policy and how personal information is handled when you contact us.',
    h1: 'Privacy Policy',
    intro: 'This page explains how Everyday Care Plus handles personal information. Please contact us if you have questions about your data.',
    sections: [['Your privacy', 'We aim to collect and use personal information responsibly and only as necessary for legitimate business and care-enquiry purposes.']],
  },
  {
    path: '/cookies',
    title: 'Cookie Policy | Everyday Care Plus',
    description: 'Read the Everyday Care Plus cookie policy and learn how cookies are used on this website.',
    h1: 'Cookie Policy',
    intro: 'This page explains how cookies and similar technologies may be used on the Everyday Care Plus website.',
    sections: [['Managing cookies', 'You can control cookies through your browser settings. Some website features may depend on certain cookies being available.']],
  },
  {
    path: '/terms',
    title: 'Terms of Service | Everyday Care Plus',
    description: 'Read the Everyday Care Plus website terms of service.',
    h1: 'Terms of Service',
    intro: 'These terms explain the conditions that apply to use of the Everyday Care Plus website.',
    sections: [['Using this website', 'Website information is provided for general information and should not replace professional, legal, financial, or medical advice.']],
  },
  {
    path: '/complaints',
    title: 'Complaints Policy | Everyday Care Plus',
    description: 'Read the Everyday Care Plus complaints policy and how to raise a concern about our service.',
    h1: 'Complaints Policy',
    intro: 'We take concerns seriously and aim to deal with them respectfully, fairly, and in line with our published complaints process.',
    sections: [['Raising a concern', 'Please contact us directly so we can explain the appropriate next step and respond to your concern.']],
  },
  {
    path: '/accessibility',
    title: 'Accessibility Statement | Everyday Care Plus',
    description: 'Read the Everyday Care Plus accessibility statement for this website.',
    h1: 'Accessibility Statement',
    intro: 'We aim to make this website as accessible and usable as possible for a wide range of visitors.',
    sections: [['Accessibility feedback', 'If you experience a barrier when using this website, please contact us and explain what you were trying to do.']],
  },
]

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

const absoluteUrl = (pathname) => pathname === '/' ? `${canonicalHost}/` : `${canonicalHost}${pathname}/`

function navigation() {
  return `
    <nav aria-label="Primary navigation">
      <a href="/">Home</a>
      <a href="/services">Services</a>
      <a href="/about">About</a>
      <a href="/blog">Guides</a>
      <a href="/faq">FAQs</a>
      <a href="/contact">Contact</a>
      <a href="/book">Book a free assessment</a>
    </nav>`
}

function fallbackContent(route) {
  const sections = route.sections.map(([heading, body]) => `
    <section>
      <h2>${escapeHtml(heading)}</h2>
      <p>${escapeHtml(body)}</p>
    </section>`).join('')

  return `
    <main id="pre-rendered-content">
      <header>
        <p><a href="/">Everyday Care Plus</a></p>
        ${navigation()}
      </header>
      <article>
        <h1>${escapeHtml(route.h1)}</h1>
        <p>${escapeHtml(route.intro)}</p>
        ${sections}
        <section>
          <h2>Talk to Everyday Care Plus</h2>
          <p>Call <a href="tel:+447563011244">07563 011 244</a>, email <a href="mailto:greg@every-day-care.com">greg@every-day-care.com</a>, or <a href="/book">book a free consultation</a>.</p>
        </section>
      </article>
      <footer>
        <p>Everyday Care Plus Ltd · Based in Tipton, West Midlands</p>
        <p><a href="/privacy">Privacy</a> · <a href="/cookies">Cookies</a> · <a href="/terms">Terms</a> · <a href="/complaints">Complaints</a> · <a href="/accessibility">Accessibility</a></p>
      </footer>
    </main>`
}

function localBusinessSchema() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: 'Person-centred home care for adults and families across Sandwell and Dudley.',
    url: business.url,
    image: `${canonicalHost}/images/og-image.jpg`,
    telephone: business.telephone,
    email: business.email,
    address: business.address,
    areaServed: business.areaServed,
    sameAs: [
      'https://www.facebook.com/everydaycareplus',
      'https://www.linkedin.com/in/grzegorz-rusinek-93362a336/',
      'https://www.instagram.com/care.everyday/',
    ],
  }).replaceAll('</', '<\\/')
}

function pageHtml(route) {
  const url = absoluteUrl(route.path)
  const title = escapeHtml(route.title)
  const description = escapeHtml(route.description)
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <meta name="robots" content="index,follow" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${url}" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Everyday Care Plus" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${canonicalHost}/images/og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${canonicalHost}/images/og-image.jpg" />
    <meta name="theme-color" content="#0f2041" />
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WT4LLV7R');</script>
    <script type="application/ld+json">${localBusinessSchema()}</script>
    <script type="module" crossorigin src="/assets/index-bsoarxm1.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-lwumdtbf.css" />
  </head>
  <body>
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WT4LLV7R" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <div id="root">${fallbackContent(route)}</div>
  </body>
</html>
`
}

function notFoundHtml() {
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex,follow" />
    <title>Page Not Found | Everyday Care Plus</title>
    <meta name="description" content="The page you requested could not be found. Visit Everyday Care Plus home care services or contact us for support." />
    <link rel="canonical" href="${canonicalHost}/404" />
    <link rel="stylesheet" crossorigin href="/assets/index-lwumdtbf.css" />
  </head>
  <body>
    <main>
      <h1>Page not found</h1>
      <p>The page you requested does not exist or may have moved.</p>
      <p><a href="/">Return home</a>, <a href="/services">view services</a>, <a href="/contact">contact us</a>, or call <a href="tel:+447563011244">07563 011 244</a>.</p>
    </main>
  </body>
</html>
`
}

async function writeRoute(route) {
  const directory = route.path === '/' ? dist : path.join(dist, route.path.slice(1))
  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, 'index.html'), pageHtml(route), 'utf8')
}

async function build() {
  await rm(dist, { recursive: true, force: true })
  await mkdir(dist, { recursive: true })

  for (const directory of ['assets', 'images']) {
    await cp(path.join(root, directory), path.join(dist, directory), { recursive: true })
  }
  for (const file of ['favicon.png', 'apple-touch-icon.png']) {
    await cp(path.join(root, file), path.join(dist, file))
  }

  await Promise.all(routes.map(writeRoute))
  await writeFile(path.join(dist, '404.html'), notFoundHtml(), 'utf8')
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${canonicalHost}/sitemap.xml\n`, 'utf8')
  const urls = routes.map((route) => `  <url><loc>${absoluteUrl(route.path)}</loc></url>`).join('\n')
  await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, 'utf8')
  await writeFile(path.join(dist, '_redirects'), '# No SPA catch-all: unknown paths must return the real 404.html response.\n', 'utf8')
  await writeFile(path.join(dist, 'build-manifest.json'), JSON.stringify({ routes: routes.map(({ path: pathname, title }) => ({ path: pathname, title })), generatedAt: new Date().toISOString() }, null, 2), 'utf8')
  console.log(`Built ${routes.length} pre-rendered routes in ${dist}`)
}

build().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
