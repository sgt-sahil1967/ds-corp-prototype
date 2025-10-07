import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArrowRight, Globe, Shield, Zap, TrendingUp, Users, Package } from "lucide-react";

export default function Landing() {
  const stats = [
    { label: "RFQs Processed", value: "2,500+", icon: Package },
    { label: "Countries Served", value: "25+", icon: Globe },
    { label: "Happy Clients", value: "500+", icon: Users },
  ];

  const features = [
    {
      icon: Zap,
      title: "Instant Product Preview",
      description: "Paste any Indian e-commerce link and get instant product details with WhatsApp-style previews.",
    },
    {
      icon: Globe,
      title: "Global Sourcing",
      description: "Access Indian products from anywhere in the world with personalized quotes and shipping.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Professional quote management system with secure payment and delivery tracking.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Paste Product Link",
      description: "Copy any product URL from Amazon, Flipkart, or other Indian marketplaces.",
    },
    {
      number: "02",
      title: "Review Preview",
      description: "See instant product details with image, title, and price automatically extracted.",
    },
    {
      number: "03",
      title: "Submit RFQ",
      description: "Add multiple products and submit your request for a personalized quote.",
    },
    {
      number: "04",
      title: "Get Quote",
      description: "Receive a detailed quote from our team and proceed with payment and shipping.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
        <div className="container mx-auto px-4 md:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
              Bringing Indian Products to the World
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8" data-testid="text-hero-subtitle">
              Paste a product link from any Indian marketplace and get a personalized quote
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <span className="text-sm font-medium text-muted-foreground">Germany</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm font-medium text-muted-foreground">France</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm font-medium text-muted-foreground">Sweden</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm font-medium text-muted-foreground">Switzerland</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm font-medium text-muted-foreground">United Kingdom</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm font-medium text-muted-foreground">Italy</span>
            </div>

            <Link href="/rfq">
              <Button size="lg" className="text-lg px-8 py-6" data-testid="button-hero-cta">
                Start an RFQ
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold mb-2" data-testid={`text-stat-${index}`}>{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, fast, and efficient process to get quotes for Indian products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative" data-testid={`step-${index}`}>
                <div className="text-6xl font-bold text-primary/20 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-4 w-8">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose DS Corporation</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional sourcing platform trusted by businesses worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate transition-all">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/20 border-primary/20">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Source Indian Products?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start your first RFQ today and get a personalized quote from our team
              </p>
              <Link href="/rfq">
                <Button size="lg" className="text-lg px-8 py-6" data-testid="button-cta-bottom">
                  Start Your First RFQ
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
