import { Toaster } from 'sonner';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div style={{ height: '100%', width: `100%` }} className='bg-MainColor'>
      <Toaster position="bottom-left" style={{
        direction: 'rtl'
      }} />
      <AppRoutes />
    </div>
  )

}

export default App