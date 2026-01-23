import { OrderModel } from "@/generated/prisma/models";
import { getOrderServer } from "@/features/orders/actions/server/getOrderServer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconCalendar,
  IconCreditCard,
  IconPackage,
  IconUser,
} from "@tabler/icons-react";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Image } from "@unpic/react";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";

export default function OrderDetails({
  orderId,
}: {
  orderId: OrderModel["id"];
}) {
  const { data: order } = useSuspenseQuery({
    queryKey: ["order", orderId],
    queryFn: async () =>
      await getOrderServer({
        data: orderId,
      }),
  });
  return (
    <section className="space-y-6 border rounded-md p-4">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">Order #{orderId}</h1>
        <Badge
          className="mt-2 text-sm"
          variant={
            order.orderStatus === "cancelled" ? "destructive" : "default"
          }
        >
          <IconPackage />
          {order.orderStatus[0].toUpperCase() + order.orderStatus.slice(1)}
        </Badge>
      </div>
      <Item variant="outline" size="sm">
        <ItemMedia>
          <IconCalendar className="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            Placed on{" "}
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(order.createdAt))}
          </ItemTitle>
        </ItemContent>
      </Item>

      {/* Ordered Products section */}
      <Card className="gap-4">
        <CardHeader>
          <Item className="p-0">
            <ItemContent>
              <CardTitle className="text-2xl font-semibold">
                Ordered Products
              </CardTitle>
            </ItemContent>
            <ItemContent>{order.orderItems.length} Items</ItemContent>
          </Item>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4">
          <ItemGroup className="gap-4">
            {order.orderItems.map((orderItem) => (
              <Item key={orderItem.name} variant="outline" role="listitem">
                <Image
                  className="rounded"
                  src={orderItem.product.images[0]}
                  alt={orderItem.product.name}
                  width={75}
                  height={75}
                />
                <ItemContent>
                  <ItemTitle className="line-clamp-1 text-xl font-semibold">
                    {orderItem.product.name}
                  </ItemTitle>
                  <p>
                    ৳{orderItem.price} x {orderItem.quantity}
                  </p>
                </ItemContent>
                <ItemContent className="flex-none text-center">
                  <ItemTitle className="text-base">
                    ৳{orderItem.price * orderItem.quantity}
                  </ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="border rounded-md p-4">
              <Table>
                <TableRow>
                  <TableHead>Subtotal:</TableHead>
                  <TableCell>
                    {order.orderItems.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0,
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Shipping Charge</TableHead>
                  <TableCell>{order.shippingCharge}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Total</TableHead>
                  <TableCell>{order.totalPrice}</TableCell>
                </TableRow>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer section */}
        <Card className="gap-4">
          <CardHeader className="py-0">
            <Item className="p-0">
              <ItemMedia className="rounded-full p-2 bg-accent">
                <IconUser />
              </ItemMedia>
              <ItemContent>
                <CardTitle className="text-2xl font-semibold">
                  Customer Information
                </CardTitle>
              </ItemContent>
            </Item>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <strong className="font-medium">Name:</strong>
              <p>{order.customer.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <strong className="font-medium">Mobile Number:</strong>
              <p>{order.customer.mobileNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <strong className="font-medium">Address:</strong>
              <p>{order.customer.address}</p>
            </div>
          </CardContent>
        </Card>
        {/* Payment section */}
        <Card className="gap-4">
          <CardHeader className="py-0">
            <Item className="p-0">
              <ItemMedia className="rounded-full p-2 bg-accent">
                <IconCreditCard />
              </ItemMedia>
              <ItemContent>
                <CardTitle className="text-2xl font-semibold">
                  Payment Details
                </CardTitle>
              </ItemContent>
            </Item>
          </CardHeader>
          <Separator />
          <CardContent>
            <div className="flex items-center gap-2 justify-between">
              <strong className="font-medium">Payment Method:</strong>
              <p>Cash on Delivery</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
