/**
 * Firebase Config — مكتب ثقة الذهبية
 * انسخ القيم من Firebase Console → Project Settings → General → Your apps → Web app
 */

// ⚠️ استبدل هذه القيم بـ API Keys من Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBKZwN8pNdOtek8gyXgpNI_BzjqWXsnKQM",
  authDomain: "thiqqah-letterhead.firebaseapp.com",
  projectId: "thiqqah-letterhead",
  storageBucket: "thiqqah-letterhead.firebasestorage.app",
  messagingSenderId: "124112133309",
  appId: "1:124112133309:web:c781d52cb5a169a9ddebd4"
};

// Initialize Firebase (if not already initialized)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Expose db globally for standalone HTML pages
var db = (typeof firebase !== 'undefined') ? firebase.firestore() : null;

/**
 * Firestore collections:
 * - documents: { id, html, subject, ref, status, senderName, senderEmail, createdAt, updatedAt, stampedBy, signatureBy }
 * - roles: { uid, role }  (staff | admin)
 */
