import { useForm, useStore } from "@tanstack/react-form";
import { useEffect, useMemo, useState } from "react"; // Added hooks
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
import { OrderModel } from "@/generated/prisma/models";
import { getOrderServer } from "../actions/server/getOrderServer";
import { updateOrderServer } from "../actions/server/updateOrderServer";

export default function EditOrderForm({
  orderId,
}: {
  orderId: OrderModel["id"];
}) {
  const { data: order } = useSuspenseQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderServer({ data: orderId }),
  });

  const { data: products } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: getProductsServer,
  });

  const form = useForm({
    defaultValues: {
      customer: {
        name: order.customer.name,
        mobileNumber: order.customer.mobileNumber,
        address: order.customer.address,
      },
      orderItems: order.orderItems,
      totalPrice: order.totalPrice,
      shippingCharge: order.shippingCharge,
      orderStatus: order.orderStatus,
    } as CreateOrEditOrderType,
    validators: {
      onSubmit: createOrEditOrderSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateOrderServer({
          data: {
            orderId,
            updatedData: value,
          },
        });
        toast.success("Order Updated Successfully");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update order"
        );
      }
    },
  });

  // Helper to calculate totals based on current form state
  // We use useStore to subscribe to specific parts of the form state to avoid unnecessary re-renders
  const currentOrderItems = useStore(
    form.store,
    (state) => state.values.orderItems
  );
  const currentShipping = useStore(
    form.store,
    (state) => state.values.shippingCharge
  );

  const [itemsTotal, setItemsTotal] = useState(0);

  // Auto-calculate Total Price
  useEffect(() => {
    const itemsTotal = currentOrderItems.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? acc + product.sellPrice * item.quantity : acc;
    }, 0);
    setItemsTotal(itemsTotal);

    const grandTotal = itemsTotal + currentShipping;

    // Only update if different to prevent loops
    if (form.state.values.totalPrice !== grandTotal) {
      form.setFieldValue("totalPrice", grandTotal);
    }
  }, [currentOrderItems, currentShipping, products, form]);

  const unAddedProducts = useMemo(() => {
    return products.filter(
      (product) =>
        !currentOrderItems.some((item) => item.productId === product.id)
    );
  }, [products, currentOrderItems]);

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
            children={(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              >
                <FieldLabel htmlFor={field.name}>Customer Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Md Mehedi Hasan Ontor"
                />
                {field.state.meta.isTouched && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          />
          <form.Field
            name="customer.mobileNumber"
            children={(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              >
                <FieldLabel htmlFor={field.name}>Mobile Number</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="01712345678"
                />
                {field.state.meta.isTouched && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Address Grid */}
        <form.Field
          name="customer.address"
          children={(field) => (
            <Field
              data-invalid={
                field.state.meta.isTouched && !field.state.meta.isValid
              }
            >
              <FieldLabel htmlFor={field.name}>Location</FieldLabel>
              <Textarea
                className="max-h-36"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter full address details..."
              />
              {field.state.meta.isTouched && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </Field>
          )}
        />
      </FieldGroup>

      {/* orderItems Section */}
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
                                children={(subField) => (
                                  <Field>
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
                                    />
                                    <FieldError
                                      errors={subField.state.meta.errors}
                                    />
                                  </Field>
                                )}
                              />
                            </TableCell>
                            <TableCell>{product.purchasePrice}</TableCell>
                            <TableCell>{product.sellPrice}</TableCell>
                            <TableCell>
                              <form.Field
                                name={`orderItems[${index}].quantity`}
                                children={(qtyField) => (
                                  <span>
                                    {product.sellPrice * qtyField.state.value}
                                  </span>
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
                    <TableCell>{itemsTotal}</TableCell>
                  </TableRow>
                  <form.Field
                    name="shippingCharge"
                    children={(field) => (
                      <TableRow>
                        <TableCell>Shipping Charge</TableCell>
                        <TableCell>{field.state.value}</TableCell>
                      </TableRow>
                    )}
                  />
                  <form.Field
                    name="totalPrice"
                    children={(field) => (
                      <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell>{field.state.value}</TableCell>
                      </TableRow>
                    )}
                  />
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </FieldGroup>

      <Field orientation="horizontal" className="justify-end gap-4">
        <Button type="reset" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit">Update Order</Button>
      </Field>
    </form>
  );
}
