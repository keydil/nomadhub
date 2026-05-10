'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CustomerSmartQueue() {
  const [hasJoined, setHasJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [queueNumber, setQueueNumber] = useState(0);
  const [waitTime, setWaitTime] = useState(0);

  const handleJoinQueue = () => {
    setIsJoining(true);
    // Simulate API call and AI estimation
    setTimeout(() => {
      setQueueNumber(87);
      setWaitTime(24);
      setHasJoined(true);
      setIsJoining(false);
    }, 1500);
  };

  // Simulate wait time decreasing
  useEffect(() => {
    if (hasJoined && waitTime > 0) {
      const interval = setInterval(() => {
        setWaitTime(prev => Math.max(1, prev - 1)); // Decrement wait time every minute (mocking with 30s for demo)
      }, 30000); 
      return () => clearInterval(interval);
    }
  }, [hasJoined, waitTime]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-4">
          <span className="text-3xl">🍔</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Nomad Burger</h1>
        <p className="text-slate-500 mt-2">Currently serving Order #72</p>
      </div>

      {!hasJoined ? (
        <Card className="border-sky-100 shadow-lg shadow-sky-50">
          <CardContent className="p-8 text-center space-y-6">
            <div>
              <p className="text-sm font-medium text-sky-600 mb-1">AI ESTIMATED WAIT</p>
              <p className="text-4xl font-bold text-slate-800">~25 <span className="text-2xl text-slate-500">min</span></p>
            </div>
            
            <p className="text-slate-600">Join the digital queue now and we&apos;ll notify you when your food is ready.</p>
            
            <Button 
              size="lg" 
              fullWidth 
              onClick={handleJoinQueue}
              disabled={isJoining}
              className="text-lg relative overflow-hidden"
            >
              {isJoining ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </span>
              ) : 'Join Queue'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-emerald-100 shadow-lg shadow-emerald-50 bg-gradient-to-b from-white to-emerald-50/30">
          <CardContent className="p-8 text-center space-y-8">
            <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-2 tracking-wider">YOUR QUEUE NUMBER</p>
              <div className="inline-block bg-white px-8 py-4 rounded-3xl shadow-sm border border-slate-100">
                <p className="text-6xl font-black text-slate-900">#{queueNumber}</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-emerald-100">
              <p className="text-sm font-medium text-emerald-600 mb-1">AI ESTIMATED WAIT</p>
              <p className="text-3xl font-bold text-slate-800">{waitTime} <span className="text-xl text-slate-500">min</span></p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-emerald-400 animate-pulse-fast w-3/4 rounded-full"></div>
              </div>
            </div>

            <p className="text-slate-600 text-sm">
              Feel free to walk around. Keep this page open to track your order.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
