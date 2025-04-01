
import React from "react";
import { Badge } from "@/components/ui/badge";

interface TransactionTypeProps {
  type: string;
}

const TransactionType: React.FC<TransactionTypeProps> = ({ type }) => {
  if (type === 'income') {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
        Receita
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
      Despesa
    </Badge>
  );
};

export default TransactionType;
