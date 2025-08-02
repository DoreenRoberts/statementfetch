import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, CreditCard, Calendar, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AccountSetupProps {
  onAccountAdded: () => void;
}

const AccountSetup: React.FC<AccountSetupProps> = ({ onAccountAdded }) => {
  const [formData, setFormData] = useState({
    cardName: '',
    bankName: '',
    loginUrl: '',
    username: '',
    password: '',
    closingDate: '',
    statementDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Encrypt credentials
      const { data: encryptedData, error: encryptError } = await supabase.functions.invoke('encrypt-credentials', {
        body: { 
          credentials: { username: formData.username, password: formData.password },
          action: 'encrypt'
        }
      });

      if (encryptError) throw encryptError;

      // Save account to database
      const { error: dbError } = await supabase
        .from('credit_accounts')
        .insert({
          card_name: formData.cardName,
          bank_name: formData.bankName,
          login_url: formData.loginUrl,
          closing_date: parseInt(formData.closingDate),
          statement_date: parseInt(formData.statementDate),
          encrypted_credentials: JSON.stringify(encryptedData)
        });

      if (dbError) throw dbError;

      // Reset form
      setFormData({
        cardName: '', bankName: '', loginUrl: '', username: '', 
        password: '', closingDate: '', statementDate: ''
      });
      
      onAccountAdded();
    } catch (error) {
      console.error('Error adding account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Add Credit Card Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cardName">Card Name</Label>
              <Input
                id="cardName"
                value={formData.cardName}
                onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                placeholder="Chase Sapphire Preferred"
                required
              />
            </div>
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                placeholder="Chase Bank"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="loginUrl">Login URL</Label>
            <Input
              id="loginUrl"
              type="url"
              value={formData.loginUrl}
              onChange={(e) => setFormData({...formData, loginUrl: e.target.value})}
              placeholder="https://secure.chase.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="closingDate">Closing Date (Day of Month)</Label>
              <Select value={formData.closingDate} onValueChange={(value) => setFormData({...formData, closingDate: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="statementDate">Statement Date (Day of Month)</Label>
              <Select value={formData.statementDate} onValueChange={(value) => setFormData({...formData, statementDate: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Lock className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">Secure Credentials</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username/Email</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Your login username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Your login password"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-yellow-700 mt-2">
              Credentials are encrypted and stored securely. They cannot be viewed after saving.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={isLoading}
          >
            {isLoading ? 'Adding Account...' : 'Add Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AccountSetup;