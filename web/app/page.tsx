'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'

export default function AdviceGenerator() {
  const [username, setUsername] = useState('')
  const [advice, setAdvice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateAdvice = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setAdvice('')

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate advice')
      }

      setAdvice(data.advice)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Twitter Advice Generator</h1>
          <p className="text-gray-400">Get personalized advice based on Twitter activity</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Advice</CardTitle>
            <CardDescription>Enter a Twitter username to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={generateAdvice} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Twitter username (without @)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
                <Button type="submit" disabled={loading || !username}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-500">
            <CardContent className="pt-6">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        )}

        {advice && (
          <Card>
            <CardHeader>
              <CardTitle>Your Personalized Advice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 whitespace-pre-wrap">{advice}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

