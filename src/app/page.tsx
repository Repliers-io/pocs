export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Repliers POCs
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          A collection of proof of concepts and experimental projects
        </p>

        <div className="space-y-4">
          <a
            href="https://repliers.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Visit Repliers.com
          </a>
        </div>
      </main>
    </div>
  );
}
