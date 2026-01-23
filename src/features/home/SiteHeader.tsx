import { Link } from "@tanstack/react-router"

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center gap-4">
        <Link to="/" className="text-2xl font-bold">
          Grahok
        </Link>
      </div>
    </header>
  )
}