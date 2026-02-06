import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useLocation } from "wouter";
import { useState } from "react";

export function CartSheet() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative" data-testid="button-cart">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs" data-testid="badge-cart-count">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart ({totalItems} items)</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground font-medium">Your cart is empty</p>
            <p className="text-muted-foreground text-sm mt-1">
              Add some items from the menu to get started
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {items.map((cartItem) => (
                <div
                  key={cartItem.menuItem._id}
                  className="flex gap-3 p-3 bg-card rounded-md border border-card-border"
                  data-testid={`cart-item-${cartItem.menuItem._id}`}
                >
                  <img
                    src={cartItem.menuItem.image}
                    alt={cartItem.menuItem.name}
                    className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{cartItem.menuItem.name}</h4>
                    <p className="text-primary font-semibold text-sm mt-0.5">
                      ₹{(cartItem.menuItem.price * cartItem.quantity).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(cartItem.menuItem._id, cartItem.quantity - 1)
                        }
                        data-testid={`button-cart-decrease-${cartItem.menuItem._id}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">
                        {cartItem.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(cartItem.menuItem._id, cartItem.quantity + 1)
                        }
                        data-testid={`button-cart-increase-${cartItem.menuItem._id}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 ml-auto text-destructive"
                        onClick={() => removeItem(cartItem.menuItem._id)}
                        data-testid={`button-cart-remove-${cartItem.menuItem._id}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-4">
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold text-lg" data-testid="text-cart-total">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
              <SheetFooter className="mt-0">
                <Button
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    setLocation("/checkout");
                  }}
                  data-testid="button-checkout"
                >
                  Proceed to Checkout
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
