'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { Navbar } from '@/components/navbar';
import { api } from '@/lib/api';

interface DailyEntry {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealsCount: number;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const loadCalendarData = useCallback(async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const mockEntries: DailyEntry[] = [
        { date: `${year}-${month + 1}-1`, calories: 1950, protein: 110, carbs: 220, fat: 75, mealsCount: 4 },
        { date: `${year}-${month + 1}-2`, calories: 2100, protein: 120, carbs: 230, fat: 80, mealsCount: 4 },
        { date: `${year}-${month + 1}-3`, calories: 1850, protein: 105, carbs: 215, fat: 70, mealsCount: 3 },
        { date: `${year}-${month + 1}-5`, calories: 2000, protein: 115, carbs: 225, fat: 78, mealsCount: 4 },
        { date: `${year}-${month + 1}-8`, calories: 1750, protein: 100, carbs: 210, fat: 65, mealsCount: 3 },
        { date: `${year}-${month + 1}-10`, calories: 2200, protein: 125, carbs: 240, fat: 85, mealsCount: 5 },
        { date: `${year}-${month + 1}-12`, calories: 1900, protein: 108, carbs: 218, fat: 72, mealsCount: 4 },
        { date: `${year}-${month + 1}-15`, calories: 2050, protein: 118, carbs: 228, fat: 79, mealsCount: 4 },
        { date: `${year}-${month + 1}-17`, calories: 1800, protein: 102, carbs: 212, fat: 68, mealsCount: 3 },
        { date: `${year}-${month + 1}-19`, calories: 2150, protein: 122, carbs: 235, fat: 82, mealsCount: 5 },
        { date: `${year}-${month + 1}-22`, calories: 1920, protein: 110, carbs: 220, fat: 74, mealsCount: 4 },
        { date: `${year}-${month + 1}-25`, calories: 1980, protein: 112, carbs: 222, fat: 76, mealsCount: 4 },
        { date: `${year}-${month + 1}-28`, calories: 1720, protein: 98, carbs: 208, fat: 64, mealsCount: 3 },
      ];

      const entriesMap: Record<string, DailyEntry> = {};
      mockEntries.forEach(entry => {
        entriesMap[entry.date] = entry;
      });

      setEntries(entriesMap);
    } catch (error) {
      console.error('Failed to load calendar data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  const getDayEntry = (day: number) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
    return entries[dateKey];
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getDailyStatus = (entry: DailyEntry) => {
    const targetCalories = 2000;
    const percentage = (entry.calories / targetCalories) * 100;
    
    if (percentage >= 90 && percentage <= 110) {
      return { status: 'perfect', color: 'bg-green-500', border: 'border-green-300' };
    } else if (percentage >= 80 && percentage <= 120) {
      return { status: 'good', color: 'bg-blue-500', border: 'border-blue-300' };
    } else if (percentage >= 60 && percentage <= 140) {
      return { status: 'fair', color: 'bg-yellow-500', border: 'border-yellow-300' };
    } else if (percentage > 0) {
      return { status: 'poor', color: 'bg-orange-500', border: 'border-orange-300' };
    }
    return { status: 'none', color: 'bg-gray-100', border: 'border-gray-200' };
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 md:h-32 rounded-xl"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const entry = getDayEntry(day);
      const today = isToday(day);
      const isSelected = selectedDate === `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
      const status = entry ? getDailyStatus(entry) : { status: 'none', color: 'bg-gray-50', border: 'border-gray-200' };

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`)}
          className={`
            h-24 md:h-32 rounded-xl p-2 border-2 cursor-pointer
            transition-all hover:shadow-lg
            ${status.border}
            ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
            ${today ? 'bg-purple-50' : status.color}
          `}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`
              text-sm font-bold
              ${today ? 'text-purple-700' : entry ? 'text-white' : 'text-gray-700'}
            `}>
              {day}
            </span>
            {today && <span className="text-xs text-purple-600">Today</span>}
          </div>

          {entry && (
            <div className="text-white/90 text-xs space-y-0.5">
              <div className="font-semibold">{entry.calories} kcal</div>
              <div className="opacity-90">P: {entry.protein}g</div>
              <div className="opacity-90">C: {entry.carbs}g</div>
              <div className="opacity-90">F: {entry.fat}g</div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const selectedEntry = selectedDate ? entries[selectedDate] : null;

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Nutrition Calendar
            </h1>
            <p className="text-xl text-gray-600">
              Track your nutrition history
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setCurrentDate(newDate);
                  setSelectedDate(null);
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
              >
                ← Previous
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setCurrentDate(newDate);
                  setSelectedDate(null);
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
              >
                Next →
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span className="text-gray-700">Perfect (90-110%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500"></div>
                <span className="text-gray-700">Good (80-120%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500"></div>
                <span className="text-gray-700">Fair (60-140%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-500"></div>
                <span className="text-gray-700">Needs Attention</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-bold text-gray-600 text-sm py-2">
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>
          </div>

          {selectedEntry && selectedDate && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{selectedEntry.calories}</div>
                  <div className="text-gray-600 text-sm">Calories</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200">
                  <div className="text-2xl font-bold text-red-600">{selectedEntry.protein}g</div>
                  <div className="text-gray-600 text-sm">Protein</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">{selectedEntry.carbs}g</div>
                  <div className="text-gray-600 text-sm">Carbs</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{selectedEntry.fat}g</div>
                  <div className="text-gray-600 text-sm">Fat</div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-gray-600">
                  <span className="font-semibold text-gray-900">{selectedEntry.mealsCount}</span> meals logged
                </div>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Monthly Statistics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {Object.keys(entries).length}
                </div>
                <div className="text-gray-600 font-medium">Days Logged</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {Object.entries(entries).filter(([_, entry]) => {
                    const percentage = (entry.calories / 2000) * 100;
                    return percentage >= 90 && percentage <= 110;
                  }).length}
                </div>
                <div className="text-gray-600 font-medium">Perfect Days</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {Object.entries(entries).length > 0
                    ? Math.round(
                        Object.entries(entries).reduce((sum, [_, entry]) => sum + entry.calories, 0) /
                          Object.entries(entries).length
                      )
                    : 0}
                </div>
                <div className="text-gray-600 font-medium">Avg Calories</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mt-8 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              💡 Tips
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Click on any day to see detailed nutrition information</li>
              <li>• Use navigation buttons to switch between months</li>
              <li>• Colors indicate how well you stayed within your targets</li>
              <li>• Aim for green days (90-110% of target calories)</li>
            </ul>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
