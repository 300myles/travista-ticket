"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface BankAccount {
  accountName: string;
  accountNumber: string;
  bankName: string;
  verified: boolean;
}

interface Withdrawal {
  _id: string;
  type: string;
  amount: number;
  status: "pending" | "successful" | "failed";
  reference: string;
  date: string;
}

export default function WithdrawPage() {
  const router = useRouter();

  const [walletBalance, setWalletBalance] = useState(0);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, accountRes, withdrawalsRes] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/account"),
          fetch("/api/withdraw"),
        ]);

        const profileData = await profileRes.json();
        const accountData = await accountRes.json();
        const withdrawalsData = await withdrawalsRes.json();

        if (profileData.user) {
          setWalletBalance(profileData.user.walletBalance);
        }

        if (accountData.account) {
          setBankAccount(accountData.account);
        }

        if (withdrawalsData.withdrawals) {
          setWithdrawals(withdrawalsData.withdrawals);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load wallet data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    // Modal form will be handled separately
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawalAmount || !bankCode) {
      toast.error("Please fill all fields");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseFloat(withdrawalAmount),
          bankCode,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Withdrawal initiated successfully");
        setWithdrawalAmount("");
        // Refresh withdrawals list
        const withdrawalsRes = await fetch("/api/withdraw");
        const withdrawalsData = await withdrawalsRes.json();
        if (withdrawalsData.withdrawals) {
          setWithdrawals(withdrawalsData.withdrawals);
        }
      } else {
        toast.error(data.error || "Failed to initiate withdrawal");
      }
    } catch (error) {
      toast.error("Failed to process withdrawal");
    } finally {
      setIsProcessing(false);
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Withdrawals
          </h1>
          <p className="text-muted-foreground">
            Manage your wallet and withdraw funds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Wallet Balance</p>
            <p className="text-2xl font-bold text-foreground">
              ₦{walletBalance.toLocaleString()}
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Account Status</p>
            <p
              className={`font-semibold ${
                bankAccount?.verified ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {bankAccount?.verified ? "Verified" : "Not Set"}
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">
              Recent Withdrawals
            </p>
            <p className="text-2xl font-bold text-foreground">
              {withdrawals.length}
            </p>
          </Card>
        </div>

        <Tabs defaultValue="withdraw" className="space-y-6">
          <TabsList>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="account">Bank Account</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="withdraw" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Request Withdrawal
              </h2>

              {!bankAccount?.verified ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800">
                    Please verify your bank account first to withdraw funds.
                  </p>
                  <Button onClick={() => router.push(`/dashboard/settings`)} className="mt-4">
                    Add Bank Account
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Amount (NGN)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Bank Code
                    </label>
                    <Input
                      placeholder="Enter bank code"
                      value={bankCode}
                      onChange={(e) => setBankCode(e.target.value)}
                    />
                  </div>

                  <div className="bg-card p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Account: {bankAccount?.accountName} -{" "}
                      {bankAccount?.accountNumber}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Request Withdrawal"}
                  </Button>
                </form>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Bank Account Details
              </h2>

              {bankAccount?.verified ? (
                <div className="space-y-3">
                  <div className="bg-card p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Account Name
                    </p>
                    <p className="text-foreground font-semibold">
                      {bankAccount.accountName}
                    </p>
                  </div>

                  <div className="bg-card p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Account Number
                    </p>
                    <p className="text-foreground font-semibold">
                      {bankAccount.accountNumber}
                    </p>
                  </div>

                  <div className="bg-card p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Bank Name</p>
                    <p className="text-foreground font-semibold">
                      {bankAccount.bankName}
                    </p>
                  </div>

                  <Button variant="outline" className="w-full">
                    Change Account
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No bank account added yet.
                </p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Withdrawal History
              </h2>

              {withdrawals.length === 0 ? (
                <p className="text-muted-foreground">No withdrawals yet</p>
              ) : (
                <div className="space-y-3">
                  {withdrawals.map((withdrawal) => (
                    <div
                      key={withdrawal._id}
                      className="flex justify-between items-center bg-card p-4 rounded-lg"
                    >
                      <div>
                        <p className="text-foreground font-semibold">
                          ₦{withdrawal.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {withdrawal.reference}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            withdrawal.status === "successful"
                              ? "bg-green-100 text-green-800"
                              : withdrawal.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {withdrawal.status}
                        </span>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(withdrawal.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
