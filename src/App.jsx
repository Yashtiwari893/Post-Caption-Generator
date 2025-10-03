import { useRef, useState, useEffect } from "react"
import { Send, Sparkles, Clock, Image as ImageIcon, Download as DownloadIcon, X as CloseIcon } from "lucide-react"

// Gemini API
const GEMINI_API_KEY = "AIzaSyCCL7eaIDsysRiqvTOicwYRDyfKEimyMdc" // your API key
const GEMINI_MODEL = "gemini-2.0-flash"
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`

export default function AIImageGenerator() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      type: "text",
      text: "🎨 Welcome to your AI Post Generator! Describe anything and I’ll fetch images + captions for you.",
    },
  ])
  const [modalImage, setModalImage] = useState(null)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const listRef = useRef(null)

  // Unsplash API
  const accessKey = "XJkV-vUC6GlPFpfZEi2k4cVSmNEmeqFdM3WyofO3QbI"
  const apiUrl = "https://api.unsplash.com/photos/random"

  const quickReplies = [
    { text: "Sunset Beach", icon: ImageIcon },
    { text: "Futuristic City", icon: ImageIcon },
    { text: "Cafe Vibes", icon: ImageIcon },
  ]

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  async function handleSend(messageText = input) {
    const trimmed = messageText.trim()
    if (!trimmed) return
    setMessages((m) => [...m, { role: "user", type: "text", text: trimmed }])
    setInput("")
    await fetchImage(trimmed)
  }

  async function fetchImage(prompt) {
    setError(null)
    setLoading(true)

    try {
      // Unsplash fetch
      const response = await fetch(`${apiUrl}?query=${encodeURIComponent(prompt)}&client_id=${accessKey}`)
      if (!response.ok) throw new Error(`API error: ${response.status}`)

      const result = await response.json()
      const imageUrl = result.urls?.regular
      const originalUrl = result.urls?.full || imageUrl
      if (!imageUrl) throw new Error("No image returned.")

      // Gemini caption fetch
      const captionRaw = await fetchCaptionAndHashtags(prompt)
      const { caption, hashtags } = cleanCaptionAndHashtags(captionRaw)

      setMessages((m) => [
        ...m,
        {
          role: "bot",
          type: "image",
          url: imageUrl,
          originalUrl,
          caption,
          hashtags,
        },
      ])
    } catch (e) {
      setError(e.message)
      setMessages((m) => [...m, { role: "bot", type: "text", text: "⚠️ Failed to fetch image/caption. Try again." }])
    }

    setLoading(false)
  }

  async function fetchCaptionAndHashtags(prompt) {
    try {
      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an AI that ONLY outputs Instagram captions and hashtags.
Rules:
- Output must contain ONLY one caption (max 1–2 sentences).
- Output must contain ONLY one block of hashtags.
- NO explanations, NO options, NO numbering, NO extra words.
- Do not say anything except caption and hashtags.
- Format strictly like this:

<Caption>
<Hashtags>

Now generate for: ${prompt}`
                },
              ],
            },
          ],
        }),
      })

      const data = await response.json()
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null
    } catch (err) {
      console.error("Gemini Error:", err)
      return null
    }
  }

  // ✅ Cleaner function to enforce proper format
  function cleanCaptionAndHashtags(raw) {
    if (!raw) return { caption: "", hashtags: [] }

    const lines = raw.trim().split(/\n+/)
    let caption = lines[0]?.trim() || ""
    let hashtags = []

    // Find hashtags in all lines
    const hashtagsFound = raw.match(/#[\w\d_]+/g)
    if (hashtagsFound) {
      hashtags = hashtagsFound
    }

    return { caption, hashtags }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Post Generator</h1>
            <p className="text-sm text-muted-foreground">Turn words into art + captions</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalImage && (
        <ModalImageView image={modalImage} onClose={() => setModalImage(null)} />
      )}

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-6 max-w-4xl mx-auto w-full">
          {messages.map((m, idx) => (
            <Bubble
              key={idx}
              role={m.role}
              type={m.type}
              text={m.text}
              url={m.url}
              originalUrl={m.originalUrl}
              caption={m.caption}
              hashtags={m.hashtags}
              onImageClick={setModalImage}
            />
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <span className="text-sm">Fetching image & caption...</span>
            </div>
          )}

          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>

        {/* Input */}
        <div className="border-t bg-card/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto p-6">
            {messages.length === 1 && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-3">Try these prompts:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, idx) => {
                    const Icon = reply.icon
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSend(reply.text)}
                        className="flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-full text-sm transition-all duration-200 hover:scale-105"
                      >
                        <Icon className="w-4 h-4" />
                        {reply.text}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Describe an image..."
                className="flex-1 bg-input border border-border rounded-xl px-4 py-3"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl transition-all duration-200"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Bubble({ role, type, text, url, originalUrl, caption, hashtags, onImageClick }) {
  const isUser = role === "user"

  const handleDownload = async (e) => {
    e.stopPropagation()
    const link = document.createElement('a')
    link.href = originalUrl || url
    link.download = 'ai-image.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div className={`${isUser ? "order-2" : "order-1"}`}>
        {!isUser && (
          <span className="text-xs text-muted-foreground flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" /> AI
          </span>
        )}
        <div className={`${isUser ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground border"} px-4 py-3 rounded-2xl shadow-sm image-bubble`}>
          {type === "text" && <span>{text}</span>}
          {type === "image" && (
            <div className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 bg-white w-[320px] max-w-full flex flex-col overflow-hidden">
              <div className="relative">
                <img
                  src={url}
                  alt="Generated"
                  className="w-full h-64 object-cover rounded-t-xl cursor-pointer transition-transform duration-150"
                  onClick={() => onImageClick && onImageClick({ url: originalUrl || url, caption, hashtags })}
                  style={{ aspectRatio: '16/9' }}
                />
                <button
                  className="absolute top-3 right-3 bg-white/90 shadow-md rounded-full p-2 text-primary hover:scale-105 transition-transform duration-150"
                  title="Download image"
                  onClick={handleDownload}
                  style={{ zIndex: 2 }}
                >
                  <DownloadIcon className="w-5 h-5" />
                </button>
              </div>
              {(caption?.trim() || (Array.isArray(hashtags) && hashtags.length > 0)) && (
                <div className="bg-white flex flex-col gap-2 px-4 pt-3 pb-4">
                  {caption?.trim() && <div className="text-sm text-foreground leading-relaxed">{caption}</div>}
                  {Array.isArray(hashtags) && hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {hashtags.map((tag, i) => (
                        <span key={i} className="text-primary font-medium rounded-full bg-accent/10 px-3 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  )
}

function ModalImageView({ image, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Close">
          <CloseIcon className="w-6 h-6" />
        </button>
        <img src={image.url} alt="Full" className="modal-img" />
        {(image.caption || (image.hashtags && image.hashtags.length > 0)) && (
          <div className="modal-caption mt-4">
            {image.caption && <div className="caption-text text-base text-muted-foreground mb-2">{image.caption}</div>}
            {image.hashtags && image.hashtags.length > 0 && (
              <div className="hashtags font-semibold text-base text-primary">
                {image.hashtags.map((tag, i) => (
                  <span key={i} className="mr-3">{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
