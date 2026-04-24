// lib/history.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface HistoryItem {
  id: string;
  userId: string;
  platform: string;
  niche: string;
  inspiration: string;
  youtubeLink?: string;
  hook: string;
  script: string;
  caption: string;
  hashtags: string;
  trendingTopic?: string;
  createdAt: Date;
}

export async function saveToHistory(
  userId: string,
  data: Omit<HistoryItem, 'id' | 'userId' | 'createdAt'>
) {
  const ref = collection(db, 'history');
  await addDoc(ref, {
    userId,
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getUserHistory(userId: string): Promise<HistoryItem[]> {
  const ref = collection(db, 'history');
  const q = query(ref, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate() || new Date(),
  })) as HistoryItem[];
}

export async function deleteHistoryItem(id: string) {
  await deleteDoc(doc(db, 'history', id));
}
