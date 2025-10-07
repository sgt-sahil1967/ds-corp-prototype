import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, Package, Plus, Send } from "lucide-react";
import type { ProductPreview } from "@shared/schema";

interface ProductItem extends ProductPreview {
  quantity: number;
  id: string;
}

export default function RfqCreate() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
  });

  const previewMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest<ProductPreview>("POST", "/api/preview", { url });
      return response;
    },
    onSuccess: (data) => {
      if (data.success && data.title) {
        const newProduct: ProductItem = {
          ...data,
          quantity: 1,
          id: Date.now().toString(),
        };
        setProducts([...products, newProduct]);
        setUrl("");
        toast({
          title: "Product added",
          description: "Product preview generated successfully",
        });
      } else if (data.manual_required) {
        toast({
          title: "Manual entry required",
          description: "Could not auto-fetch product details. Please add manually.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch product preview",
        variant: "destructive",
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const rfqData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone || null,
        customerCompany: customerInfo.company || null,
        customerCountry: customerInfo.country || null,
        products: products.map((p) => ({
          url: p.url || "",
          title: p.title || "",
          description: p.description || "",
          image: p.image || "",
          price: p.price || "",
          quantity: p.quantity,
          isManual: p.manual_required ? 1 : 0,
        })),
      };
      return apiRequest<{ rfqId: string; rfqNumber: string }>("POST", "/api/rfq", rfqData);
    },
    onSuccess: (data) => {
      setLocation(`/rfq/confirmation/${data.rfqId}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit RFQ",
        variant: "destructive",
      });
    },
  });

  const handleFetchPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      previewMutation.mutate(url);
    }
  };

  const handleSubmitRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (products.length === 0) {
      toast({
        title: "No products",
        description: "Please add at least one product",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate();
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, quantity } : p)));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-page-title">
              Create Request for Quote
            </h1>
            <p className="text-muted-foreground">
              Paste product links from Indian marketplaces or add products manually
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Product Input */}
            <div className="lg:col-span-2 space-y-6">
              {/* URL Input */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFetchPreview} className="space-y-4">
                    <div>
                      <Label htmlFor="product-url">Product URL</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="product-url"
                          type="url"
                          placeholder="https://www.amazon.in/dp/..."
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          disabled={previewMutation.isPending}
                          data-testid="input-product-url"
                        />
                        <Button
                          type="submit"
                          disabled={!url.trim() || previewMutation.isPending}
                          data-testid="button-fetch-product"
                        >
                          {previewMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          Fetch
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Paste a link from Amazon, Flipkart, or any Indian e-commerce site
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Product Previews */}
              {products.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Products in RFQ ({products.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex gap-4 p-4 border rounded-lg hover-elevate"
                        data-testid={`product-${product.id}`}
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold mb-1 line-clamp-2">{product.title}</h4>
                          {product.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {product.description}
                            </p>
                          )}
                          {product.price && (
                            <p className="text-sm font-medium text-primary">{product.price}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Label className="text-xs">Qty:</Label>
                            <Input
                              type="number"
                              min="1"
                              value={product.quantity}
                              onChange={(e) =>
                                updateQuantity(product.id, parseInt(e.target.value) || 1)
                              }
                              className="w-20 h-8"
                              data-testid={`input-quantity-${product.id}`}
                            />
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeProduct(product.id)}
                          data-testid={`button-remove-${product.id}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Customer Info */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitRfq} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        required
                        value={customerInfo.name}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, name: e.target.value })
                        }
                        data-testid="input-name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, email: e.target.value })
                        }
                        data-testid="input-email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, phone: e.target.value })
                        }
                        data-testid="input-phone"
                      />
                    </div>

                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={customerInfo.company}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, company: e.target.value })
                        }
                        data-testid="input-company"
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={customerInfo.country}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, country: e.target.value })
                        }
                        placeholder="e.g., Germany"
                        data-testid="input-country"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitMutation.isPending || products.length === 0}
                      data-testid="button-submit-rfq"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit RFQ
                        </>
                      )}
                    </Button>
                  </form>
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
