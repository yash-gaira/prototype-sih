"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CoinTransaction {
  id: string;
  amount: number;
  type: "earn" | "spend";
  description: string;
  date: string;
  balanceAfter: number;
}

interface CoinContextType {
  balance: number;
  transactions: CoinTransaction[];
  deductCoins: (amount: number, description: string) => boolean;
  addCoins: (amount: number, description: string) => void;
}

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export const CoinProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<number>(120);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const savedBalance = localStorage.getItem("medikiosk_coin_balance");
    const savedTransactions = localStorage.getItem("medikiosk_coin_transactions");
    
    if (savedBalance) {
      setBalance(parseInt(savedBalance, 10));
    } else {
      localStorage.setItem("medikiosk_coin_balance", "120");
    }

    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    } else {
      const initialTx: CoinTransaction = {
        id: Date.now().toString(),
        amount: 120,
        type: "earn",
        description: "Welcome Reward",
        date: new Date().toISOString(),
        balanceAfter: 120
      };
      setTransactions([initialTx]);
      localStorage.setItem("medikiosk_coin_transactions", JSON.stringify([initialTx]));
    }
    
    setIsLoaded(true);
  }, []);

  const deductCoins = (amount: number, description: string): boolean => {
    if (balance < amount) return false;
    
    const newBalance = balance - amount;
    const newTx: CoinTransaction = {
      id: Date.now().toString(),
      amount,
      type: "spend",
      description,
      date: new Date().toISOString(),
      balanceAfter: newBalance
    };
    
    const newTransactions = [newTx, ...transactions];
    
    setBalance(newBalance);
    setTransactions(newTransactions);
    
    localStorage.setItem("medikiosk_coin_balance", newBalance.toString());
    localStorage.setItem("medikiosk_coin_transactions", JSON.stringify(newTransactions));
    
    return true;
  };

  const addCoins = (amount: number, description: string) => {
    const newBalance = balance + amount;
    const newTx: CoinTransaction = {
      id: Date.now().toString(),
      amount,
      type: "earn",
      description,
      date: new Date().toISOString(),
      balanceAfter: newBalance
    };
    
    const newTransactions = [newTx, ...transactions];
    
    setBalance(newBalance);
    setTransactions(newTransactions);
    
    localStorage.setItem("medikiosk_coin_balance", newBalance.toString());
    localStorage.setItem("medikiosk_coin_transactions", JSON.stringify(newTransactions));
  };

  return (
    <CoinContext.Provider value={{ balance, transactions, deductCoins, addCoins }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoins = () => {
  const context = useContext(CoinContext);
  if (context === undefined) {
    throw new Error("useCoins must be used within a CoinProvider");
  }
  return context;
};
