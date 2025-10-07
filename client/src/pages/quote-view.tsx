import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Package, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { RfqWithProducts } from "@shared/schema";

export default function QuoteView() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: rfq, isLoading } = useQuery<RfqWithProducts>({
    queryKey: ["/api/rfq", id],
  });

  const acceptMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/rfq/${id}/accept`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rfq", id] });
      toast({
        title: "Quote accepted",
        description: "You will receive payment instructions via email shortly.",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/rfq/${id}/reject`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rfq", id] });
      toast({
        title: "Quote rejected",
        description: "Your request has been updated.",
      });
    },
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading quote...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Quote not found</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const hasQuote = rfq.quotePrice || rfq.quoteTotal;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-page-title">
                Quote Details
              </h1>
              <div className="flex items-center gap-3">
                <span className="font-mono text-muted-foreground" data-testid="text-rfq-number">
                  {rfq.rfqNumber}
                </span>
                {getStatusBadge(rfq.status)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium" data-testid="text-customer-name">{rfq.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium" data-testid="text-customer-email">{rfq.customerEmail}</p>
                  </div>
                  {rfq.customerCompany && (
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{rfq.customerCompany}</p>
                    </div>
                  )}
                  {rfq.customerCountry && (
                    <div>
                      <p className="text-sm text-muted-foreground">Country</p>
                      <p className="font-medium">{rfq.customerCountry}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Products ({rfq.products.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {rfq.products.map((product) => (
                    <div key={product.id} className="flex gap-4 p-4 border rounded-lg">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{product.title}</h4>
                        {product.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          {product.price && (
                            <span className="text-sm font-medium text-primary">{product.price}</span>
                          )}
                          <span className="text-sm text-muted-foreground">Qty: {product.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Quote Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hasQuote ? (
                    <>
                      {rfq.quotePrice && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Products</span>
                          <span className="font-medium" data-testid="text-quote-price">{rfq.quotePrice}</span>
                        </div>
                      )}
                      {rfq.quoteShipping && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping</span>
                          <span className="font-medium">{rfq.quoteShipping}</span>
                        </div>
                      )}
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-primary" data-testid="text-quote-total">
                            {rfq.quoteTotal || rfq.quotePrice}
                          </span>
                        </div>
                      </div>
                      {rfq.quoteNotes && (
                        <div className="border-t pt-4">
                          <p className="text-sm text-muted-foreground mb-2">Notes</p>
                          <p className="text-sm">{rfq.quoteNotes}</p>
                        </div>
                      )}
                      {rfq.status === "quoted" && (
                        <div className="border-t pt-4 space-y-2">
                          <Button
                            className="w-full"
                            onClick={() => acceptMutation.mutate()}
                            disabled={acceptMutation.isPending}
                            data-testid="button-accept-quote"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept Quote
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => rejectMutation.mutate()}
                            disabled={rejectMutation.isPending}
                            data-testid="button-reject-quote"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject Quote
                          </Button>
                        </div>
                      )}
                      {rfq.status === "paid" && (
                        <div className="bg-primary/10 rounded-lg p-4">
                          <p className="text-sm font-medium text-center">
                            Payment confirmed. Your order is being processed.
                          </p>
                        </div>
                      )}
                      {rfq.status === "shipped" && (
                        <div className="bg-primary/10 rounded-lg p-4">
                          <p className="text-sm font-medium text-center">
                            Your order has been shipped!
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        Quote pending. Our team is reviewing your request.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
