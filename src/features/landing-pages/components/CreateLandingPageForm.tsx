import { useForm, useStore } from "@tanstack/react-form";
import {
  createOrEditLandingPageSchema,
  CreateOrEditLandingPageType,
} from "../types/landingPageTypes";
import { createLandingPageServer } from "../actions/server/createLandingPageServer";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AddProductsInOrderFormCombobox } from "@/features/orders/components/AddProductsInOrderFormCombobox";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getProductsServer } from "@/features/products/actions/server/getProductsServer";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import { ActionButton } from "@/components/ui/action-button";

export default function CreateLandingPageForm() {
  const { data: products } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: getProductsServer,
  });
  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      landingPageProducts: [],
    } as CreateOrEditLandingPageType,
    validators: {
      onSubmit: createOrEditLandingPageSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createLandingPageServer({
          data: value,
        });
        toast.success("Landing Page Created Successfully");
        form.reset();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to create landing page"
        );
      }
    },
  });

  const addedProducts = useStore(form.store, (state) => state.values.landingPageProducts);

  const unAddedProducts = products.filter(
    (product) => !addedProducts.some((item) => item.productId === product.id)
  );
  return (
    <form
      id="create-landing-page-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Landing Page Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Amon Full Fiber"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="slug"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="amon-full-fiber"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="landingPageProducts"
          mode="array"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldGroup data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Products</FieldLabel>
                <AddProductsInOrderFormCombobox
                  items={unAddedProducts}
                  onSelect={(productId) => {
                    field.pushValue({
                      productId,
                      description: "",
                      faqs: [],
                    });
                  }}
                />
                {field.state.value.map((_, index) => (
                  <form.Field
                    key={index}
                    name={`landingPageProducts[${index}]`}
                    children={(subField) => {
                      const isInvalidSub =
                        subField.state.meta.isTouched &&
                        !subField.state.meta.isValid;

                      return (
                        <FieldGroup className="border rounded p-2">
                          <form.Subscribe
                            selector={(state) =>
                              state.values.landingPageProducts[index].productId
                            }
                            children={(productId) => {
                              const product = products.find(
                                (item) => item.id === productId
                              );
                              return (
                                <div className="flex items-center gap-3 justify-between">
                                  <FieldLabel className="text-2xl font-semibold">
                                    {`${index + 1}. ${product?.name}`}
                                  </FieldLabel>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => field.removeValue(index)}
                                  >
                                    <IconTrash />
                                  </Button>
                                </div>
                              );
                            }}
                          />
                          <form.Field
                            name={`landingPageProducts[${index}].description`}
                            children={(productDescriptionField) => {
                              const isInvalidProductDescription =
                                productDescriptionField.state.meta.isTouched &&
                                !productDescriptionField.state.meta.isValid;

                              return (
                                <Field>
                                  <FieldLabel
                                    htmlFor={productDescriptionField.name}
                                  >
                                    Product Description
                                  </FieldLabel>
                                  <Textarea
                                    className="max-h-36"
                                    id={productDescriptionField.name}
                                    name={productDescriptionField.name}
                                    value={productDescriptionField.state.value}
                                    onBlur={productDescriptionField.handleBlur}
                                    onChange={(e) =>
                                      productDescriptionField.handleChange(
                                        e.target.value
                                      )
                                    }
                                    aria-invalid={isInvalidProductDescription}
                                  />
                                  {isInvalidProductDescription && (
                                    <FieldError
                                      errors={
                                        productDescriptionField.state.meta
                                          .errors
                                      }
                                    />
                                  )}
                                </Field>
                              );
                            }}
                          />
                          <form.Field
                            name={`landingPageProducts[${index}].faqs`}
                            mode="array"
                            children={(productFaqsField) => {
                              const isInvalidProductFaqs =
                                productFaqsField.state.meta.isTouched &&
                                !productFaqsField.state.meta.isValid;

                              return (
                                <Field data-invalid={isInvalidProductFaqs}>
                                  <div className="flex items-center gap-3 justify-between">
                                    <FieldLabel
                                      className="text-xl font-medium"
                                      htmlFor={productFaqsField.name}
                                    >
                                      Product Faqs
                                    </FieldLabel>
                                    <Button
                                      type="button"
                                      onClick={() =>
                                        productFaqsField.pushValue({
                                          question: "",
                                          answer: "",
                                        })
                                      }
                                    >
                                      Add Faq
                                    </Button>
                                  </div>

                                  {productFaqsField.state.value.map(
                                    (_, faqIndex) => (
                                      <FieldGroup
                                        className="border rounded p-2 gap-y-2"
                                        key={faqIndex}
                                      >
                                        <div className="flex items-center gap-3 justify-between">
                                          <FieldLabel className="text-lg font-medium">
                                            FAQ #{faqIndex + 1}
                                          </FieldLabel>
                                          <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() =>
                                              productFaqsField.removeValue(
                                                faqIndex
                                              )
                                            }
                                          >
                                            <IconTrash />
                                          </Button>
                                        </div>
                                        <form.Field
                                          name={`landingPageProducts[${index}].faqs[${faqIndex}].question`}
                                          children={(
                                            productFaqQuestionField
                                          ) => {
                                            const isInvalidProductFaqQuestion =
                                              productFaqQuestionField.state.meta
                                                .isTouched &&
                                              !productFaqQuestionField.state
                                                .meta.isValid;
                                            return (
                                              <Field>
                                                <FieldLabel
                                                  className="text-lg font-medium"
                                                  htmlFor={
                                                    productFaqQuestionField.name
                                                  }
                                                >
                                                  Question
                                                </FieldLabel>
                                                <Input
                                                  id={
                                                    productFaqQuestionField.name
                                                  }
                                                  name={
                                                    productFaqQuestionField.name
                                                  }
                                                  value={
                                                    productFaqQuestionField
                                                      .state.value
                                                  }
                                                  onBlur={() =>
                                                    productFaqQuestionField.handleBlur()
                                                  }
                                                  onChange={(e) =>
                                                    productFaqQuestionField.handleChange(
                                                      e.target.value
                                                    )
                                                  }
                                                  aria-invalid={
                                                    isInvalidProductFaqQuestion
                                                  }
                                                />
                                                {isInvalidProductFaqQuestion && (
                                                  <FieldError
                                                    errors={
                                                      productFaqQuestionField
                                                        .state.meta.errors
                                                    }
                                                  />
                                                )}
                                              </Field>
                                            );
                                          }}
                                        />
                                        <form.Field
                                          name={`landingPageProducts[${index}].faqs[${faqIndex}].answer`}
                                          children={(productFaqAnswerField) => {
                                            const isInvalidProductFaqAnswer =
                                              productFaqAnswerField.state.meta
                                                .isTouched &&
                                              !productFaqAnswerField.state.meta
                                                .isValid;
                                            return (
                                              <Field>
                                                <FieldLabel
                                                  className="text-lg font-medium"
                                                  htmlFor={
                                                    productFaqAnswerField.name
                                                  }
                                                >
                                                  Answer
                                                </FieldLabel>
                                                <Textarea
                                                  className="max-h-36"
                                                  id={
                                                    productFaqAnswerField.name
                                                  }
                                                  name={
                                                    productFaqAnswerField.name
                                                  }
                                                  value={
                                                    productFaqAnswerField.state
                                                      .value
                                                  }
                                                  onBlur={() =>
                                                    productFaqAnswerField.handleBlur()
                                                  }
                                                  onChange={(e) =>
                                                    productFaqAnswerField.handleChange(
                                                      e.target.value
                                                    )
                                                  }
                                                  aria-invalid={
                                                    isInvalidProductFaqAnswer
                                                  }
                                                />
                                                {isInvalidProductFaqAnswer && (
                                                  <FieldError
                                                    errors={
                                                      productFaqAnswerField
                                                        .state.meta.errors
                                                    }
                                                  />
                                                )}
                                              </Field>
                                            );
                                          }}
                                        />
                                      </FieldGroup>
                                    )
                                  )}
                                  {isInvalidProductFaqs && (
                                    <FieldError
                                      errors={
                                        productFaqsField.state.meta.errors
                                      }
                                    />
                                  )}
                                </Field>
                              );
                            }}
                          />
                          {isInvalidSub && (
                            <FieldError errors={subField.state.meta.errors} />
                          )}
                        </FieldGroup>
                      );
                    }}
                  />
                ))}
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldGroup>
            );
          }}
        />
        <Field orientation="horizontal">
          <Button type="reset" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <ActionButton
            type="submit"
            form="create-landing-page-form"
            action={() => form.handleSubmit()}
          >
            Submit
          </ActionButton>
        </Field>
      </FieldGroup>
    </form>
  );
}
