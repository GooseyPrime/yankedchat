import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import AuthModal from "./auth-modal";
import { User as UserIcon, LogOut, Crown, Star, Gift, Sparkles } from "lucide-react";

export default function UserStatus() {
  const { user, logoutMutation } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (user) {
    return (
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Welcome back, {user.username}!
                  {user.plan === 'premium' && (
                    <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  {user.plan === 'free' && (
                    <Badge variant="outline">
                      <Star className="w-3 h-3 mr-1" />
                      Free
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {user.plan === 'premium' ? (
                    "Unlimited extractions, priority support, and PDF exports"
                  ) : (
                    "5 free extractions remaining this month"
                  )}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardHeader>
        {user.plan === 'free' && (
          <CardContent className="pt-0">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-2 text-sm">
                <Gift className="w-4 h-4 text-orange-600" />
                <span className="text-orange-700 dark:text-orange-300">
                  Upgrade for unlimited downloads and premium features
                </span>
              </div>
              <Button size="sm" className="flame-gradient text-white">
                Upgrade to Premium
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <Sparkles className="w-6 h-6" />
            Unlock Premium Features
          </CardTitle>
          <CardDescription>
            Sign up to access unlimited downloads, premium export formats, and save your conversation history
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-muted/50 rounded-lg border-2 border-orange-200 dark:border-orange-800">
              <Gift className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium">Free Plan</p>
              <p className="text-xs text-muted-foreground">5 downloads/month</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg border-2 border-orange-300 dark:border-orange-700">
              <Crown className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium">Premium Plan</p>
              <p className="text-xs text-muted-foreground">Unlimited + PDF exports</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="flame-gradient text-white w-full"
            data-testid="button-sign-up"
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Sign Up with Google - Free Account
          </Button>
        </CardContent>
      </Card>
      
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
}