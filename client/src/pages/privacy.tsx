import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-privacy-title">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-privacy-subtitle">
              Last updated: August 30, 2025
            </p>
          </div>

          <Card className="mb-8" data-testid="card-privacy-content">
            <CardContent className="p-8 prose prose-gray max-w-none">
              <h2>1. Information We Collect</h2>
              
              <h3>Personal Information</h3>
              <ul>
                <li>Email address and name when you create an account</li>
                <li>Payment information processed securely through Stripe</li>
                <li>Usage data and analytics to improve our service</li>
              </ul>

              <h3>Conversation Data</h3>
              <ul>
                <li>URLs of conversations you submit for extraction</li>
                <li>Temporary processing of conversation content for extraction purposes</li>
                <li>No conversation content is permanently stored on our servers</li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <ul>
                <li>To provide and maintain our service</li>
                <li>To process payments and manage subscriptions</li>
                <li>To send service-related communications</li>
                <li>To improve our service and develop new features</li>
                <li>To detect and prevent fraud or abuse</li>
              </ul>

              <h2>3. Data Processing and Security</h2>
              <p>
                <strong>Conversation Privacy:</strong> All conversation data submitted for extraction is processed in memory only and is never written to persistent storage. Data is immediately deleted after processing and download completion.
              </p>
              
              <p>
                <strong>Security Measures:</strong> We implement industry-standard security measures including encryption in transit, secure API endpoints, and regular security audits.
              </p>

              <h2>4. Data Sharing and Disclosure</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties except:
              </p>
              <ul>
                <li>To comply with legal obligations</li>
                <li>To protect and defend our rights and property</li>
                <li>With your explicit consent</li>
                <li>With service providers who assist in operating our platform (under strict confidentiality agreements)</li>
              </ul>

              <h2>5. Third-Party Services</h2>
              <ul>
                <li><strong>Stripe:</strong> Payment processing (subject to Stripe's privacy policy)</li>
                <li><strong>Analytics:</strong> Anonymous usage statistics to improve our service</li>
              </ul>

              <h2>6. Data Retention</h2>
              <ul>
                <li>Account information: Retained while your account is active</li>
                <li>Conversation data: Immediately deleted after processing</li>
                <li>Payment records: Retained as required by law</li>
                <li>Analytics data: Anonymized and aggregated</li>
              </ul>

              <h2>7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and associated data</li>
                <li>Export your data</li>
                <li>Object to processing of your data</li>
              </ul>

              <h2>8. Cookies and Tracking</h2>
              <p>
                We use essential cookies for authentication and service functionality. We do not use tracking cookies for advertising purposes.
              </p>

              <h2>9. International Data Transfers</h2>
              <p>
                Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers.
              </p>

              <h2>10. Children's Privacy</h2>
              <p>
                Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </p>

              <h2>11. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any material changes by email or through our service.
              </p>

              <h2>12. Contact Us</h2>
              <p>
                If you have questions about this privacy policy or our data practices, please contact us at:
              </p>
              <ul>
                <li>Email: privacy@yanked.chat</li>
                <li>Address: InTellMe AI, www.intellmeai.com</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
