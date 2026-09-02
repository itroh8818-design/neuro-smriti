"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Users,
  Activity,
  Heart,
  Brain,
  TrendingUp,
  AlertTriangle,
  Clock,
  Stethoscope,
  Pill,
  Thermometer,
  Droplets,
  Shield,
  Gamepad2,
  Star,
  Trophy,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useRouter } from "next/navigation";
import {
  getMockPatients,
  getMockCognitiveScores,
  getMockGameSessions,
  getMockAlerts,
  PatientData,
} from "@/lib/firebase";
import {
  getAllGameStats,
  getAccuracy,
  DIFFICULTY_LEVELS,
  type AllGameStats,
} from "@/lib/game-utils";

export default function DashboardPage() {
  const patients = getMockPatients();
  const [selected, setSelected] = useState<PatientData>(patients[0]);
  const router = useRouter();
  const [gameStats, setGameStats] = useState<AllGameStats | null>(null);
  const { t } = useLanguage();

  // Load real game stats from localStorage
  useEffect(() => {
    const stats = getAllGameStats(selected.id);
    setGameStats(stats);
  }, [selected.id]);

  const scores = getMockCognitiveScores().filter(
    (s) => s.userId === selected.id
  );
  const sessions = getMockGameSessions().filter(
    (s) => s.userId === selected.id
  );
  const alerts = getMockAlerts();

  // Mock vital signs for the selected patient
  const vitals = {
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 98.6,
    oxygenLevel: 98,
    lastChecked: "2 hours ago",
  };

  const medications = [
    { name: "Donepezil", time: "8:00 AM", taken: true },
    { name: "Memantine", time: "2:00 PM", taken: false },
    { name: "Vitamin D", time: "8:00 AM", taken: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img src="/logo-icon.jpeg" alt="NeuroSmriti" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800">{t("appName")}</h1>
                <p className="text-xs text-gray-500">{t("caretakerDashboard")}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">              <div className="flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-full">
                <Shield className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-700">{t("caretaker")}</span>
            </div>
            <select
              value={selected.id}
              onChange={(e) =>
                setSelected(patients.find((p) => p.id === e.target.value)!)
              }
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Patient Info Card */}
        <Card className="mb-6 border-0 shadow-md bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-3 border-white/30">
                  <AvatarFallback className="bg-white/20 text-2xl">
                    {selected.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{selected.name}</h2>
                  <p className="text-emerald-100">{t("age")}: {selected.age} years</p>
                  <p className="text-emerald-100 text-sm">
                    Last active: {formatTimeAgo(selected.lastActive)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{selected.overallScore}%</div>
                <p className="text-emerald-100">{t("cognitiveScore")}</p>
                <Badge className="mt-2 bg-white/20 text-white border-0">
                  {selected.streak} {t("dayStreak")} 🔥
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vital Signs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 mx-auto text-red-500 mb-2" />
              <p className="text-xl font-bold text-gray-800">{vitals.heartRate}</p>
              <p className="text-xs text-gray-500">Heart Rate</p>
              <p className="text-xs text-green-500 mt-1">Normal</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Activity className="h-6 w-6 mx-auto text-blue-500 mb-2" />
              <p className="text-xl font-bold text-gray-800">{vitals.bloodPressure}</p>
              <p className="text-xs text-gray-500">Blood Pressure</p>
              <p className="text-xs text-green-500 mt-1">Normal</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Thermometer className="h-6 w-6 mx-auto text-orange-500 mb-2" />
              <p className="text-xl font-bold text-gray-800">{vitals.temperature}°F</p>
              <p className="text-xs text-gray-500">Temperature</p>
              <p className="text-xs text-green-500 mt-1">Normal</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Droplets className="h-6 w-6 mx-auto text-cyan-500 mb-2" />
              <p className="text-xl font-bold text-gray-800">{vitals.oxygenLevel}%</p>
              <p className="text-xs text-gray-500">Oxygen Level</p>
              <p className="text-xs text-green-500 mt-1">Normal</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto text-purple-500 mb-2" />
              <p className="text-sm font-bold text-gray-800">{vitals.lastChecked}</p>
              <p className="text-xs text-gray-500">Last Checked</p>
              <p className="text-xs text-blue-500 mt-1">View History</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="overview">📊 Overview</TabsTrigger>
            <TabsTrigger value="health">💊 Health</TabsTrigger>
            <TabsTrigger value="progress">📈 Progress</TabsTrigger>
            <TabsTrigger value="alerts">🔔 Alerts</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Cognitive Progress */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    Cognitive Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["Memory", "Attention", "Pattern", "Routine", "Emotional"].map(
                    (domain, i) => {
                      const values = [72, 65, 78, 80, 70];
                      return (
                        <div key={domain} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{domain}</span>
                            <span className="text-muted-foreground">
                              {values[i]}%
                            </span>
                          </div>
                          <Progress value={values[i]} className="h-2" />
                        </div>
                      );
                    }
                  )}
                </CardContent>
              </Card>

              {/* Medications */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Pill className="h-4 w-4 text-blue-500" />
                    Medications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {medications.map((med) => (
                    <div
                      key={med.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          med.taken ? "bg-green-100" : "bg-orange-100"
                        }`}>
                          <Pill className={`h-4 w-4 ${
                            med.taken ? "text-green-600" : "text-orange-600"
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{med.name}</p>
                          <p className="text-xs text-gray-500">{med.time}</p>
                        </div>
                      </div>
                      <Badge variant={med.taken ? "default" : "secondary"}>
                        {med.taken ? "✓ Taken" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    <Pill className="mr-2 h-4 w-4" />
                    Add Medication
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Game Statistics */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4 text-emerald-500" />
                  Game Performance (Live Data)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gameStats ? (
                  <div className="space-y-4">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-emerald-50 text-center">
                        <Trophy className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
                        <p className="text-lg font-bold text-emerald-700">
                          {Object.values(gameStats).reduce((sum, g) => sum + g.gamesPlayed, 0)}
                        </p>
                        <p className="text-xs text-emerald-600">Total Games</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50 text-center">
                        <Star className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                        <p className="text-lg font-bold text-blue-700">
                          {Math.max(...Object.values(gameStats).map(g => g.unlockedLevel))}
                        </p>
                        <p className="text-xs text-blue-600">Max Level</p>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-50 text-center">
                        <Brain className="h-5 w-5 mx-auto text-purple-500 mb-1" />
                        <p className="text-lg font-bold text-purple-700">
                          {(() => {
                            const total = Object.values(gameStats).reduce((sum, g) => sum + g.totalCorrect, 0);
                            const attempts = Object.values(gameStats).reduce((sum, g) => sum + g.totalAttempts, 0);
                            return attempts > 0 ? Math.round((total / attempts) * 100) : 0;
                          })()}%
                        </p>
                        <p className="text-xs text-purple-600">Accuracy</p>
                      </div>
                    </div>
                    
                    {/* Per-game stats */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {([
                        { key: "memory_match" as const, name: "Memory Match", icon: "🃏" },
                        { key: "pattern_recognition" as const, name: "Pattern Recall", icon: "🎯" },
                        { key: "daily_routine" as const, name: "Daily Routine", icon: "📋" },
                        { key: "object_recognition" as const, name: "Object ID", icon: "🔍" },
                        { key: "attention_focus" as const, name: "Focus Test", icon: "🧩" },
                        { key: "emotional_engagement" as const, name: "Emotion Match", icon: "😊" },
                      ]).map((game) => {
                        const stats = gameStats[game.key];
                        const accuracy = getAccuracy(stats);
                        const levelConfig = DIFFICULTY_LEVELS[Math.min(stats.currentLevel - 1, 4)];
                        return (
                          <div
                            key={game.name}
                            className="p-3 rounded-lg border border-gray-100 hover:border-emerald-200 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-lg">{game.icon}</span>
                              <Badge className={`text-xs ${levelConfig.color}`}>
                                <Star className="h-3 w-3 mr-1" />
                                {levelConfig.name}
                              </Badge>
                            </div>
                            <p className="font-medium text-gray-800 text-sm">{game.name}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-lg font-bold">{accuracy}%</span>
                              <span className="text-xs text-gray-400">
                                {stats.gamesPlayed} games played
                              </span>
                            </div>
                            <Progress value={accuracy} className="mt-2 h-1.5" />
                            {stats.gamesPlayed > 0 && (
                              <p className="text-[10px] text-gray-400 mt-1.5">
                                {stats.totalCorrect}/{stats.totalAttempts} correct • Level {stats.currentLevel}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-gray-400">
                    <p>Loading game stats...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* HEALTH TAB */}
          <TabsContent value="health" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Health Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-green-50">
                      <p className="text-sm text-green-600 font-medium">Overall Health</p>
                      <p className="text-2xl font-bold text-green-700">Good</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50">
                      <p className="text-sm text-blue-600 font-medium">Sleep Quality</p>
                      <p className="text-2xl font-bold text-blue-700">7.5h</p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50">
                      <p className="text-sm text-purple-600 font-medium">Hydration</p>
                      <p className="text-2xl font-bold text-purple-700">6/8 cups</p>
                    </div>
                    <div className="p-4 rounded-lg bg-orange-50">
                      <p className="text-sm text-orange-600 font-medium">Nutrition</p>
                      <p className="text-2xl font-bold text-orange-700">3 meals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Recent Observations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { note: "Patient showed improved memory recall during morning session", time: "10:30 AM", type: "positive" },
                    { note: "Slight confusion observed after lunch", time: "2:15 PM", type: "concern" },
                    { note: "Completed all daily activities independently", time: "6:00 PM", type: "positive" },
                  ].map((obs, i) => (
                    <div key={i} className={`p-3 rounded-lg ${
                      obs.type === "positive" ? "bg-green-50" : "bg-yellow-50"
                    }`}>
                      <p className="text-sm text-gray-700">{obs.note}</p>
                      <p className="text-xs text-gray-500 mt-1">{obs.time}</p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    Add Observation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PROGRESS TAB */}
          <TabsContent value="progress">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Detailed Cognitive Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {["Memory", "Attention", "Pattern", "Routine", "Emotional", "Language"].map(
                    (domain, i) => {
                      const values = [72, 65, 78, 80, 70, 68];
                      const trends = ["↑", "→", "↑", "↑", "↓", "→"];
                      const trendColors = ["text-green-500", "text-gray-500", "text-green-500", "text-green-500", "text-red-500", "text-gray-500"];
                      return (
                        <Card key={domain} className="border border-gray-100">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-muted-foreground">
                                {domain}
                              </span>
                              <span className={`text-lg font-bold ${trendColors[i]}`}>
                                {trends[i]}
                              </span>
                            </div>
                            <div className="text-3xl font-bold mb-3">
                              {values[i]}%
                            </div>
                            <Progress value={values[i]} className="h-2" />
                          </CardContent>
                        </Card>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ALERTS TAB */}
          <TabsContent value="alerts">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  All Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-4 hover:border-orange-200 transition-colors">
                      <Badge
                        variant={
                          alert.severity === "critical"
                            ? "destructive"
                            : alert.severity === "warning"
                              ? "secondary"
                              : "outline"
                        }
                        className="mt-0.5 shrink-0"
                      >
                        {alert.severity}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(alert.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* ── Helpers ──────────────────────────────────── */

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
