import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import PricingTable from "@/components/pricing-table";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-pricing-title">
              Simple <span className="flame-text">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-pricing-description">
              Choose the plan that fits your needs
            </p>
          </div>

          <PricingTable />
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
