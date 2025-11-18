"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";

interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  profileImageUrl?: string;
  walletBalance: number;
  bankAccount?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    verified: boolean;
  };
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Account form state
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();

        if (data.user) {
          setUser(data.user);
          setFullName(data.user.fullName || "");
          setProfileImageUrl(data.user.profileImageUrl || "");

          if (data.user.bankAccount) {
            setAccountName(data.user.bankAccount.accountName);
            setAccountNumber(data.user.bankAccount.accountNumber);
            setBankName(data.user.bankAccount.bankName);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, profileImageUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);

        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setSaveLoading(true);

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (res.ok) {
        toast.success("Password changed successfully");

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to change password");
      }
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountName || !accountNumber || !bankName || !bankCode) {
      toast.error("Please fill all fields");
      return;
    }

    setSaveLoading(true);

    try {
      const res = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountName,
          accountNumber,
          bankName,
          bankCode,
        }),
      });

      if (res.ok) {
        toast.success("Bank account added successfully");

        const userRes = await fetch("/api/user/profile");
        const userData = await userRes.json();
        if (userData.user) {
          setUser(userData.user);
        }
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add account");
      }
    } catch (error) {
      toast.error("Failed to add account");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="account">Bank Account</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Edit Profile
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email (Read-only)
                  </label>
                  <Input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Profile Image URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={profileImageUrl}
                    onChange={(e) => setProfileImageUrl(e.target.value)}
                  />
                </div>

                {profileImageUrl && (
                  <div className="mt-4">
                    <img
                      src={profileImageUrl || "/placeholder.svg"}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={saveLoading}>
                  {saveLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Change Password
              </h2>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter new password (min. 8 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={saveLoading}>
                  {saveLoading ? "Updating..." : "Change Password"}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Bank Account
              </h2>

              {user?.bankAccount?.verified ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-800 text-sm font-semibold">
                      Account Verified
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-card p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Account Name
                      </p>
                      <p className="text-foreground font-semibold">
                        {user.bankAccount.accountName}
                      </p>
                    </div>

                    <div className="bg-card p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Account Number
                      </p>
                      <p className="text-foreground font-semibold">
                        {user.bankAccount.accountNumber}
                      </p>
                    </div>

                    <div className="bg-card p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Bank Name</p>
                      <p className="text-foreground font-semibold">
                        {user.bankAccount.bankName}
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Update Account
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleAddAccount} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Account Name
                    </label>
                    <Input
                      placeholder="Enter account holder name"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Account Number
                    </label>
                    <Input
                      placeholder="Enter account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Bank Name
                    </label>
                    <Input
                      placeholder="Enter bank name"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Bank Code
                    </label>
                    {/* <Input
                      placeholder="Enter bank code"
                      value={bankCode}
                      onChange={(e) => setBankCode(e.target.value)}
                    /> */}
                      <Select
                        onValueChange={(value) => setBankCode(value)}
                        value={bankCode}
                      >
                        <SelectTrigger >
                          <SelectValue placeholder="Select a bank" />
                          <SelectContent>
                            <SelectItem value="001">Access Bank</SelectItem>
                            <SelectItem value="044">GTBank</SelectItem>
                            <SelectItem value="057">Zenith Bank</SelectItem>
                            <SelectItem value="011">First Bank</SelectItem>
                            <SelectItem value="058">Union Bank</SelectItem>
                            <SelectItem value="232">Wema Bank</SelectItem>
                            <SelectItem value="033">Ecobank</SelectItem>
                            <SelectItem value="214">Sterling Bank</SelectItem>
                            <SelectItem value="035">Fidelity Bank</SelectItem>
                            <SelectItem value="070">Stanbic IBTC Bank</SelectItem>
                            </SelectContent>
                            {/* Add more banks as needed */}
                        </SelectTrigger>
                      </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={saveLoading}
                  >
                    {saveLoading ? "Adding..." : "Add Bank Account"}
                  </Button>
                </form>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
