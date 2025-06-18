import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/search-bar"
import NotificationDropdown from "@/components/notification-dropdown"
import { Quicksand } from "next/font/google"

const quicksand = Quicksand({ subsets: ["latin"] })

export default function Header({ showSearch = true }) {
  return (
    <header className="sticky top-0 z-40 border-b border-muted bg-gradient-periwinkle shadow-periwinkle-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/murmur-logo.png"
            alt="Murmur Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
            priority
          />
          <span className={`${quicksand.className} text-xl font-bold tracking-tight text-black`}>murmur</span>
        </Link>

        {showSearch && (
          <div className="flex-1 mx-4">
            <SearchBar />
          </div>
        )}

        <div className="flex items-center space-x-4">
          <NotificationDropdown />
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/30">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                AM
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
