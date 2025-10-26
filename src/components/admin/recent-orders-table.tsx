import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/utils/admin.util";
import { formatCurrency } from "@/utils/payment.util";
import { OrderStatus } from "@/types/order.type";

interface RecentOrdersTableProps {
  orders: any[];
}

const statusColors = {
  pending: "warning",
  processing: "default",
  completed: "success",
  cancelled: "destructive",
  refunded: "secondary",
} as const;

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Account</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{order.userName}</div>
                <div className="text-sm text-muted-foreground">
                  {order.userEmail}
                </div>
              </div>
            </TableCell>
            <TableCell className="max-w-xs truncate">
              {order.accountTitle}
            </TableCell>
            <TableCell>{formatCurrency(order.amount)}</TableCell>
            <TableCell>
              <Badge
                variant={
                  statusColors[order.status as keyof typeof statusColors] ||
                  "default"
                }
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDateTime(order.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
