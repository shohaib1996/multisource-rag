"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getOrders } from "@/lib/api"
import { Order } from "@/types"

interface OrdersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getStatusVariant(status: Order["status"]) {
  switch (status) {
    case "delivered":
      return "default"
    case "shipped":
      return "secondary"
    case "pending":
      return "outline"
    case "failed":
    case "cancelled":
      return "destructive"
    default:
      return "outline"
  }
}

export function OrdersModal({ open, onOpenChange }: OrdersModalProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setIsLoading(true)
      setError(null)
      setOrders([])
      setTotal(0)
      getOrders()
        .then((data) => {
          setOrders(data.orders)
          setTotal(data.total)
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Failed to load orders")
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Orders Database</DialogTitle>
          <DialogDescription>
            All orders stored in PostgreSQL database ({total} total)
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="text-destructive text-center py-4">{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No orders found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.order_id}>
                    <TableCell className="font-medium">
                      #{order.order_id}
                    </TableCell>
                    <TableCell>{order.user_id}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>{order.currency}</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
