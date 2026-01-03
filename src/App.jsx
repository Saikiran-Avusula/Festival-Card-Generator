import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router'
import { Toast } from './components/common/Toast'
import { useAppStore } from './store/useAppStore'

function App() {
    const { toast, hideToast } = useAppStore()

    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="min-h-screen bg-neutral-50 font-body">
                <AppRouter />
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={hideToast}
                    />
                )}
            </div>
        </BrowserRouter>
    )
}

export default App
