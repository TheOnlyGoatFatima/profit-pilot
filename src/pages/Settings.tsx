import { Settings as SettingsIcon } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences.</p>
      </div>

      <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-card text-center">
        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
          <SettingsIcon className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">Settings coming soon</h3>
        <p className="text-sm text-muted-foreground">We're working on bringing you account management, notifications, and more.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
