'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Camera, Video, X, StepForward } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function CameraComponent() {
  const [mode, setMode] = useState<'photo' | 'video' | null>(null)
  const [capturing, setCapturing] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  const startCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: mode === 'video' })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      setCapturing(true)

      if (mode === 'video') {
        mediaRecorderRef.current = new MediaRecorder(stream)
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data)
          }
        }
        mediaRecorderRef.current.start()
        setRecordingTime(0)
      }
    } catch (err) {
      console.error("Error accessing media devices.", err)
    }
  }, [mode])

  const stopCapture = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
    }
    if (mode === 'video' && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    setCapturing(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [mode])

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
      setPreview(canvas.toDataURL('image/jpeg'))
      stopCapture()
    }
  }, [stopCapture])

  const captureVideo = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        setPreview(URL.createObjectURL(blob))
        chunksRef.current = []
      }
    }
    stopCapture()
  }, [stopCapture])

  const handlePost = useCallback(() => {
    // Implement your post logic here
    console.log('Posting content:', preview)
    // Reset the component state
    setMode(null)
    setPreview(null)
    setRecordingTime(0)
  }, [preview])

  const resetCapture = useCallback(() => {
    setMode(null)
    setPreview(null)
    setCapturing(false)
    setRecordingTime(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (capturing && mode === 'video') {
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [capturing, mode])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Camera className="w-6 h-6 text-blue-500 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setMode('photo')} className='cursor-pointer'>
            Take Photo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMode('video')} className='cursor-pointer'>
            Record Video
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {mode && !preview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-100 p-4 rounded-lg max-w-lg w-full">
            <div className="relative">
              <video ref={videoRef} className="w-full h-auto" />
              {capturing && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center">
                  {mode === 'photo' ? (
                    <Camera onClick={capturePhoto} className='text-white hover:text-blue-400 cursor-pointer'/>
                  ) : (
                    <>
                      <Video onClick={captureVideo} className={capturing ? 'text-red-300 hover:text-red-700 cursor-pointer' : ''}>
                        {capturing ? 'Stop Recording' : 'Start Recording'}
                      </Video>
                      {capturing && (
                        <span className="ml-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                          {formatTime(recordingTime)}
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-between">
              <X onClick={resetCapture} className='text-red-400 hover:text-red-700 cursor-pointer'/>
              {!capturing && <Button onClick={startCapture}>
                Start Capture
                <StepForward className='w-5 h-5 animate-bounce'/>
                </Button>}
            </div>
          </div>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full">
            <div className="relative">
              {mode === 'photo' ? (
                <img src={preview} alt="Captured" className="w-full h-auto rounded-md" />
              ) : (
                <video src={preview} controls className="w-full h-auto rounded-md" />
              )}
            </div>
            <div className="mt-4 flex justify-between">
              <X onClick={resetCapture} className='text-red-400 hover:text-red-700 cursor-pointer'/>
              <Button onClick={handlePost}>Post</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}