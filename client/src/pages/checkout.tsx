import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { deliveryDetailsSchema, type DeliveryDetails } from "@shared/schema";
import { useCart } from "@/lib/cart-context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, MapPin, Phone, User, ShoppingBag, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<DeliveryDetails>({
    resolver: zodResolver(deliveryDetailsSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (details: DeliveryDetails) => {
      const orderData = {
        items: items.map((i) => ({
          menuItemId: i.menuItem._id,
          name: i.menuItem.name,
          price: i.menuItem.price,
          quantity: i.quantity,
        })),
        deliveryDetails: details,
        total: totalPrice,
      };
      const res = await apiRequest("POST", "/api/orders", orderData);
      return res.json();
    },
    onSuccess: (data) => {
      clearCart();
      toast({
        title: "Order placed!",
        description: "Your order has been placed successfully.",
      });
      setLocation(`/order/${data._id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to place order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some items from the menu before checking out
          </p>
          <Button onClick={() => setLocation("/")} data-testid="button-back-to-menu">
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = (data: DeliveryDetails) => {
    placeOrderMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>

        <h1 className="text-2xl font-bold mb-6" data-testid="text-checkout-title">
          Checkout
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Delivery Details
                </h2>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="John Doe"
                                className="pl-9"
                                {...field}
                                data-testid="input-name"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="123 Main Street, Apt 4B"
                                className="pl-9"
                                {...field}
                                data-testid="input-address"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="(555) 123-4567"
                                className="pl-9"
                                {...field}
                                data-testid="input-phone"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full mt-6"
                      disabled={placeOrderMutation.isPending}
                      data-testid="button-place-order"
                    >
                      {placeOrderMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        `Place Order - ₹${totalPrice.toFixed(2)}`
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  {items.map((cartItem) => (
                    <div
                      key={cartItem.menuItem._id}
                      className="flex items-center gap-3"
                      data-testid={`checkout-item-${cartItem.menuItem._id}`}
                    >
                      <img
                        src={cartItem.menuItem.image}
                        alt={cartItem.menuItem.name}
                        className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {cartItem.menuItem.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          x{cartItem.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold whitespace-nowrap">
                        ₹{(cartItem.menuItem.price * cartItem.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="text-green-600 dark:text-green-400">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary" data-testid="text-checkout-total">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
