import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateProfile from './pages/CreateProfile'
import CreateCard from './pages/CreateCard'
import Preview from './pages/Preview'
import History from './pages/History'

export function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile/new" element={<CreateProfile />} />
            <Route path="/profile/:id/edit" element={<CreateProfile />} />
            <Route path="/create" element={<CreateCard />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/history" element={<History />} />
        </Routes>
    )
}
