export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-transparent dark:from-black dark:via-transparent lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://www.mountainlabs.eu"
            target="_blank"
            rel="noopener noreferrer"
          >
            By MountainLabs UG
          </a>
        </div>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-transparent dark:from-black dark:via-transparent lg:static lg:h-auto lg:w-auto lg:bg-none">
          Built with Next.js, NestJS, and Tauri
        </div>
      </div>

      <div className="relative flex place-items-center before:inset-0 before:-z-10 before:blur-3xl">
        <div className="relative left-[-50px] top-[-100px] w-[500px]">
          <div className="text-6xl font-bold text-primary-500">
            PlatePulse
          </div>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Nutrition that moves with you 🌱
          </p>
          <div className="mt-8 space-y-2">
            <div className="text-lg">
              Flexible diet profiles with combinations
            </div>
            <div className="text-lg">
              Infinite meal generation
            </div>
            <div className="text-lg">
              Comprehensive calorie tracking
            </div>
            <div className="text-lg">
              Multiple export formats
            </div>
          </div>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left gap-8">
        <div
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Diet Profiles{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create and combine diet profiles for personalized meal planning
          </p>
        </div>

        <div
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Meal Plans{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Generate unlimited meal plans with AI-powered suggestions
          </p>
        </div>

        <div
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Tracking{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track calories, macros, and progress with visual dashboards
          </p>
        </div>

        <div
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Export & Share{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Export to PDF, JSON, CSV or share with family and friends
          </p>
        </div>
      </div>
    </main>
  )
}
