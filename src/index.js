import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { register } from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);

// 서비스 워커 등록 - 오프라인 지원 활성화
register();
