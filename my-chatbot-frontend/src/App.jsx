import { Toaster } from 'react-hot-toast';
import DigitalLaborInsight from './component/DigitalLaborInsight';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Toaster position="top-right" />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <DigitalLaborInsight />
      </main>
    </div>
  );
}

export default App;
