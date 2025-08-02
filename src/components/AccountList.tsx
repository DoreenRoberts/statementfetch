import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, Download, Settings, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Account {
  id: string;
  card_name: string;
  bank_name: string;
  closing_date: number;
  statement_date: number;
  is_active: boolean;
  last_download_date: string | null;
}

interface AccountListProps {
  refreshTrigger: number;
}

const AccountList: React.FC<AccountListProps> = ({ refreshTrigger }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, [refreshTrigger]);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccount = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('credit_accounts')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      fetchAccounts();
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const deleteAccount = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;
    
    try {
      const { error } = await supabase
        .from('credit_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const getNextStatementDate = (statementDate: number) => {
    const now = new Date();
    const nextDate = new Date(now.getFullYear(), now.getMonth(), statementDate);
    if (nextDate <= now) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    return nextDate.toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center py-8">Loading accounts...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Your Credit Card Accounts</h3>
      
      {accounts.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No accounts added yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <Card key={account.id} className="bg-gradient-to-br from-white to-purple-50 border-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                    {account.card_name}
                  </CardTitle>
                  <Badge variant={account.is_active ? "default" : "secondary"}>
                    {account.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{account.bank_name}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Closes on {account.closing_date}th, Statement on {account.statement_date}th</span>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-600">Next Statement: </span>
                  <span className="font-medium">{getNextStatementDate(account.statement_date)}</span>
                </div>

                {account.last_download_date && (
                  <div className="text-sm">
                    <span className="text-gray-600">Last Download: </span>
                    <span className="font-medium">
                      {new Date(account.last_download_date).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleAccount(account.id, account.is_active)}
                    className="flex-1"
                  >
                    {account.is_active ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteAccount(account.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountList;