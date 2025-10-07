import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import type { RfqWithProducts } from "@shared/schema";

export default function RfqConfirmation() {
  const { id } = useParams<{ id: string }>();
  
  const { data: rfq, isLoading } = useQuery<RfqWithProducts>({
    queryKey: ["/api/rfq", id],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading RFQ details...</p>
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
              <p className="text-muted-foreground">RFQ not found</p>
              <Link href="/">
                <a>
                  <Button className="mt-4">Go Home</Button>
                </a>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" data-testid="icon-success" />
            <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-confirmation-title">
              RFQ Submitted Successfully!
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Your request has been received
            </p>
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
              <span className="text-sm text-muted-foreground">RFQ ID:</span>
              <span className="font-mono font-semibold text-primary" data-testid="text-rfq-number">
                {rfq.rfqNumber}
              </span>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Request Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Products ({rfq.products.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rfq.products.map((product, index) => (
                <div key={product.id} className="flex gap-4 p-4 border rounded-lg" data-testid={`product-${index}`}>
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

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">What's Next?</h3>
                <p className="text-muted-foreground mb-6">
                  Our team will review your request and send you a personalized quote via email within 24-48 hours.
                  You can track your quote status using the RFQ ID above.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={`/quote/${rfq.id}`}>
                    <Button variant="outline" data-testid="button-view-quote">
                      View Quote Status
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/rfq">
                    <Button data-testid="button-new-rfq">Create Another RFQ</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
