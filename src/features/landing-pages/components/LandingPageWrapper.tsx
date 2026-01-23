import CustomerInformation from "./CustomerInformation";
import LandingPageCart from "./LandingPageCart";
import OrderSummary from "./OrderSummary";
import OrderSuccessModal from "./OrderSuccessModal";
import ProductsCarousel from "./ProductsCarousel";

export default function LandingPageWrapper() {
  return (
    <main className="p-4 space-y-6">
      <ProductsCarousel />
      <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <LandingPageCart />
          <CustomerInformation />
        </div>
        <OrderSummary />
      </section>
      <OrderSuccessModal />
    </main>
  );
}
