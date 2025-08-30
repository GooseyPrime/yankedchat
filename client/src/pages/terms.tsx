import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-terms-title">
              Terms and Conditions
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-terms-subtitle">
              Last updated: August 30, 2025
            </p>
          </div>

          <Card className="mb-8" data-testid="card-terms-content">
            <CardContent className="p-8 prose prose-gray max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Yanked.Chat ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                Yanked.Chat provides tools for extracting and downloading chat transcripts from various AI conversation platforms including ChatGPT, Claude, Gemini, and Copilot.
              </p>

              <h2>3. User Responsibilities</h2>
              <ul>
                <li>You must provide accurate and complete information when using our service</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You agree to use the service only for lawful purposes</li>
                <li>You will not attempt to interfere with the proper operation of the service</li>
              </ul>

              <h2>4. Privacy and Data Protection</h2>
              <p>
                We process conversation data temporarily for extraction purposes only. No conversation content is stored permanently on our servers. Please see our Privacy Policy for detailed information about data handling.
              </p>

              <h2>5. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of Yanked.Chat and its licensors.
              </p>

              <h2>6. Payment Terms</h2>
              <p>
                Paid subscriptions are billed in advance on a monthly basis. All payments are processed securely through Stripe. Refunds are provided within 30 days of subscription purchase.
              </p>

              <h2>7. Service Availability</h2>
              <p>
                We strive to maintain high service availability but do not guarantee uninterrupted access. The service may be temporarily unavailable for maintenance or technical issues.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>
                Yanked.Chat shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
              </p>

              <h2>9. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including breach of these Terms.
              </p>

              <h2>10. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>

              <h2>11. Contact Information</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us at support@yanked.chat
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
