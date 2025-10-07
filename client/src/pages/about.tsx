import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Users, TrendingUp, Award } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "Serving customers in over 25 countries across Europe, Asia, and beyond.",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Experienced professionals dedicated to sourcing the best Indian products.",
    },
    {
      icon: TrendingUp,
      title: "Quality Assurance",
      description: "Rigorous quality checks ensure you receive only the best products.",
    },
    {
      icon: Award,
      title: "Trusted Partner",
      description: "Years of experience in international trade and product sourcing.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4" data-testid="text-page-title">
              About DS Corporation
            </h1>
            <p className="text-xl text-muted-foreground">
              Your trusted partner for sourcing Indian products globally
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="text-lg leading-relaxed" data-testid="text-description">
              DS Corporation is a leading international sourcing company specializing in bringing high-quality 
              Indian products to global markets. We source and customize Indian raw materials and products for 
              businesses worldwide — from textiles and handicrafts to specialized industrial goods.
            </p>

            <p className="text-lg leading-relaxed mt-6">
              With years of experience in international trade, we understand the unique challenges of sourcing 
              products from India. Our streamlined RFQ platform makes it easy for businesses to discover, quote, 
              and purchase Indian products with confidence.
            </p>

            <p className="text-lg leading-relaxed mt-6">
              Whether you're looking for traditional handicrafts, modern textiles, industrial materials, or 
              specialized products, our team of experts is ready to help you find exactly what you need at 
              competitive prices.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="hover-elevate transition-all">
                  <CardContent className="pt-6">
                    <value.icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-gradient-to-r from-primary/10 to-accent/20 border-primary/20">
            <CardContent className="py-8">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  To bridge the gap between Indian manufacturers and global businesses, providing seamless 
                  access to quality products with professional service, competitive pricing, and reliable delivery.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
