import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLandingPage } from "../contexts/LandingPageContext";
import { Button } from "@/components/ui/button";
import { createOrderServer } from "@/features/orders/actions/server/createOrderServer";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  IconUser,
  IconPhone,
  IconMapPin,
  IconShoppingBag,
  IconAlertCircle,
  IconCircleCheck,
} from "@tabler/icons-react";
import { Field, FieldGroup } from "@/components/ui/field";

export default function CustomerInformation() {
  const {
    landingPage,
    customerDetails,
    setCustomerDetails,
    cartItems,
    setIsOrderSuccessModalOpen,
    setOrderDetails,
  } = useLandingPage();

  const isFormValid =
    customerDetails.name &&
    customerDetails.mobileNumber &&
    customerDetails.address;
  const isCartEmpty = cartItems.length === 0;
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.product.sellPrice,
    0,
  );

  async function handleCheckOut() {
    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isCartEmpty) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const order = await createOrderServer({
        data: {
          customer: customerDetails,
          orderItems: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          orderStatus: "pending",
          totalPrice,
          shippingCharge: 150,
          landingPageId: landingPage.id,
        },
      });

      if (order) {
        setOrderDetails({
          cartItems,
          customerDetails,
          totalAmount: totalPrice + 150,
        });
        toast.success("Order placed successfully");``
        setIsOrderSuccessModalOpen(true);
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to place order",
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconUser className="h-5 w-5" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isCartEmpty && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-orange-200">
            <IconAlertCircle className="h-4 w-4 text-orange-600" />
            <p className="text-sm text-orange-600">
              Your cart is empty. Add items to proceed.
            </p>
          </div>
        )}

        <FieldGroup>
          <Field>
            <Label htmlFor="customer-name" className="flex items-center gap-2">
              <IconUser className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="customer-name"
              placeholder="Enter your full name"
              value={customerDetails.name}
              onChange={(e) =>
                setCustomerDetails({ ...customerDetails, name: e.target.value })
              }
            />
          </Field>

          <Field>
            <Label
              htmlFor="customer-mobile-number"
              className="flex items-center gap-2"
            >
              <IconPhone className="h-4 w-4" />
              Mobile Number
            </Label>
            <Input
              id="customer-mobile-number"
              placeholder="Enter your mobile number"
              value={customerDetails.mobileNumber}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  mobileNumber: e.target.value,
                })
              }
            />
          </Field>

          <Field>
            <Label
              htmlFor="customer-address"
              className="flex items-center gap-2"
            >
              <IconMapPin className="h-4 w-4" />
              Delivery Address
            </Label>
            <Textarea
              id="customer-address"
              placeholder="Enter your complete delivery address"
              rows={3}
              value={customerDetails.address}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  address: e.target.value,
                })
              }
            />
          </Field>
        </FieldGroup>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            {isFormValid ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <IconCircleCheck className="h-4 w-4" />
                <span>All fields completed</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <IconAlertCircle className="h-4 w-4" />
                <span>Please complete all required fields</span>
              </div>
            )}
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleCheckOut}
            disabled={!isFormValid || isCartEmpty}
          >
            <IconShoppingBag className="h-4 w-4 mr-2" />
            Place Order • ৳{totalPrice + 150}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
