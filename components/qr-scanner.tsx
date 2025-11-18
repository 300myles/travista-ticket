"use client"

import { useEffect, useRef, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"

interface QRScannerProps {
  onScan: (result: string) => void
}

function QRScannerComponent({ onScan }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const [scanning, setScanning] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!scanning) return

    try {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        false,
      )

      scannerRef.current.render(
        (decodedText) => {
          onScan(decodedText)
          setScanning(false)
        },
        (error) => {
          console.log(error)
        },
      )
    } catch (err) {
      setError("Failed to initialize camera. Please check your permissions.")
      setScanning(false)
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [scanning, onScan])

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => setScanning(true)}
          className="px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-smooth"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div id="qr-reader" style={{ width: "100%" }} />
      {!scanning && (
        <button
          onClick={() => setScanning(true)}
          className="w-full px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-smooth"
        >
          Scan Again
        </button>
      )}
    </div>
  )
}

export const QRScanner = QRScannerComponent
export default QRScannerComponent
