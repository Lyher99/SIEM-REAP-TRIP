import { collection, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Place } from '../types';
import initialPlaces from '../data/places.json';

const PLACE_COLLECTION = 'places';

export const getPlaces = async (): Promise<Place[]> => {
  const querySnapshot = await getDocs(collection(db, PLACE_COLLECTION));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Place));
};

export const subscribeToPlaces = (callback: (places: Place[]) => void) => {
  return onSnapshot(collection(db, PLACE_COLLECTION), (snapshot) => {
    callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Place)));
  });
};

export const addPlace = async (place: Omit<Place, 'id'>) => {
  return addDoc(collection(db, PLACE_COLLECTION), place);
};

export const seedInitialData = async () => {
  const places = await getPlaces();
  if (places.length > 0) return;

  for (const placeData of initialPlaces) {
    const { id, ...data } = placeData;
    await addPlace(data as Omit<Place, 'id'>);
  }
};
