// Reusable loading spinner.
// Use <Spinner /> inside a component, or <Spinner fullScreen /> for full page loading.

export default function Spinner({ fullScreen = false }) {
  const spinner = (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600" />
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return <div className="py-12">{spinner}</div>
}