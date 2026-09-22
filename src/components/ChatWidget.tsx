
"use client"

import React, { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Truck, Info, AlertTriangle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Sender = "user" | "bot" | "admin"

interface Message {
  id: string
  text: string
  sender: Sender
  timestamp: Date
}

type ChatMode = "menu" | "tracking" | "product" | "complaint" | "admin"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [chatMode, setChatMode] = useState<ChatMode>("menu")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isAdminSessionActive, setIsAdminSessionActive] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const hasGreeted = useRef(false)

  const addMessage = React.useCallback((text: string, sender: Sender) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      text,
      sender,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }, [])

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Initial greeting when opening chat
  useEffect(() => {
    if (isOpen && !hasGreeted.current) {
      // Use setTimeout to avoid synchronous state update in effect and simulate delay
      setTimeout(() => {
        addMessage("Halo! 👋 Selamat datang di Toko Online. Ada yang bisa kami bantu?", "bot")
      }, 500)
      hasGreeted.current = true
    }
  }, [isOpen, addMessage])

  // "Tanya Admin" Session Timer (30s)
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isAdminSessionActive) {
      timer = setTimeout(() => {
        addMessage("⚠️ Sesi chat dengan admin telah berakhir otomatis.", "admin")
        setIsAdminSessionActive(false)
        setChatMode("menu")
      }, 30000) // 30 seconds
    }
    return () => clearTimeout(timer)
  }, [isAdminSessionActive, addMessage])


  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMsg = inputValue.trim()
    addMessage(userMsg, "user")
    setInputValue("")

    // Logika berdasarkan mode
    if (chatMode === "tracking") {
      handleTrackingLogic(userMsg)
    } else if (chatMode === "product") {
      handleProductLogic(userMsg)
    } else if (chatMode === "complaint") {
       // Should not happen via text input usually, but just in case
        setChatMode("menu")
    } else if (chatMode === "admin") {
      handleAdminLogic()
    }
  }

  const handleTrackingLogic = (input: string) => {
    if (input.length < 10) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        addMessage("❌ Nomor resi tidak valid. Masukkan minimal 10 karakter.", "bot")
      }, 500)
    } else {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        addMessage(`✅ Paket dengan resi ${input} sedang dalam perjalanan menuju alamat tujuan.`, "bot")
        setTimeout(() => setChatMode("menu"), 2000)
      }, 1000)
    }
  }

  const handleProductLogic = (input: string) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addMessage(`Stok untuk "${input}" saat ini sisa 2 pcs. Segera checkout sebelum kehabisan!`, "bot")
      setTimeout(() => setChatMode("menu"), 2000)
    }, 800)
  }

  const handleAdminLogic = () => {
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      addMessage("⚠️ Sistem mendeteksi koneksi internet Anda buruk. Pesan gagal dimuat.", "admin")
    }, 2000)
  }

  const handleMenuClick = (mode: ChatMode) => {
    setChatMode(mode)

    if (mode === "tracking") {
        addMessage("Silakan masukkan nomor resi pesanan Anda:", "bot")
    } else if (mode === "product") {
        addMessage("Produk apa yang ingin Anda tanyakan?", "bot")
    } else if (mode === "complaint") {
        addMessage("Untuk pengajuan komplain, Anda WAJIB menyertakan video unboxing tanpa terputus. Tanpa video unboxing, komplain tidak dapat kami proses.", "bot")
        setTimeout(() => {
             addMessage("Kembali ke menu utama...", "bot")
             setChatMode("menu")
        }, 3000)
    } else if (mode === "admin") {
        setIsTyping(true)
        // Delay 3 detik pura-pura loading
        setTimeout(() => {
            setIsTyping(false)
            addMessage("Halo, saya Admin Bintang siap membantu! ⭐", "admin")
            setIsAdminSessionActive(true)
        }, 3000)
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl transition-all duration-300 z-50",
          isOpen ? "rotate-90 bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 bg-background border rounded-xl shadow-2xl z-50 overflow-hidden transition-all duration-300 origin-bottom-right sm:w-[350px] w-[calc(100%-3rem)]",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="border-0 shadow-none h-[500px] flex flex-col bg-card">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex flex-row items-center space-y-0 space-x-3 border-b">
             <div className="relative">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-primary rounded-full"></span>
             </div>
             <div>
                <h3 className="font-bold">Bantuan Pelanggan</h3>
                <p className="text-xs text-primary-foreground/80">
                  {chatMode === "admin" ? "Admin Bintang sedang mengetik..." : "Online 24 Jam"}
                </p>
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : msg.sender === "admin"
                      ? "bg-yellow-100 text-yellow-900 border border-yellow-200 rounded-bl-none"
                      : "bg-background border rounded-bl-none shadow-sm"
                  )}
                >
                  {msg.text}
                  <div className="text-[10px] opacity-50 mt-1 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
               <div className="flex justify-start">
                  <div className="bg-background border rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                     <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                     </div>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="p-4 bg-background border-t flex flex-col gap-3">
            {chatMode === "menu" ? (
                <div className="grid grid-cols-2 gap-2 w-full">
                    <Button variant="outline" className="text-xs justify-start h-auto py-2 px-3" onClick={() => handleMenuClick("tracking")}>
                        <Truck className="mr-2 h-4 w-4 text-blue-500" />
                        Lacak Paket
                    </Button>
                    <Button variant="outline" className="text-xs justify-start h-auto py-2 px-3" onClick={() => handleMenuClick("product")}>
                        <Info className="mr-2 h-4 w-4 text-green-500" />
                        Info Produk
                    </Button>
                    <Button variant="outline" className="text-xs justify-start h-auto py-2 px-3" onClick={() => handleMenuClick("complaint")}>
                        <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                        Komplain
                    </Button>
                    <Button variant="outline" className="text-xs justify-start h-auto py-2 px-3" onClick={() => handleMenuClick("admin")}>
                        <User className="mr-2 h-4 w-4 text-purple-500" />
                        Tanya Admin
                    </Button>
                </div>
            ) : (
                <form 
                    className="flex w-full gap-2 items-center"
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSendMessage()
                    }}
                >
                    <input 
                        placeholder={chatMode === 'tracking' ? "Masukkan nomor resi..." : "Tulis pesan..."}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-1 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={chatMode === 'complaint'}
                    />
                    <Button type="submit" size="icon" disabled={!inputValue.trim() || chatMode === 'complaint'}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            )}
            
            {chatMode !== "menu" && (
                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground h-6" onClick={() => setChatMode("menu")}>
                    Kembali ke Menu Utama
                </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
