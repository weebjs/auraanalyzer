'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Toaster, toast } from 'sonner'

export default function Home() {
  const [username, setUsername] = useState('')
  const [vibe, setVibe] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const checkVibe = async () => {
    if (!username.trim()) {
      toast.error('Please enter a username.')
      return
    }

    setLoading(true)
    setVibe('')
    try {
      const userData = await axios.get(`/api/fetchUserData?username=${username}`)
      const analysis = await axios.post('/api/analyzeVibe', { userData: userData.data })
      setVibe(analysis.data.analysis)
      setIsDialogOpen(true) // Open the dialog
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error checking vibe. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <Toaster richColors />
      <div className="w-full mb-[7rem] max-w-md space-y-4 text-center">
        <h1 className="text-3xl font-bold">
          AuraAnalyzer
        </h1>
        <p className="text-muted-foreground text-sm">
          Analyze your level of aura on X
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
        {vibe && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Aura Analysis for @{username}</DialogTitle>
                <DialogDescription>
                  Here&apos;s info on your aura on X:
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                {vibe}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <footer className="fixed bottom-4 text-muted-foreground text-sm">
         coded by a cutie named{' '}
        <a
          href="https://twitter.com/weebthedev"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground"
        >
          @weebthedev
        </a>
      </footer>
    </div>
  )
}