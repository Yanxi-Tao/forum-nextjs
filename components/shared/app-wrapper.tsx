export default function AppWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main id="app" className="flex h-screen overflow-auto pt-12">
      {children}
    </main>
  )
}
