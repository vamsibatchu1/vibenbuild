'use client'

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 md:px-6 md:py-6">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-semibold">Vibe and Build</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            52 Projects in 2026
          </div>
        </nav>
      </div>
    </header>
  )
}

