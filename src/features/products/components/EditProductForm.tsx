import { ProductModel } from "@/generated/prisma/models";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getProductServer } from "../actions/server/getProductServer";
import { createOrEditProductSchema } from "../types/productTypes";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import { updateProductServer } from "../actions/server/updateProductServer";
import { ActionButton } from "@/components/ui/action-button";

export default function EditProductForm({
  productId,
}: {
  productId: ProductModel["id"];
}) {
  const { data: product } = useSuspenseQuery({
    queryKey: ["product", productId],
    queryFn: async () =>
      await getProductServer({
        data: productId,
      }),
  });

  const form = useForm({
    defaultValues: {
      name: product.name,
      purchasePrice: product.purchasePrice,
      sellPrice: product.sellPrice,
      images: product.images,
    },
    validators: {
      onSubmit: createOrEditProductSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateProductServer({
          data: {
            productId,
            updatedData: value,
          },
        });
        toast.success("Product Updated Successfully");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update product"
        );
      }
    },
  });

  return (
    <form
      id="update-product-form"
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
                <FieldLabel htmlFor={field.name}>Product Name</FieldLabel>
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
          name="purchasePrice"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Purchase Price</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  placeholder="0"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="sellPrice"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Sell Price</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  placeholder="0"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="images"
          mode="array"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <FieldGroup>
                <div className="flex gap-3 justify-between">
                  <FieldLabel htmlFor={field.name}>Images</FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => field.pushValue("")}
                  >
                    Add Image
                  </Button>
                </div>
                {field.state.value.map((_, index) => (
                  <form.Field
                    key={index}
                    name={`images[${index}]`}
                    children={(subField) => {
                      const isInvalidSub =
                        subField.state.meta.isTouched &&
                        !subField.state.meta.isValid;
                      return (
                        <Field>
                          <div className="flex gap-2">
                            <Input
                              id={subField.name}
                              name={subField.name}
                              value={subField.state.value}
                              onBlur={subField.handleBlur}
                              onChange={(e) =>
                                subField.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                            />
                            {field.state.value.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => field.removeValue(index)}
                              >
                                <IconTrash />
                              </Button>
                            )}
                          </div>
                          {isInvalidSub && (
                            <FieldError errors={subField.state.meta.errors} />
                          )}
                        </Field>
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
            form="update-product-form"
            action={async () => await form.handleSubmit()}
          >
            Submit
          </ActionButton>
        </Field>
      </FieldGroup>
    </form>
  );
}
