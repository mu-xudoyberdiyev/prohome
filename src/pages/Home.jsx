import { Navigate } from 'react-router-dom'
import { useAppStore } from '../zustand'

export default function Home() {
  const { user } = useAppStore()

  if (user) {
    return <section className="animate-fade-in h-full"></section>
  } else {
    return <Navigate to={'/login'} />
  }
}
