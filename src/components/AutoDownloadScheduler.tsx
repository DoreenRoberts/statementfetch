import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Schedule {
  id: string;
  account_id: string;
  next_download_date: string;
  is_enabled: boolean;
  last_success: string | null;
  error_message: string | null;
  card_name: string;
  bank_name: string;
}

const AutoDownloadScheduler: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('download_schedules')
        .select(`
          *,
          credit_accounts (card_name, bank_name)
        `)
        .order('next_download_date', { ascending: true });

      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        ...item,
        card_name: item.credit_accounts?.card_name || 'Unknown',
        bank_name: item.credit_accounts?.bank_name || 'Unknown'
      })) || [];
      
      setSchedules(formattedData);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSchedule = async (id: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('download_schedules')
        .update({ is_enabled: !enabled })
        .eq('id', id);

      if (error) throw error;
      fetchSchedules();
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const createSchedulesForAllAccounts = async () => {
    try {
      // Get all active accounts without schedules
      const { data: accounts, error: accountsError } = await supabase
        .from('credit_accounts')
        .select('*')
        .eq('is_active', true);

      if (accountsError) throw accountsError;

      for (const account of accounts || []) {
        // Check if schedule already exists
        const { data: existingSchedule } = await supabase
          .from('download_schedules')
          .select('id')
          .eq('account_id', account.id)
          .single();

        if (!existingSchedule) {
          // Calculate next download date based on statement date
          const now = new Date();
          const nextDate = new Date(now.getFullYear(), now.getMonth(), account.statement_date);
          if (nextDate <= now) {
            nextDate.setMonth(nextDate.getMonth() + 1);
          }

          const { error: scheduleError } = await supabase
            .from('download_schedules')
            .insert({
              account_id: account.id,
              next_download_date: nextDate.toISOString(),
              is_enabled: true
            });

          if (scheduleError) throw scheduleError;
        }
      }

      fetchSchedules();
    } catch (error) {
      console.error('Error creating schedules:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading schedules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Auto-Download Schedules</h3>
        <Button 
          onClick={createSchedulesForAllAccounts}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Clock className="h-4 w-4 mr-2" />
          Create Schedules
        </Button>
      </div>

      {schedules.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No download schedules created yet</p>
            <p className="text-sm text-gray-400">
              Click "Create Schedules" to automatically schedule downloads for all your active accounts
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Download className="h-5 w-5 mr-2 text-blue-600" />
                    {schedule.card_name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={schedule.is_enabled}
                      onCheckedChange={() => toggleSchedule(schedule.id, schedule.is_enabled)}
                    />
                    <Badge variant={schedule.is_enabled ? "default" : "secondary"}>
                      {schedule.is_enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{schedule.bank_name}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Next Download: </span>
                  <span className="font-medium ml-1">
                    {new Date(schedule.next_download_date).toLocaleDateString()}
                  </span>
                </div>

                {schedule.last_success && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Last Success: {new Date(schedule.last_success).toLocaleDateString()}</span>
                  </div>
                )}

                {schedule.error_message && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="truncate">{schedule.error_message}</span>
                  </div>
                )}

                <div className="pt-2">
                  <Badge variant="outline" className="text-xs">
                    {schedule.is_enabled ? 'Auto-download active' : 'Auto-download paused'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoDownloadScheduler;