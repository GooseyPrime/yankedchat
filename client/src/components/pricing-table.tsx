import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out",
    features: [
      "5 extractions per month",
      "All supported platforms", 
      "Basic export formats",
    ],
    popular: false,
  },
  {
    name: "Basic",
    price: "$4.99",
    description: "per week",
    features: [
      "50 extractions per week",
      "All supported platforms",
      "All export formats",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$9.99",
    description: "per week",
    features: [
      "Unlimited extractions",
      "Batch processing",
      "Priority support",
      "Advanced export options",
      "API access",
    ],
    popular: true,
  },
  {
    name: "Professional Yearly",
    price: "$99.99",
    description: "per year",
    features: [
      "Everything in Professional",
      "2 months free",
      "Priority support",
      "Custom integrations",
      "Dedicated account manager",
    ],
    popular: false,
  },
];

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': {
        'pricing-table-id': string;
        'publishable-key': string;
      };
    }
  }
}

export default function PricingTable() {
  useEffect(() => {
    // Load Stripe pricing table script
    if (!document.querySelector('script[src="https://js.stripe.com/v3/pricing-table.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/pricing-table.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Check for required Stripe environment variable
  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    console.error('Missing VITE_STRIPE_PUBLIC_KEY environment variable');
    return (
      <div className="max-w-6xl mx-auto text-center p-8">
        <p className="text-red-500">Payment system configuration error. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Plan Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`rounded-2xl p-6 text-center hover-lift ${
              plan.popular ? "border-2 border-primary relative" : "border border-border"
            }`}
            data-testid={`card-plan-${index}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="flame-gradient text-white px-3 py-1 rounded-full text-xs font-medium" data-testid="badge-most-popular">
                  Most Popular
                </span>
              </div>
            )}
            
            <h3 className="text-lg font-bold text-foreground mb-2" data-testid={`text-plan-name-${index}`}>
              {plan.name}
            </h3>
            <div className="text-3xl font-bold text-foreground mb-1" data-testid={`text-plan-price-${index}`}>
              {plan.price}
            </div>
            <p className="text-sm text-muted-foreground mb-4" data-testid={`text-plan-description-${index}`}>
              {plan.description}
            </p>
            
            <ul className="space-y-2 text-sm">
              {plan.features.slice(0, 3).map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-left" data-testid={`feature-${index}-${featureIndex}`}>
                  <Check className="text-green-500 mr-2 h-3 w-3 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
              {plan.features.length > 3 && (
                <li className="text-muted-foreground text-xs">
                  +{plan.features.length - 3} more features
                </li>
              )}
            </ul>
          </Card>
        ))}
      </div>

      {/* Stripe Pricing Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-border" data-testid="stripe-pricing-table">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">Choose Your Plan</h3>
          <p className="text-muted-foreground">Secure checkout powered by Stripe</p>
        </div>
        
        <stripe-pricing-table 
          pricing-table-id="prctbl_1RtfEmJF6bibA8neSXrRMoJa"
          publishable-key={import.meta.env.VITE_STRIPE_PUBLIC_KEY}
        />
      </div>
      
      {/* Stripe Integration Notice */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground" data-testid="text-stripe-notice">
          <CreditCard className="inline mr-2 h-4 w-4" />
          Secure payments powered by Stripe
        </p>
      </div>
    </div>
  );
}
