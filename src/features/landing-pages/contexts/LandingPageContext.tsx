import { TCustomerDetailsInOrder } from "@/features/orders/types/orderTypes";
import {
  LandingPageGetPayload,
  OrderItemModel,
  ProductModel,
} from "@/generated/prisma/models";
import { createContext, useContext, useState } from "react";
import { LandingPageProductFaqsType } from "../types/landingPageTypes";

type LandingPageProductWithTypedFaqs = Omit<
  LandingPageGetPayload<{
    include: {
      landingPageProducts: {
        include: {
          product: true;
        };
      };
    };
  }>["landingPageProducts"][number],
  "faqs"
> & {
  faqs: LandingPageProductFaqsType;
};

type LandingPage = Omit<
  LandingPageGetPayload<{
    include: {
      landingPageProducts: {
        include: {
          product: true;
        };
      };
    };
  }>,
  "landingPageProducts"
> & {
  landingPageProducts: LandingPageProductWithTypedFaqs[];
};

export type CartItem = {
  // productId: OrderItemModel["productId"];
  product: ProductModel;
  quantity: OrderItemModel["quantity"];
};

type CustomerDetails = {
  name: TCustomerDetailsInOrder["name"];
  mobileNumber: TCustomerDetailsInOrder["mobileNumber"];
  address: TCustomerDetailsInOrder["address"];
};

type OrderDetails = {
  cartItems: CartItem[];
  customerDetails: CustomerDetails;
  totalAmount: number;
};

export type LandingPageContextType = {
  landingPage: LandingPage;

  // Cart Itens
  cartItems: CartItem[];
  addToCart: (
    product: CartItem["product"],
    quantity: CartItem["quantity"],
  ) => void;
  removeFromCart: (productId: CartItem["product"]["id"]) => void;
  incrementCartItemQuantity: (productId: CartItem["product"]["id"]) => void;
  decrementCartItemQuantity: (productId: CartItem["product"]["id"]) => void;
  updateCartItemQuantity: (
    productId: CartItem["product"]["id"],
    quantity: CartItem["quantity"],
  ) => void;
  clearCart: () => void;

  // Customer Information
  customerDetails: CustomerDetails;
  setCustomerDetails: (customerDetails: CustomerDetails) => void;

  // Order Success Modal
  isOrderSuccessModalOpen: boolean;
  setIsOrderSuccessModalOpen: (isOpen: boolean) => void;
  orderDetails: OrderDetails | null;
  setOrderDetails: (orderDetails: OrderDetails | null) => void;
};

export const LandingPageContext = createContext<LandingPageContextType | null>(
  null,
);

export const LandingPageProvider = ({
  children,
  landingPage,
}: {
  children: React.ReactNode;
  landingPage: LandingPage;
}) => {
  // Cart Itens
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const addToCart = (
    product: CartItem["product"],
    quantity: CartItem["quantity"],
  ) => {
    setCartItems((prev) => [...prev, { product, quantity }]);
  };
  const removeFromCart = (productId: CartItem["product"]["id"]) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
  };
  const incrementCartItemQuantity = (productId: CartItem["product"]["id"]) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };
  const decrementCartItemQuantity = (productId: CartItem["product"]["id"]) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };
  const updateCartItemQuantity = (
    productId: CartItem["product"]["id"],
    quantity: CartItem["quantity"],
  ) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };
  const clearCart = () => {
    setCartItems([]);
  };

  // Customer Information
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    mobileNumber: "",
    address: "",
  });

  // Order Success Modal
  const [isOrderSuccessModalOpen, setIsOrderSuccessModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  return (
    <LandingPageContext.Provider
      value={{
        landingPage,
        cartItems,
        addToCart,
        removeFromCart,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
        updateCartItemQuantity,
        clearCart,
        customerDetails,
        setCustomerDetails,
        isOrderSuccessModalOpen,
        setIsOrderSuccessModalOpen,
        orderDetails,
        setOrderDetails,
      }}
    >
      {children}
    </LandingPageContext.Provider>
  );
};

export const useLandingPage = () => {
  const context = useContext(LandingPageContext);
  if (!context) {
    throw new Error("useLandingPage must be used within a LandingPageProvider");
  }
  return context;
};
