import { useEffect, useState } from 'react';
import { collection, onSnapshot, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Vehicle, Lead, TestDriveReservation, UserAccount } from '../types';
import { INITIAL_VEHICLES, INITIAL_LEADS, INITIAL_RESERVATIONS, INITIAL_USERS } from '../data/mockData';

export function useFirestoreSync() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [reservations, setReservations] = useState<TestDriveReservation[]>(INITIAL_RESERVATIONS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [isSynced, setIsSynced] = useState<boolean>(false);

  useEffect(() => {
    // 1. Sync Vehicles
    const unsubVehicles = onSnapshot(
      collection(db, 'vehicles'),
      async (snapshot) => {
        if (snapshot.empty) {
          // Seed initial data if collection is empty
          for (const v of INITIAL_VEHICLES) {
            await setDoc(doc(db, 'vehicles', v.id), v);
          }
        } else {
          const list: Vehicle[] = snapshot.docs.map((doc) => doc.data() as Vehicle);
          setVehicles(list);
        }
        setIsSynced(true);
      },
      (err) => console.warn('Firestore vehicles sync error:', err)
    );

    // 2. Sync Leads
    const unsubLeads = onSnapshot(
      collection(db, 'leads'),
      async (snapshot) => {
        if (snapshot.empty) {
          for (const l of INITIAL_LEADS) {
            await setDoc(doc(db, 'leads', l.id), l);
          }
        } else {
          const list: Lead[] = snapshot.docs.map((doc) => doc.data() as Lead);
          setLeads(list);
        }
      },
      (err) => console.warn('Firestore leads sync error:', err)
    );

    // 3. Sync Reservations
    const unsubReservations = onSnapshot(
      collection(db, 'reservations'),
      async (snapshot) => {
        if (snapshot.empty) {
          for (const r of INITIAL_RESERVATIONS) {
            await setDoc(doc(db, 'reservations', r.id), r);
          }
        } else {
          const list: TestDriveReservation[] = snapshot.docs.map((doc) => doc.data() as TestDriveReservation);
          setReservations(list);
        }
      },
      (err) => console.warn('Firestore reservations sync error:', err)
    );

    // 4. Sync Users
    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      async (snapshot) => {
        if (snapshot.empty) {
          for (const u of INITIAL_USERS) {
            await setDoc(doc(db, 'users', u.id), u);
          }
        } else {
          const list: UserAccount[] = snapshot.docs.map((doc) => doc.data() as UserAccount);
          setUsers(list);
        }
      },
      (err) => console.warn('Firestore users sync error:', err)
    );

    return () => {
      unsubVehicles();
      unsubLeads();
      unsubReservations();
      unsubUsers();
    };
  }, []);

  // Helper functions to persist to Firestore
  const addVehicleFS = async (v: Vehicle) => {
    setVehicles((prev) => [v, ...prev]);
    try {
      await setDoc(doc(db, 'vehicles', v.id), v);
    } catch (err) {
      console.error('Error adding vehicle to Firestore:', err);
    }
  };

  const updateVehicleFS = async (updatedV: Vehicle) => {
    setVehicles((prev) => prev.map((v) => (v.id === updatedV.id ? updatedV : v)));
    try {
      await setDoc(doc(db, 'vehicles', updatedV.id), updatedV, { merge: true });
    } catch (err) {
      console.error('Error updating vehicle in Firestore:', err);
    }
  };

  const updateVehicleStatusFS = async (id: string, status: Vehicle['status']) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
    try {
      await updateDoc(doc(db, 'vehicles', id), { status });
    } catch (err) {
      console.error('Error updating vehicle status in Firestore:', err);
    }
  };

  const addLeadFS = async (l: Lead) => {
    setLeads((prev) => [l, ...prev]);
    try {
      await setDoc(doc(db, 'leads', l.id), l);
    } catch (err) {
      console.error('Error adding lead to Firestore:', err);
    }
  };

  const updateLeadStatusFS = async (id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await updateDoc(doc(db, 'leads', id), { status });
    } catch (err) {
      console.error('Error updating lead status in Firestore:', err);
    }
  };

  const addReservationFS = async (r: TestDriveReservation) => {
    setReservations((prev) => [r, ...prev]);
    try {
      await setDoc(doc(db, 'reservations', r.id), r);
    } catch (err) {
      console.error('Error adding reservation to Firestore:', err);
    }
  };

  const updateReservationStatusFS = async (id: string, status: TestDriveReservation['status']) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await updateDoc(doc(db, 'reservations', id), { status });
    } catch (err) {
      console.error('Error updating reservation status in Firestore:', err);
    }
  };

  const addUserFS = async (u: UserAccount) => {
    setUsers((prev) => [u, ...prev]);
    try {
      await setDoc(doc(db, 'users', u.id), u);
    } catch (err) {
      console.error('Error adding user to Firestore:', err);
    }
  };

  const updateUserFS = async (u: UserAccount) => {
    setUsers((prev) => prev.map((user) => (user.id === u.id ? u : user)));
    try {
      await setDoc(doc(db, 'users', u.id), u, { merge: true });
    } catch (err) {
      console.error('Error updating user in Firestore:', err);
    }
  };

  const deleteUserFS = async (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (err) {
      console.error('Error deleting user from Firestore:', err);
    }
  };

  return {
    vehicles,
    leads,
    reservations,
    users,
    isSynced,
    addVehicleFS,
    updateVehicleFS,
    updateVehicleStatusFS,
    addLeadFS,
    updateLeadStatusFS,
    addReservationFS,
    updateReservationStatusFS,
    addUserFS,
    updateUserFS,
    deleteUserFS,
  };
}
