/**
 * Firebase Configuration for Caregiver Dashboard
 */
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (only on client side)
let app: any = null;
let db: any = null;
let auth: any = null;

if (typeof window !== 'undefined') {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, db, auth };

// Auth helpers
export const loginWithEmail = async (email: string, password: string) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await signInWithEmailAndPassword(auth, email, password);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};

// Data fetching helpers
export interface PatientData {
  id: string;
  name: string;
  age: number;
  lastActive: string;
  overallScore: number;
  gamesPlayed: number;
  streak: number;
}

export interface GameSession {
  id: string;
  userId: string;
  gameType: string;
  difficulty: string;
  score: number;
  maxScore: number;
  accuracy: number;
  responseTimeMs: number;
  durationMs: number;
  completed: boolean;
  createdAt: string;
}

export interface CognitiveScore {
  userId: string;
  date: string;
  memory: number;
  attention: number;
  pattern: number;
  routine: number;
  objectRec: number;
  emotional: number;
  overall: number;
}

export interface Alert {
  id: string;
  type: 'low_performance' | 'missed_reminder' | 'inactivity';
  message: string;
  severity: 'warning' | 'critical';
  timestamp: string;
}

// Mock data for demo (replace with Firebase queries in production)
export const getMockPatients = (): PatientData[] => [
  {
    id: 'patient_1',
    name: 'Kamala Devi',
    age: 72,
    lastActive: '2026-08-31T08:30:00Z',
    overallScore: 72,
    gamesPlayed: 45,
    streak: 7,
  },
  {
    id: 'patient_2',
    name: 'Ramesh Kalita',
    age: 68,
    lastActive: '2026-08-30T16:45:00Z',
    overallScore: 58,
    gamesPlayed: 23,
    streak: 3,
  },
  {
    id: 'patient_3',
    name: 'Priya Boro',
    age: 75,
    lastActive: '2026-08-31T09:15:00Z',
    overallScore: 81,
    gamesPlayed: 67,
    streak: 12,
  },
];

export const getMockGameSessions = (): GameSession[] => {
  const sessions: GameSession[] = [];
  const gameTypes = ['memory_match', 'pattern_recognition', 'daily_routine', 'object_recognition', 'attention_focus', 'emotional_engagement'];
  const difficulties = ['easy', 'medium', 'hard'];

  for (let i = 0; i < 50; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 14));

    sessions.push({
      id: `session_${i}`,
      userId: `patient_${Math.floor(Math.random() * 3) + 1}`,
      gameType: gameTypes[Math.floor(Math.random() * gameTypes.length)],
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      score: Math.floor(Math.random() * 100) + 20,
      maxScore: 100,
      accuracy: Math.floor(Math.random() * 60) + 40,
      responseTimeMs: Math.floor(Math.random() * 5000) + 1000,
      durationMs: Math.floor(Math.random() * 120000) + 30000,
      completed: Math.random() > 0.2,
      createdAt: date.toISOString(),
    });
  }

  return sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getMockCognitiveScores = (): CognitiveScore[] => {
  const scores: CognitiveScore[] = [];

  for (let d = 13; d >= 0; d--) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split('T')[0];

    for (let p = 1; p <= 3; p++) {
      const baseScore = 50 + Math.random() * 30;
      scores.push({
        userId: `patient_${p}`,
        date: dateStr,
        memory: Math.min(100, baseScore + Math.random() * 20 - 10),
        attention: Math.min(100, baseScore + Math.random() * 20 - 10),
        pattern: Math.min(100, baseScore + Math.random() * 20 - 10),
        routine: Math.min(100, baseScore + Math.random() * 20 - 10),
        objectRec: Math.min(100, baseScore + Math.random() * 20 - 10),
        emotional: Math.min(100, baseScore + Math.random() * 20 - 10),
        overall: Math.min(100, baseScore),
      });
    }
  }

  return scores;
};

export const getMockAlerts = (): Alert[] => [
  {
    id: 'alert_1',
    type: 'low_performance',
    message: 'Kamala Devi scored below 40% in Memory Match today',
    severity: 'warning',
    timestamp: '2026-08-31T10:30:00Z',
  },
  {
    id: 'alert_2',
    type: 'missed_reminder',
    message: 'Ramesh Kalita missed evening medicine reminder',
    severity: 'critical',
    timestamp: '2026-08-31T20:15:00Z',
  },
  {
    id: 'alert_3',
    type: 'inactivity',
    message: 'Priya Boro has not played any games for 2 days',
    severity: 'warning',
    timestamp: '2026-08-30T12:00:00Z',
  },
];
