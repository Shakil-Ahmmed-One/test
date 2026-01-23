import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItem, useLandingPage } from "../contexts/LandingPageContext";
import { Separator } from "@/components/ui/separator";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  IconPackage,
  IconUser,
  IconPhone,
  IconMapPin,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

export default function OrderSummary() {
  const { cartItems, customerDetails } = useLandingPage();
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.product.sellPrice,
    0,
  );
  const shipping = 150;
  const total = subtotal + shipping;

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {cartItems.length === 0 ? (
            <Empty className="border rounded-lg p-8">
              <EmptyHeader>
                <EmptyMedia>
                  <IconPackage className="h-12 w-12 text-muted-foreground" />
                </EmptyMedia>
              </EmptyHeader>
              <EmptyContent>
                <EmptyTitle className="text-lg">No Items Added</EmptyTitle>
                <EmptyDescription>
                  Add items to your cart to view order summary.
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-muted-foreground">
                Order Items{" "}
                {cartItems.length > 0 && (
                  <Badge variant="secondary">{cartItems.length} item(s)</Badge>
                )}
              </h3>
              {cartItems.map((item) => (
                <OrderSummaryItem key={item.product.id} cartItem={item} />
              ))}
            </div>
          )}

          <Separator />

          {customerDetails && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Customer Information
              </h3>
              <div className="space-y-2 rounded-lg bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-sm">
                  <IconUser className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {customerDetails.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IconPhone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {customerDetails.mobileNumber || "N/A"}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <IconMapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="font-medium">
                    {customerDetails.address || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">৳{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">৳{shipping}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">৳{total}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function OrderSummaryItem({ cartItem }: { cartItem: CartItem }) {
  const { landingPage } = useLandingPage();
  const landingPageProduct = landingPage.landingPageProducts.find(
    (item) => item.product.id === cartItem.product.id,
  );
  if (!landingPageProduct) return null;

  const itemTotal = cartItem.quantity * landingPageProduct.product.sellPrice;

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex-1">
        <div className="font-medium text-sm">
          {landingPageProduct.product.name}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <Badge variant="outline" className="text-xs px-1.5 py-0">
            {cartItem.quantity}x
          </Badge>
          <span>৳{landingPageProduct.product.sellPrice} each</span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold">৳{itemTotal}</div>
      </div>
    </div>
  );
}
