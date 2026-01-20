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
import { getPayments } from "@/lib/api"
import { Payment } from "@/types"

interface PaymentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getStatusVariant(status: Payment["payment_status"]) {
  switch (status) {
    case "paid":
      return "default"
    case "refunded":
      return "secondary"
    case "failed":
      return "destructive"
    default:
      return "outline"
  }
}

export function PaymentsModal({ open, onOpenChange }: PaymentsModalProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setIsLoading(true)
      setError(null)
      setPayments([])
      setTotal(0)
      getPayments()
        .then((data) => {
          setPayments(data.payments)
          setTotal(data.total)
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Failed to load payments")
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Payments / Revenue Database</DialogTitle>
          <DialogDescription>
            All payment records stored in PostgreSQL database ({total} total)
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
          ) : payments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No payments found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">#{payment.id}</TableCell>
                    <TableCell>#{payment.order_id}</TableCell>
                    <TableCell className="capitalize">{payment.provider || "-"}</TableCell>
                    <TableCell className="capitalize">
                      {payment.payment_method?.replace("_", " ") || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(payment.payment_status)}>
                        {payment.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.amount.toFixed(2)} {payment.currency}
                    </TableCell>
                    <TableCell>
                      {payment.paid_at
                        ? new Date(payment.paid_at).toLocaleDateString()
                        : "-"}
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
