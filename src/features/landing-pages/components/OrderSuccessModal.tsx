import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Package, User } from "lucide-react";
import { useLandingPage } from "../contexts/LandingPageContext";

export default function OrderSuccessModal() {
  const {
    isOrderSuccessModalOpen,
    setIsOrderSuccessModalOpen,
    orderDetails,
    clearCart,
    setCustomerDetails,
  } = useLandingPage();

  const handleClose = () => {
    setIsOrderSuccessModalOpen(false);
    clearCart();
    setCustomerDetails({
      name: "",
      mobileNumber: "",
      address: "",
    });
  };

  if (!orderDetails) return null;

  return (
    <Dialog open={isOrderSuccessModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-col items-center text-center space-y-2">
          <div className="rounded-full bg-green-100 p-3 mb-2">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Order Placed Successfully!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Thank you for your purchase. We have received your order and will
            process it shortly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
              <Package className="h-4 w-4" />
              <span>Order Summary</span>
            </div>
            <div className="space-y-3">
              {orderDetails.cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between items-start text-sm"
                >
                  <div className="flex gap-2">
                    <span className="font-medium text-gray-700">
                      {item.quantity}x
                    </span>
                    <span className="text-gray-600 line-clamp-1">
                      {item.product.name}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 whitespace-nowrap">
                    ৳ {item.product.sellPrice * item.quantity}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between items-center font-bold text-gray-900">
                <span>Total Amount</span>
                <span>৳ {orderDetails.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
              <User className="h-4 w-4" />
              <span>Shipping Details</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-2 text-sm text-gray-600">
              <span className="font-medium text-gray-700">Name:</span>
              <span>{orderDetails.customerDetails.name}</span>

              <span className="font-medium text-gray-700">Phone:</span>
              <span>{orderDetails.customerDetails.mobileNumber}</span>

              <span className="font-medium text-gray-700">Address:</span>
              <span>{orderDetails.customerDetails.address}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} className="w-full" size="lg">
            Continue Shopping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
