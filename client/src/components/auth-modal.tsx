import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import GoogleSignIn from "./google-signin";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle>Sign Up for Yanked.Chat</DialogTitle>
          <DialogDescription>
            Create your account to access premium features, unlimited downloads, and save your conversation history.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <GoogleSignIn onSuccess={handleSuccess} />
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </div>
      </DialogContent>
    </Dialog>
  );
}