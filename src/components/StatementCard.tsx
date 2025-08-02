import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calendar, CreditCard } from 'lucide-react';

interface StatementCardProps {
  id: string;
  cardName: string;
  month: string;
  year: number;
  fileSize: string;
  downloadUrl?: string;
  onDownload: (id: string) => void;
}

const StatementCard: React.FC<StatementCardProps> = ({
  id,
  cardName,
  month,
  year,
  fileSize,
  onDownload
}) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50 hover:from-purple-50 hover:to-pink-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
              {cardName}
            </span>
          </div>
          <FileText className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{month} {year}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {fileSize}
          </span>
          <Button
            onClick={() => onDownload(id)}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatementCard;