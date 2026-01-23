import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLandingPage } from "../contexts/LandingPageContext";
import type { CartItem } from "../contexts/LandingPageContext";
import { Image } from "@unpic/react";
import { Button } from "@/components/ui/button";
import {
  IconMinus,
  IconPackage,
  IconPlus,
  IconTrash,
  IconShoppingBag,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";

export default function LandingPageCart() {
  const { cartItems } = useLandingPage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconShoppingBag className="h-5 w-5" />
          Shopping Cart
          {cartItems.length > 0 && (
            <Badge variant="secondary">{cartItems.length} item(s)</Badge>
          )}
        </CardTitle>
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
              <EmptyTitle className="text-lg">Your Cart is Empty</EmptyTitle>
              <EmptyDescription>
                Add items to your cart to show here.
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.product.id} cartItem={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CartItem({ cartItem }: { cartItem: CartItem }) {
  const {
    landingPage,
    incrementCartItemQuantity,
    decrementCartItemQuantity,
    updateCartItemQuantity,
    removeFromCart,
  } = useLandingPage();
  const landingPageProduct = landingPage.landingPageProducts.find(
    (item) => item.product.id === cartItem.product.id,
  );
  if (!landingPageProduct) return null;

  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <div className="shrink-0">
        <Image
          className="rounded-lg object-cover"
          src={landingPageProduct.product.images[0]}
          alt={landingPageProduct.product.name}
          width={100}
          height={100}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold truncate">
            {landingPageProduct.product.name}
          </h3>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => removeFromCart(cartItem.product.id)}
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-between items-end space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              ৳{landingPageProduct.product.sellPrice}
            </Badge>
            <span className="text-sm text-muted-foreground">each</span>
          </div>

          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => decrementCartItemQuantity(cartItem.product.id)}
              disabled={cartItem.quantity <= 1}
              className="h-8 w-8 rounded-r-none"
            >
              <IconMinus className="h-3 w-3" />
            </Button>
            <Input
              className="w-16 border-x-0 rounded-none text-center text-sm"
              type="number"
              value={cartItem.quantity}
              min={1}
              onChange={(e) =>
                updateCartItemQuantity(
                  cartItem.product.id,
                  Math.max(1, e.target.valueAsNumber),
                )
              }
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => incrementCartItemQuantity(cartItem.product.id)}
              className="h-8 w-8 rounded-l-none"
            >
              <IconPlus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
