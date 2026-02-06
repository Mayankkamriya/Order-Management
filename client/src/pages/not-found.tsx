import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground text-sm mb-6">
            The page you're looking for doesn't exist.
          </p>
          <Button onClick={() => setLocation("/")} data-testid="button-go-home">
            Go to Menu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
