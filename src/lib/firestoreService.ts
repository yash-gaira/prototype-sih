import { db } from "./firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";

// Constants for prototype
export const DOCTOR_ID = "doc_yashdeep_1";
export const PATIENT_ID = "pat_default_1";

/**
 * APPOINTMENTS
 */

export const bookAppointment = async (details: any) => {
  try {
    const docRef = await addDoc(collection(db, "appointments"), {
      ...details,
      patientId: PATIENT_ID,
      doctorId: DOCTOR_ID,
      status: "Scheduled", // Changed from Waiting to Scheduled so QR scan check-in works
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error booking appointment: ", error);
    throw error;
  }
};

export const updateAppointmentStatus = async (appointmentId: string, status: string) => {
  try {
    const apptRef = doc(db, "appointments", appointmentId);
    await updateDoc(apptRef, { status });
  } catch (error) {
    console.error("Error updating appointment: ", error);
    throw error;
  }
};

export const listenToDoctorQueue = (callback: (queue: any[]) => void) => {
  const q = query(
    collection(db, "appointments"), 
    where("doctorId", "==", DOCTOR_ID)
  );

  return onSnapshot(q, (querySnapshot) => {
    const queue = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
    
    queue.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeB - timeA;
    });
    
    callback(queue);
  }, (error) => {
    console.error("Listen to queue error: ", error);
  });
};

export const listenToPatientAppointments = (callback: (appts: any[]) => void) => {
  const q = query(
    collection(db, "appointments"), 
    where("patientId", "==", PATIENT_ID)
  );

  return onSnapshot(q, (querySnapshot) => {
    const appts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
    
    appts.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeB - timeA;
    });
    
    callback(appts);
  }, (error) => {
    console.error("Listen to patient appts error: ", error);
  });
};

/**
 * DOCUMENTS
 */

export const uploadDocumentRecord = async (docDetails: any) => {
  try {
    await addDoc(collection(db, "documents"), {
      ...docDetails,
      patientId: PATIENT_ID,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error uploading document: ", error);
    throw error;
  }
};

export const listenToPatientDocuments = (callback: (docs: any[]) => void) => {
  const q = query(
    collection(db, "documents"), 
    where("patientId", "==", PATIENT_ID),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (querySnapshot) => {
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(docs);
  }, (error) => {
    console.error("Listen to patient docs error: ", error);
  });
};
