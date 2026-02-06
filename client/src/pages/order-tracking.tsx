import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  ChefHat,
  Truck,
  Package,
  ArrowLeft,
  Clock,
} from "lucide-react";
import type { Order, OrderStatus } from "@shared/schema";

const statusSteps: { status: OrderStatus; label: string; icon: typeof CheckCircle2 }[] = [
  { status: "Order Received", label: "Order Received", icon: Package },
  { status: "Preparing", label: "Preparing", icon: ChefHat },
  { status: "Out for Delivery", label: "Out for Delivery", icon: Truck },
  { status: "Delivered", label: "Delivered", icon: CheckCircle2 },
];

function getStepIndex(status: OrderStatus): number {
  return statusSteps.findIndex((s) => s.status === status);
}

export default function OrderTrackingPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ["/api/orders", params.id],
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full rounded-md mb-6" />
          <Skeleton className="h-48 w-full rounded-md" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <Package className="h-20 w-20 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order not found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find this order. Please check the order ID and try again.
          </p>
          <Button onClick={() => setLocation("/")} data-testid="button-go-home">
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  const currentStepIndex = getStepIndex(order.status);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
          data-testid="button-back-menu"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>

        <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-order-title">
            Order Tracking
          </h1>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Clock className="h-4 w-4" />
            <span data-testid="text-order-date">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
              <p className="text-sm text-muted-foreground">
                Order ID: <span className="font-mono text-foreground" data-testid="text-order-id">{order._id}</span>
              </p>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-primary/10 text-primary"
                }`}
                data-testid="text-order-status"
              >
                {order.status === "Delivered" ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                )}
                {order.status}
              </span>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.status}
                      className="flex flex-col items-center relative z-10"
                      data-testid={`step-${step.status.replace(/\s+/g, "-").toLowerCase()}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`text-xs mt-2 text-center max-w-[80px] ${
                          isCompleted
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0 mx-8">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-in-out"
                  style={{
                    width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2"
                    data-testid={`order-item-${index}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        x{item.quantity} @ ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold whitespace-nowrap">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary" data-testid="text-order-total">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Name</p>
                  <p className="text-sm font-medium" data-testid="text-delivery-name">
                    {order.deliveryDetails.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Address</p>
                  <p className="text-sm font-medium" data-testid="text-delivery-address">
                    {order.deliveryDetails.address}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-medium" data-testid="text-delivery-phone">
                    {order.deliveryDetails.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
