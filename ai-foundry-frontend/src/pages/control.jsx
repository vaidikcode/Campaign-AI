import React, { useState, useEffect, useRef } from 'react'

export default function Control() {
  // KB Creation State
  const [kbUrl, setKbUrl] = useState('')
  const [kbLoading, setKbLoading] = useState(false)
  const [kbMessage, setKbMessage] = useState('')

  // Phone Call State
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneLoading, setPhoneLoading] = useState(false)
  const [phoneMessage, setPhoneMessage] = useState('')

  // Vapi Voice Assistant State
  const [vapiReady, setVapiReady] = useState(false)
  const [callActive, setCallActive] = useState(false)
  const vapiRef = useRef(null)
  const [transcript, setTranscript] = useState('')

  // Initialize Vapi SDK
  useEffect(() => {
    // Load Vapi SDK script
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js'
    script.defer = true
    script.async = true
    script.onload = () => {
      console.log('Vapi SDK loaded')
      setVapiReady(true)
    }
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  // Handle KB Creation
  const handleCreateKB = async () => {
    if (!kbUrl) {
      setKbMessage('❌ Please enter a URL')
      return
    }

    setKbLoading(true)
    setKbMessage('⏳ Creating knowledge base...')

    try {
      const response = await fetch('http://localhost:8002/create-knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: kbUrl })
      })

      if (response.ok) {
        setKbMessage('✅ Knowledge base creation started! (This may take a few minutes)')
        setKbUrl('')
      } else {
        const error = await response.json()
        setKbMessage(`❌ Failed: ${error.detail || 'Unknown error'}`)
      }
    } catch (error) {
      setKbMessage(`❌ Error: ${error.message}`)
    }

    setKbLoading(false)
  }

  // Handle Phone Call
  const handleStartCall = async () => {
    // Normalize Indian phone numbers
    let normalizedNumber = phoneNumber.replace(/\s/g, '').replace(/[-()]/g, '')
    
    if (!normalizedNumber) {
      setPhoneMessage('❌ Please enter a phone number')
      return
    }

    // Add +91 if it's a 10-digit Indian number
    if (normalizedNumber.length === 10) {
      normalizedNumber = '+91' + normalizedNumber
    }

    setPhoneLoading(true)
    setPhoneMessage('⏳ Starting phone call to marketing assistant...')

    try {
      const response = await fetch('http://localhost:8002/start-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: normalizedNumber })
      })

      if (response.ok) {
        const data = await response.json()
        setPhoneMessage(`✅ Call initiated! Call ID: ${data.id || 'Processing...'}`)
        setPhoneNumber('')
      } else {
        const error = await response.json()
        setPhoneMessage(`❌ Failed: ${error.detail || 'Unknown error'}`)
      }
    } catch (error) {
      setPhoneMessage(`❌ Error: ${error.message}`)
    }

    setPhoneLoading(false)
  }

  // Handle Vapi Voice Assistant
  const handleStartVapiCall = async () => {
    if (!vapiReady) {
      alert('Vapi SDK is still loading. Please try again.')
      return
    }

    try {
      // Get API key from environment
      const apiKey = import.meta.env.VITE_VAPI_API_KEY
      const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID

      if (!apiKey || !assistantId) {
        alert('⚠️ Vapi credentials not found. Please set VITE_VAPI_API_KEY and VITE_VAPI_ASSISTANT_ID in .env')
        return
      }

      // Initialize Vapi
      if (window.vapiSDK) {
        vapiRef.current = window.vapiSDK.run({
          apiKey: apiKey,
          assistant: assistantId,
          config: {
            buttonConfig: {
              offText: 'End Call',
              onText: 'Start Call'
            }
          }
        })

        // Listen to events
        if (vapiRef.current) {
          vapiRef.current.on('call-start', () => {
            console.log('Vapi call started')
            setCallActive(true)
            setTranscript('🎤 Call started...\n')
          })

          vapiRef.current.on('call-end', () => {
            console.log('Vapi call ended')
            setCallActive(false)
            setTranscript(prev => prev + '\n✅ Call ended')
          })

          vapiRef.current.on('message', (message) => {
            console.log('Vapi message:', message)
            if (message.type === 'transcript') {
              setTranscript(prev => prev + `\n${message.role === 'user' ? '👤 You' : '🤖 Assistant'}: ${message.transcript}`)
            }
            if (message.type === 'function-call') {
              console.log('Function called:', message.functionCall)
            }
          })

          vapiRef.current.on('error', (error) => {
            console.error('Vapi error:', error)
            setTranscript(prev => prev + `\n❌ Error: ${error}`)
          })
        }
      } else {
        alert('Vapi SDK failed to load')
      }
    } catch (error) {
      console.error('Error initializing Vapi:', error)
      alert(`Error: ${error.message}`)
    }
  }

  // Handle End Call
  const handleEndCall = () => {
    if (vapiRef.current && callActive) {
      vapiRef.current.stop()
      setCallActive(false)
    }
  }

  // Handle Clear Transcript
  const handleClearTranscript = () => {
    setTranscript('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-4 text-center">🎛️ Control Center</h1>
        <p className="text-xl text-gray-300 mb-12 text-center">Manage Knowledge Base, Phone Calls, and Voice Assistant</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Knowledge Base Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">📚 Create Knowledge Base</h2>
              <p className="text-gray-300 text-sm">Upload content from a URL to create a searchable knowledge base</p>
            </div>

            <div className="space-y-4">
              <input
                type="url"
                placeholder="Enter URL (e.g., https://example.com/docs)"
                value={kbUrl}
                onChange={(e) => setKbUrl(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={kbLoading}
              />

              <button
                onClick={handleCreateKB}
                className={`w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${kbLoading ? 'animate-pulse' : ''}`}
                disabled={kbLoading}
              >
                {kbLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Processing...
                  </>
                ) : (
                  '📥 Create Knowledge Base'
                )}
              </button>

              {kbMessage && (
                <div className={`p-4 rounded-lg ${kbMessage.includes('✅') ? 'bg-green-500/20 text-green-200 border border-green-500/50' : kbMessage.includes('⏳') ? 'bg-blue-500/20 text-blue-200 border border-blue-500/50' : 'bg-red-500/20 text-red-200 border border-red-500/50'}`}>
                  {kbMessage}
                </div>
              )}
            </div>
          </div>

          {/* Phone Call Marketing Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">📞 Market Your Product</h2>
              <p className="text-gray-300 text-sm">Start outbound calls to promote your product</p>
            </div>

            <div className="space-y-4">
              <input
                type="tel"
                placeholder="Phone number (e.g., +1234567890 or 10-digit)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={phoneLoading}
              />

              <button
                onClick={handleStartCall}
                className={`w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${phoneLoading ? 'animate-pulse' : ''}`}
                disabled={phoneLoading}
              >
                {phoneLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Dialing...
                  </>
                ) : (
                  '📱 Start Call'
                )}
              </button>

              {phoneMessage && (
                <div className={`p-4 rounded-lg ${phoneMessage.includes('✅') ? 'bg-green-500/20 text-green-200 border border-green-500/50' : phoneMessage.includes('⏳') ? 'bg-blue-500/20 text-blue-200 border border-blue-500/50' : 'bg-red-500/20 text-red-200 border border-red-500/50'}`}>
                  {phoneMessage}
                </div>
              )}
            </div>
          </div>

          {/* Vapi Voice Assistant Demo Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl lg:col-span-2 xl:col-span-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">🎤 Try Voice Assistant</h2>
              <p className="text-gray-300 text-sm">Live demo of your Vapi voice assistant</p>
            </div>

            <div className="space-y-4">
              {/* Call Status Indicator */}
              <div className={`flex items-center gap-3 p-3 rounded-lg ${callActive ? 'bg-green-500/20 border border-green-500/50' : 'bg-gray-500/20 border border-gray-500/50'}`}>
                <div className={`w-3 h-3 rounded-full ${callActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <div className="text-white font-medium">
                  {!vapiReady ? 'Loading SDK...' : callActive ? 'Call Active' : 'Ready to Call'}
                </div>
              </div>

              {/* Demo Button Controls */}
              <div className="flex gap-3">
                <button
                  onClick={handleStartVapiCall}
                  className={`flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${!vapiReady || callActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!vapiReady || callActive}
                  title={callActive ? 'Call already active' : 'Start a demo call'}
                >
                  {!vapiReady ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Loading SDK...
                    </>
                  ) : (
                    '🎙️ Start Demo Call'
                  )}
                </button>

                {callActive && (
                  <button
                    onClick={handleEndCall}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold rounded-lg transition-all duration-300"
                    title="End the current call"
                  >
                    🔴 End Call
                  </button>
                )}
              </div>

              {/* Info Messages */}
              {!vapiReady && (
                <div className="p-4 rounded-lg bg-blue-500/20 text-blue-200 border border-blue-500/50">
                  ⏳ Loading Vapi SDK...
                </div>
              )}

              {vapiReady && !callActive && (
                <div className="p-4 rounded-lg bg-green-500/20 text-green-200 border border-green-500/50">
                  ✅ Ready! Click "Start Demo Call" and allow microphone access
                </div>
              )}

              {callActive && (
                <div className="p-4 rounded-lg bg-blue-500/20 text-blue-200 border border-blue-500/50">
                  🎙️ Listening... Speak clearly into your microphone
                </div>
              )}

              {/* Transcript Section */}
              {transcript && (
                <div className="bg-black/30 rounded-lg overflow-hidden border border-white/10">
                  <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
                    <h4 className="text-white font-semibold">📝 Live Transcript</h4>
                    <button
                      onClick={handleClearTranscript}
                      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded transition-colors text-sm"
                      title="Clear transcript"
                    >
                      ✕ Clear
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-4 space-y-2">
                      {transcript.split('\n').map((line, idx) => {
                        if (!line.trim()) return null
                        const isUser = line.includes('👤 You')
                        const isAssistant = line.includes('🤖 Assistant')
                        return (
                          <div 
                            key={idx} 
                            className={`p-2 rounded ${isUser ? 'bg-blue-500/20 text-blue-200' : isAssistant ? 'bg-purple-500/20 text-purple-200' : 'bg-gray-500/20 text-gray-300'}`}
                          >
                            {line}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
