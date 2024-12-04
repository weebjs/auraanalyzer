'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

export default function Home() {
  const [username, setUsername] = useState('')
  const [vibe, setVibe] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const checkVibe = async () => {
    setLoading(true)
    setVibe('')
    setError('')
    try {
      const userData = await axios.get(`/api/fetchUserData?username=${username}`)
      const analysis = await axios.post('/api/analyzeVibe', { userData: userData.data })
      setVibe(analysis.data.analysis)
    } catch (error) {
      console.error('Error:', error)
      setError('Error checking vibe. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full mtpb-9 max-w-md space-y-4 text-center">
        <h1 className="text-3xl font-bold">
          Advice Giver
        </h1>
        <p className="text-muted-foreground text-sm">
          Analyze your level of brain rot content on X
        </p>
        <div className="flex gap-2">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            className="flex-1"
          />
          <Button
            onClick={checkVibe}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
        {loading && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin"></div>
          </div>
        )}
        {error && (
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {vibe && (
          <div className="text-foreground mt-4 p-4 border border-border rounded-md">
            {vibe}
          </div>
        )}
      </div>
      <footer className="fixed bottom-4 text-muted-foreground text-sm">
        Made for fun by{' '}
        <a
          href="https://twitter.com/munadil_sd"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground"
        >
          @munadil_sd
        </a>
      </footer>
    </div>
  )
}

