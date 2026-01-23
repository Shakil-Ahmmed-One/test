import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { LandingPageContextType, useLandingPage } from "../contexts/LandingPageContext";
import { Image } from "@unpic/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconMinus, IconPlus, IconShoppingCart } from "@tabler/icons-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ButtonGroup } from "@/components/ui/button-group";

export default function ProductsCarousel() {
  const { landingPage } = useLandingPage();
  const landingPageProducts = landingPage.landingPageProducts;

  return (
    <section className="container mx-auto py-8">
      <Carousel>
        <CarouselContent>
          {landingPageProducts.map((landingPageProduct) => (
            <CarouselItem
              key={landingPageProduct.id}
              className="md:basis-1/2 lg:basis-1/1"
            >
              <ProductCard landingPageProduct={landingPageProduct} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </section>
  );
}

function ProductCard({
  landingPageProduct,
}: {
  landingPageProduct: LandingPageContextType["landingPage"]["landingPageProducts"][number];
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 99));
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));
  const { addToCart } = useLandingPage();

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <Image
                className="w-full h-full object-cover"
                src={landingPageProduct.product.images[activeImageIndex]}
                alt={landingPageProduct.product.name}
                layout="fullWidth"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {landingPageProduct.product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`shrink-0 rounded-md border-2 transition-all ${
                    index === activeImageIndex
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-primary/50"
                  }`}
                >
                  <Image
                    className="rounded-md"
                    src={image}
                    alt={`${landingPageProduct.product.name} - Image ${index + 1}`}
                    width={60}
                    height={60}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                {landingPageProduct.product.name}
              </h1>
              <div className="prose prose-gray max-w-none">
                <p className="text-base leading-relaxed text-muted-foreground">
                  {landingPageProduct.description}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-medium">Unit Price</h4>
                <p className="text-muted-foreground">
                  ৳{landingPageProduct.product.sellPrice}
                </p>
              </div>
              <div>
                <h4 className="text-xl font-medium">Total Price</h4>
                <p className="text-muted-foreground">
                  ৳{landingPageProduct.product.sellPrice * quantity}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <ButtonGroup>
                  <Button
                    size="icon-lg"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <IconMinus />
                  </Button>
                  <Input
                    className="text-center h-auto"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.valueAsNumber)}
                    min={1}
                    max={99}
                  />
                  <Button size="icon-lg" onClick={incrementQuantity}>
                    <IconPlus />
                  </Button>
                </ButtonGroup>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    addToCart(landingPageProduct.product, quantity);
                    setQuantity(1);
                  }}
                >
                  <IconShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Product Details & FAQs</h3>
              <Accordion type="multiple" className="border rounded-lg">
                {landingPageProduct.faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`faq-${index}`}
                    className="border-b last:border-b-0"
                  >
                    <AccordionTrigger className="px-4 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
                {landingPageProduct.faqs.length === 0 && (
                  <div className="px-4 py-3 text-center text-sm text-muted-foreground">
                    No additional information available
                  </div>
                )}
              </Accordion>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
