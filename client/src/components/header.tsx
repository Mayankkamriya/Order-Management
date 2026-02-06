import { CartSheet } from "./cart-sheet";
import { UtensilsCrossed } from "lucide-react";
import { Link } from "wouter";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 h-14">
        <Link href="/" className="flex items-center gap-2" data-testid="link-home">
          <div className="bg-primary rounded-md p-1.5">
            <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">FoodDash</span>
        </Link>
        <CartSheet />
      </div>
    </header>
  );
}
