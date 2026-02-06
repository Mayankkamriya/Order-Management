import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import type { MenuItem } from "@shared/schema";
import { useCart } from "@/lib/cart-context";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.menuItem._id === item._id);
  const quantity = cartItem?.quantity || 0;

  return (
    <Card className="overflow-visible group" data-testid={`card-menu-item-${item._id}`}>
      <div className="relative overflow-hidden rounded-t-md">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`img-menu-item-${item._id}`}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-md">
            {item.category}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-base" data-testid={`text-item-name-${item._id}`}>
            {item.name}
          </h3>
          <span className="text-primary font-bold text-base whitespace-nowrap" data-testid={`text-item-price-${item._id}`}>
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2" data-testid={`text-item-desc-${item._id}`}>
          {item.description}
        </p>
        <div className="flex items-center justify-end gap-2">
          {quantity > 0 ? (
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateQuantity(item._id, quantity - 1)}
                data-testid={`button-decrease-${item._id}`}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-semibold" data-testid={`text-quantity-${item._id}`}>
                {quantity}
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateQuantity(item._id, quantity + 1)}
                data-testid={`button-increase-${item._id}`}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => addItem(item)}
              data-testid={`button-add-${item._id}`}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
