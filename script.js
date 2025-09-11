// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    onSnapshot, 
    orderBy, 
    query, 
    serverTimestamp,
    where,
    limit,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDhQu4Cm9_6s4-T0AIsPS92ilwXbJHdPpA",
    authDomain: "realestate-57b87.firebaseapp.com",
    projectId: "realestate-57b87",
    storageBucket: "realestate-57b87.appspot.com",
    messagingSenderId: "718597394625",
    appId: "1:718597394625:web:59ea900fad8ee603790440",
    measurementId: "G-4B7GVMXH1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Collection references
export const usersCollection = collection(db, 'users');
export const enquiriesCollection = collection(db, 'hospital_enquiries');

// Utility Functions

/**
 * Add a new user to Firestore
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @returns {Promise<Object>} - Result object with success status and data
 */
export async function addUser(name, email) {
    try {
        const docRef = await addDoc(usersCollection, {
            name: name.trim(),
            email: email.trim(),
            createdAt: serverTimestamp(),
            timestamp: new Date().toISOString()
        });
        
        console.log("User added with ID: ", docRef.id);
        return { success: true, id: docRef.id, data: { name, email } };
    } catch (error) {
        console.error("Error adding user: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all users from Firestore (one-time read)
 * @returns {Promise<Array>} - Array of user objects
 */
export async function getAllUsers() {
    try {
        const q = query(usersCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log("Retrieved users:", users.length);
        return users;
    } catch (error) {
        console.error("Error getting users: ", error);
        return [];
    }
}

/**
 * Set up real-time listener for users collection
 * @param {Function} callback - Callback function to handle updates
 * @returns {Function} - Unsubscribe function
 */
export function onUsersUpdate(callback) {
    const q = query(usersCollection, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log("Real-time update - Users:", users.length);
        callback(users);
    }, (error) => {
        console.error("Error in real-time listener:", error);
        callback(null, error);
    });
}

/**
 * Add enquiry to Firestore (for your hospital form)
 * @param {Object} enquiryData - Enquiry form data
 * @returns {Promise<Object>} - Result object
 */
export async function addEnquiry(enquiryData) {
    try {
        const docRef = await addDoc(enquiriesCollection, {
            ...enquiryData,
            createdAt: serverTimestamp(),
            timestamp: new Date().toISOString(),
            status: 'new'
        });
        
        console.log("Enquiry added with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding enquiry: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get recent enquiries
 * @param {number} limitCount - Number of enquiries to retrieve
 * @returns {Promise<Array>} - Array of enquiry objects
 */
export async function getRecentEnquiries(limitCount = 10) {
    try {
        const q = query(
            enquiriesCollection, 
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        
        const enquiries = [];
        querySnapshot.forEach((doc) => {
            enquiries.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return enquiries;
    } catch (error) {
        console.error("Error getting enquiries: ", error);
        return [];
    }
}

/**
 * Set up real-time listener for enquiries
 * @param {Function} callback - Callback function
 * @returns {Function} - Unsubscribe function
 */
export function onEnquiriesUpdate(callback) {
    const q = query(enquiriesCollection, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
        const enquiries = [];
        querySnapshot.forEach((doc) => {
            enquiries.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        callback(enquiries);
    }, (error) => {
        console.error("Error in enquiries listener:", error);
        callback(null, error);
    });
}

/**
 * Update document in any collection
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {Object} updateData - Data to update
 */
export async function updateDocument(collectionName, docId, updateData) {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, {
            ...updateData,
            updatedAt: serverTimestamp()
        });
        
        return { success: true };
    } catch (error) {
        console.error("Error updating document: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete document from any collection
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 */
export async function deleteDocument(collectionName, docId) {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        return { success: true };
    } catch (error) {
        console.error("Error deleting document: ", error);
        return { success: false, error: error.message };
    }
}

/**
 * Utility function to format Firestore timestamp
 * @param {*} timestamp - Firestore timestamp or Date
 * @returns {string} - Formatted date string
 */
export function formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown';
    
    let date;
    if (timestamp.toDate) {
        date = timestamp.toDate();
    } else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
    } else {
        date = timestamp;
    }
    
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

console.log('Firebase initialized successfully with Firestore!');
