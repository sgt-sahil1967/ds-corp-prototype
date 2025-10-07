import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Package, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { RfqWithProducts, RfqStatus } from "@shared/schema";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedRfq, setSelectedRfq] = useState<RfqWithProducts | null>(null);
  const [quoteData, setQuoteData] = useState({
    quotePrice: "",
    quoteShipping: "",
    quoteTotal: "",
    quoteNotes: "",
    status: "" as RfqStatus,
  });

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: rfqs = [], isLoading } = useQuery<RfqWithProducts[]>({
    queryKey: ["/api/admin/rfqs"],
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<RfqWithProducts> }) =>
      apiRequest("PATCH", `/api/admin/rfq/${data.id}`, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rfqs"] });
      toast({
        title: "RFQ updated",
        description: "Changes saved successfully",
      });
      setSelectedRfq(null);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setLocation("/admin");
  };

  const handleOpenRfq = (rfq: RfqWithProducts) => {
    setSelectedRfq(rfq);
    setQuoteData({
      quotePrice: rfq.quotePrice || "",
      quoteShipping: rfq.quoteShipping || "",
      quoteTotal: rfq.quoteTotal || "",
      quoteNotes: rfq.quoteNotes || "",
      status: rfq.status as RfqStatus,
    });
  };

  const handleSaveQuote = () => {
    if (selectedRfq) {
      updateMutation.mutate({
        id: selectedRfq.id,
        updates: quoteData,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      new: { variant: "secondary", icon: AlertCircle },
      quoted: { variant: "default", icon: Package },
      paid: { variant: "default", icon: CheckCircle },
      shipped: { variant: "default", icon: Package },
      delivered: { variant: "default", icon: CheckCircle },
      rejected: { variant: "destructive", icon: XCircle },
    };

    const config = variants[status] || variants.new;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <h1 className="text-xl font-semibold" data-testid="text-page-title">
            DS Corporation - Admin Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 py-8 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">RFQ Management</h2>
          <p className="text-muted-foreground">
            Review and manage customer quote requests
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading RFQs...</p>
          </div>
        ) : rfqs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No RFQs yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="table-rfqs">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold">RFQ ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Products</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rfqs.map((rfq) => (
                  <tr
                    key={rfq.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                    data-testid={`rfq-row-${rfq.id}`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm">{rfq.rfqNumber}</span>
                    </td>
                    <td className="px-6 py-4">{rfq.customerName}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{rfq.customerEmail}</td>
                    <td className="px-6 py-4 text-sm">{rfq.products.length} items</td>
                    <td className="px-6 py-4">{getStatusBadge(rfq.status)}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(rfq.createdAt!).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        onClick={() => handleOpenRfq(rfq)}
                        data-testid={`button-view-${rfq.id}`}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Dialog open={!!selectedRfq} onOpenChange={() => setSelectedRfq(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle data-testid="text-dialog-title">RFQ Details</DialogTitle>
            <DialogDescription>
              {selectedRfq && (
                <span className="font-mono">{selectedRfq.rfqNumber}</span>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedRfq && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedRfq.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedRfq.customerEmail}</p>
                </div>
                {selectedRfq.customerCompany && (
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{selectedRfq.customerCompany}</p>
                  </div>
                )}
                {selectedRfq.customerCountry && (
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{selectedRfq.customerCountry}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-3">Products ({selectedRfq.products.length})</h4>
                <div className="space-y-3">
                  {selectedRfq.products.map((product) => (
                    <div key={product.id} className="flex gap-3 p-3 border rounded-lg">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm line-clamp-1">{product.title}</h5>
                        <p className="text-xs text-muted-foreground">Qty: {product.quantity}</p>
                        {product.price && (
                          <p className="text-sm text-primary mt-1">{product.price}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Quote Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quotePrice">Product Price</Label>
                    <Input
                      id="quotePrice"
                      value={quoteData.quotePrice}
                      onChange={(e) => setQuoteData({ ...quoteData, quotePrice: e.target.value })}
                      placeholder="₹10,000"
                      data-testid="input-quote-price"
                    />
                  </div>

                  <div>
                    <Label htmlFor="quoteShipping">Shipping Cost</Label>
                    <Input
                      id="quoteShipping"
                      value={quoteData.quoteShipping}
                      onChange={(e) => setQuoteData({ ...quoteData, quoteShipping: e.target.value })}
                      placeholder="₹2,000"
                      data-testid="input-quote-shipping"
                    />
                  </div>

                  <div>
                    <Label htmlFor="quoteTotal">Total Amount</Label>
                    <Input
                      id="quoteTotal"
                      value={quoteData.quoteTotal}
                      onChange={(e) => setQuoteData({ ...quoteData, quoteTotal: e.target.value })}
                      placeholder="₹12,000"
                      data-testid="input-quote-total"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={quoteData.status}
                      onValueChange={(value) => setQuoteData({ ...quoteData, status: value as RfqStatus })}
                    >
                      <SelectTrigger data-testid="select-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="quoted">Quoted</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="quoteNotes">Notes</Label>
                    <Textarea
                      id="quoteNotes"
                      value={quoteData.quoteNotes}
                      onChange={(e) => setQuoteData({ ...quoteData, quoteNotes: e.target.value })}
                      placeholder="Additional notes or terms..."
                      rows={3}
                      data-testid="input-quote-notes"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRfq(null)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveQuote}
                  disabled={updateMutation.isPending}
                  data-testid="button-save-quote"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Quote"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
