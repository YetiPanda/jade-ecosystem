/**
 * Footer Component
 *
 * Application footer with links and copyright
 */

import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">About JADE</h3>
            <p className="text-sm text-muted-foreground">
              Professional spa marketplace platform connecting service providers with premium products.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/app/products" className="text-sm text-muted-foreground hover:text-primary">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/vendors" className="text-sm text-muted-foreground hover:text-primary">
                  For Vendors
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/app/appointments" className="text-sm text-muted-foreground hover:text-primary">
                  Appointments
                </Link>
              </li>
              <li>
                <Link to="/app/clients" className="text-sm text-muted-foreground hover:text-primary">
                  Client Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm text-muted-foreground hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} JADE Spa Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
