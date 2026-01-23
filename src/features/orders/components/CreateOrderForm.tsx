import { useForm, useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  createOrEditOrderSchema,
  CreateOrEditOrderType,
  orderStatuses,
} from "../types/orderTypes";
import { createOrderServer } from "../actions/server/createOrderServer";
import { IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getProductsServer } from "@/features/products/actions/server/getProductsServer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddProductsInOrderFormCombobox } from "./AddProductsInOrderFormCombobox";
import { Textarea } from "@/components/ui/textarea";
import { ActionButton } from "@/components/ui/action-button";

export default function CreateOrderForm() {
  const { data: products } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: getProductsServer,
  });

  const form = useForm({
    defaultValues: {
      customer: {
        name: "",
        mobileNumber: "",
        address: "",
      },
      orderItems: [],
      totalPrice: 0,
      shippingCharge: 0,
      orderStatus: orderStatuses[0],
    } as CreateOrEditOrderType,
    validators: {
      onSubmit: createOrEditOrderSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createOrderServer({
          data: value,
        });
        toast.success("Order Created Successfully");
        form.reset();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to create order"
        );
      }
    },
  });

  const currentOrderItems = useStore(
    form.store,
    (state) => state.values.orderItems
  );

  const unAddedProducts = products.filter(
    (product) =>
      !currentOrderItems.some((item) => item.productId === product.id)
  );

  return (
    <form
      id="create-order-form"
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* Customer Details Section */}
      <FieldGroup className="border rounded-md p-4">
        <FieldLabel className="text-2xl font-semibold">
          Customer Details
        </FieldLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field
            name="customer.name"
            children={(field) => {
              const isInvalidCustomerName =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalidCustomerName}>
                  <FieldLabel htmlFor={field.name}>Customer Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Md Mehedi Hasan Ontor"
                    aria-invalid={isInvalidCustomerName}
                  />
                  {isInvalidCustomerName && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          />
          <form.Field
            name="customer.mobileNumber"
            children={(field) => {
              const isInvalidCustomerMobileNumber =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalidCustomerMobileNumber}>
                  <FieldLabel htmlFor={field.name}>Mobile Number</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="01712345678"
                    aria-invalid={isInvalidCustomerMobileNumber}
                  />
                  {isInvalidCustomerMobileNumber && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          />
        </div>

        {/* Address Grid */}
        <form.Field
          name="customer.address"
          children={(field) => {
            const isInvalidCustomerAddressLocation =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalidCustomerAddressLocation}>
                <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                <Textarea
                  className="max-h-36"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter full address details..."
                  aria-invalid={isInvalidCustomerAddressLocation}
                />
                {isInvalidCustomerAddressLocation && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        />
      </FieldGroup>

      {/* Order Items Section */}
      <FieldGroup className="border rounded-md p-4">
        <FieldLabel className="text-2xl font-semibold">
          Product Details
        </FieldLabel>
        <form.Field
          name="orderItems"
          mode="array"
          children={(field) => {
            return (
              <FieldGroup>
                <FieldLabel htmlFor={field.name}>Products</FieldLabel>
                <AddProductsInOrderFormCombobox
                  items={unAddedProducts}
                  onSelect={(productId) => {
                    field.pushValue({
                      productId,
                      quantity: 1,
                    });
                  }}
                />
                <div className="border rounded-md p-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sl</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Purchase Price</TableHead>
                        <TableHead>Sell Price</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {field.state.value.map((item, index) => {
                        const product = products.find(
                          (p) => p.id === item.productId
                        );
                        if (!product) return null;

                        return (
                          <TableRow key={item.productId}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>
                              <form.Field
                                name={`orderItems[${index}].quantity`}
                                children={(subField) => {
                                  const isInvalidProductQuantity =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;
                                  return (
                                    <Field
                                      data-invalid={isInvalidProductQuantity}
                                    >
                                      <Input
                                        className="max-w-24"
                                        type="number"
                                        min={1}
                                        value={subField.state.value}
                                        onBlur={subField.handleBlur}
                                        onChange={(e) =>
                                          subField.handleChange(
                                            e.target.valueAsNumber
                                          )
                                        }
                                        aria-invalid={isInvalidProductQuantity}
                                      />
                                      {isInvalidProductQuantity && (
                                        <FieldError
                                          errors={subField.state.meta.errors}
                                        />
                                      )}
                                    </Field>
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>{product.purchasePrice}</TableCell>
                            <TableCell>{product.sellPrice}</TableCell>
                            <TableCell>
                              <form.Subscribe
                                selector={(state) =>
                                  state.values.orderItems[index].quantity
                                }
                                children={(quantity) => (
                                  <span>{product.sellPrice * quantity}</span>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => field.removeValue(index)}
                              >
                                <IconTrash className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                {field.state.meta.isTouched && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </FieldGroup>
            );
          }}
        />
      </FieldGroup>

      {/* Shipping & Final Total */}
      <FieldGroup className="border rounded-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field
            name="shippingCharge"
            children={(field) => (
              <Field
                className="flex-1"
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              >
                <FieldLabel htmlFor={field.name}>Shipping Charge</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={0}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  placeholder="0"
                />
                {field.state.meta.isTouched && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          />
          <div className="border rounded-md p-4 space-y-4">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <div className="border rounded-md p-1">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Subtotal</TableCell>
                    <TableCell>
                      <form.Subscribe
                        selector={(state) =>
                          state.values.orderItems.reduce((acc, item) => {
                            const product = products.find(
                              (p) => p.id === item.productId
                            );
                            return (
                              acc + item.quantity * Number(product?.sellPrice)
                            );
                          }, 0)
                        }
                        children={(subTotal) => subTotal}
                      />
                    </TableCell>
                  </TableRow>
                  <form.Subscribe
                    selector={(state) => state.values.shippingCharge}
                    children={(shippingCharge) => (
                      <TableRow>
                        <TableCell>Shipping Charge</TableCell>
                        <TableCell>{shippingCharge}</TableCell>
                      </TableRow>
                    )}
                  />
                  <form.Subscribe
                    selector={(state) => ({
                      itemsTotal: state.values.orderItems.reduce(
                        (acc, item) => {
                          const product = products.find(
                            (p) => p.id === item.productId
                          );
                          return (
                            acc + item.quantity * Number(product?.sellPrice)
                          );
                        },
                        0
                      ),
                      shippingCharge: state.values.shippingCharge,
                    })}
                    children={({ itemsTotal, shippingCharge }) => (
                      <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell>{itemsTotal + shippingCharge}</TableCell>
                      </TableRow>
                    )}
                  />
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </FieldGroup>

      <Field orientation="horizontal" className="gap-4">
        <Button type="reset" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <ActionButton type="submit" action={() => form.handleSubmit()}>
          Create Order
        </ActionButton>
      </Field>
    </form>
  );
}
