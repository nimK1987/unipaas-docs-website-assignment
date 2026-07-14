'use client'

import Link from 'next/link'
import { FullSearchTrigger } from 'fumadocs-ui/layouts/shared/slots/search-trigger'

export function DocsHome() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl">
          {homeContent.title}
        </h1>

        <FullSearchTrigger className="w-full" />

        <p className="mt-6 text-sm text-fd-muted-foreground">
          {homeContent.firstTimePrompt}{' '}
          <Link
            href={homeContent.quickstartHref}
            className="font-medium text-fd-primary underline underline-offset-4"
          >
            {homeContent.quickstartLabel}
          </Link>
        </p>
      </div>
    </div>
  )
}

const homeContent = {
  title: 'What do you want to do today?',
  firstTimePrompt: 'Is this your first time here?',
  quickstartLabel: 'Go to our Quickstart page to get started',
  quickstartHref: '/docs/getting-started/quickstart',
}
