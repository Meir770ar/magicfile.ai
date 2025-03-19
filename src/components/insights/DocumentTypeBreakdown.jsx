import React from 'react';
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { PieChart } from "lucide-react";

export default function DocumentTypeBreakdown({ documents, timePeriod, isLoading }) {
  const getDocumentTypesByMonth = () => {
    const now = new Date();
    const monthData = {};
    
    // Determine how many months to show based on time period
    let monthsToShow = 3;
    if (timePeriod === 'last7' || timePeriod === 'thisMonth') {
      monthsToShow = 1;
    } else if (timePeriod === 'last30') {
      monthsToShow = 2;
    } else if (timePeriod === 'last90') {
      monthsToShow = 4;
    }
    
    // Initialize empty data for past months
    for (let i = 0; i < monthsToShow; i++) {
      const monthDate = subMonths(now, i);
      const monthLabel = format(monthDate, 'MMM yyyy');
      
      monthData[monthLabel] = {
        month: monthLabel,
        receipt: 0,
        invoice: 0,
        contract: 0,
        id: 0,
        letter: 0,
        other: 0
      };
    }
    
    // Populate with actual data
    documents.forEach(doc => {
      const docDate = parseISO(doc.created_date);
      const monthLabel = format(docDate, 'MMM yyyy');
      
      // Only include if within our date range
      if (monthData[monthLabel]) {
        const docType = doc.type || 'other';
        monthData[monthLabel][docType] = (monthData[monthLabel][docType] || 0) + 1;
      }
    });
    
    // Convert to array and sort by date
    return Object.values(monthData).sort((a, b) => {
      return new Date(a.month) - new Date(b.month);
    });
  };
  
  // Document type colors
  const typeColors = {
    receipt: '#4CAF50',
    invoice: '#2196F3',
    contract: '#9C27B0',
    id: '#FF9800',
    letter: '#F44336',
    other: '#607D8B'
  };
  
  // Format type labels for display
  const formatTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Document Types Over Time</CardTitle>
          <PieChart className="h-4 w-4 text-gray-400" />
        </div>
        <CardDescription>
          Distribution of document types by month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getDocumentTypesByMonth()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(typeColors).map(type => (
                  <Bar 
                    key={type}
                    dataKey={type} 
                    name={formatTypeLabel(type)}
                    stackId="a" 
                    fill={typeColors[type]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}