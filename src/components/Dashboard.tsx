import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, FileText, CreditCard, Calendar, TrendingUp } from 'lucide-react';
import StatementCard from './StatementCard';
import UploadZone from './UploadZone';
import StatsCard from './StatsCard';

interface Statement {
  id: string;
  cardName: string;
  month: string;
  year: number;
  fileSize: string;
  uploadDate: Date;
}

const Dashboard: React.FC = () => {
  const [statements, setStatements] = useState<Statement[]>([
    { id: '1', cardName: 'Chase Sapphire', month: 'December', year: 2023, fileSize: '2.1 MB', uploadDate: new Date() },
    { id: '2', cardName: 'American Express Gold', month: 'December', year: 2023, fileSize: '1.8 MB', uploadDate: new Date() },
    { id: '3', cardName: 'Capital One Venture', month: 'November', year: 2023, fileSize: '2.3 MB', uploadDate: new Date() },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCard, setFilterCard] = useState('all');

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach((file, index) => {
      const newStatement: Statement = {
        id: Date.now().toString() + index,
        cardName: `New Card ${statements.length + index + 1}`,
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date(),
      };
      setStatements(prev => [...prev, newStatement]);
    });
  };

  const handleDownload = (id: string) => {
    const statement = statements.find(s => s.id === id);
    if (statement) {
      // Simulate download
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${statement.cardName}_${statement.month}_${statement.year}.pdf`;
      link.click();
    }
  };

  const filteredStatements = statements.filter(statement => {
    const matchesSearch = statement.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         statement.month.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCard === 'all' || statement.cardName.includes(filterCard);
    return matchesSearch && matchesFilter;
  });

  const uniqueCards = [...new Set(statements.map(s => s.cardName))];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Statements"
          value={statements.length}
          icon={FileText}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          description="PDF files managed"
        />
        <StatsCard
          title="Credit Cards"
          value={uniqueCards.length}
          icon={CreditCard}
          gradient="bg-gradient-to-br from-pink-500 to-pink-600"
        />
        <StatsCard
          title="This Month"
          value={statements.filter(s => s.month === new Date().toLocaleString('default', { month: 'long' })).length}
          icon={Calendar}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Total Size"
          value={`${statements.reduce((acc, s) => acc + parseFloat(s.fileSize), 0).toFixed(1)} MB`}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-green-500 to-green-600"
        />
      </div>

      {/* Upload Zone */}
      <UploadZone onFileUpload={handleFileUpload} />

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search statements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-purple-200 focus:border-purple-400"
          />
        </div>
        <Select value={filterCard} onValueChange={setFilterCard}>
          <SelectTrigger className="w-48 border-purple-200">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by card" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cards</SelectItem>
            {uniqueCards.map(card => (
              <SelectItem key={card} value={card}>{card}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Statements Grid - Centered */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full">
          {filteredStatements.map(statement => (
            <StatementCard
              key={statement.id}
              {...statement}
              onDownload={handleDownload}
            />
          ))}
        </div>
      </div>

      {filteredStatements.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No statements found</h3>
          <p className="text-gray-400">Upload some PDF statements to get started</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;