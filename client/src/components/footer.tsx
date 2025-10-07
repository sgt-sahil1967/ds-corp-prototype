import { Link } from "wouter";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-20">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">DS Corporation</h3>
            <p className="text-sm text-muted-foreground">
              Bringing Indian Products to the World
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-home"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-about"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/rfq"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-rfq"
                >
                  Create RFQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span data-testid="text-email">support@dscorporation.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span data-testid="text-phone">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span data-testid="text-address">Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">We Serve</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Germany</li>
              <li>France</li>
              <li>Sweden</li>
              <li>Switzerland</li>
              <li>United Kingdom</li>
              <li>Italy</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DS Corporation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
