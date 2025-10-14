import ErrorBoundary from './components/ErrorBoundary';
import AuthGuard from './components/Auth/AuthGuard';
import Canvas from './components/Canvas';

function App() {
  return (
    <ErrorBoundary>
      <AuthGuard>
        <Canvas />
      </AuthGuard>
    </ErrorBoundary>
  );
}

export default App;
