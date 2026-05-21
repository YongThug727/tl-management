import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDthev5LZ1GE3rmXOa7-WKB4-fGKFCNmTc",
  authDomain: "tl-manager-230a1.firebaseapp.com",
  projectId: "tl-manager-230a1",
  storageBucket: "tl-manager-230a1.firebasestorage.app",
  messagingSenderId: "645392057796",
  appId: "1:645392057796:web:120d469a88f4d3e16c9091"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 오프라인 데이터 지속성 활성화
// 전파 없을 때 → 폰 내부에 임시 저장
// 전파 잡히면 → 자동 서버 동기화
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // 여러 탭이 동시에 열린 경우 - 무시해도 됨
    console.warn('오프라인 캐시: 탭이 여러 개 열려 있어 비활성화됩니다.');
  } else if (err.code === 'unimplemented') {
    // 브라우저가 지원하지 않는 경우
    console.warn('오프라인 캐시: 이 브라우저는 지원하지 않습니다.');
  }
});
