import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface AuthModalProps {
  onClose: () => void
}

export function AuthModal({ onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')
    if (isLogin) {
      const { error } = await signIn(email, password)
      if (error) setMessage('❌ ' + error.message)
      else onClose()
    } else {
      const { error } = await signUp(email, password)
      if (error) setMessage('❌ ' + error.message)
      else setMessage('✅ ส่ง email ยืนยันแล้ว กรุณาเช็ค inbox!')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#12121E", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#1E1E30", borderRadius: 24, padding: 28, width: "100%", maxWidth: 360 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🀄</div>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: 0 }}>
            {isLogin ? '🔑 เข้าสู่ระบบ' : '✨ สมัครสมาชิก'}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 6 }}>Easy Chinese App</p>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", background: "#252538", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 16px", color: "#fff", fontSize: 15, marginBottom: 12, outline: "none", fontFamily: "inherit" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", background: "#252538", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 16px", color: "#fff", fontSize: 15, marginBottom: 16, outline: "none", fontFamily: "inherit" }}
        />

        {message && <p style={{ textAlign: "center", fontSize: 13, marginBottom: 12, color: message.startsWith('✅') ? '#2ECC71' : '#E8433A' }}>{message}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%", background: "linear-gradient(135deg,#E8433A,#F5A623)", border: "none", borderRadius: 14, padding: "16px", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", marginBottom: 12, fontFamily: "inherit" }}
        >
          {loading ? 'กำลังโหลด...' : isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
        </button>

        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{ width: "100%", background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
        >
          {isLogin ? 'ยังไม่มีบัญชี? สมัครสมาชิก' : 'มีบัญชีแล้ว? เข้าสู่ระบบ'}
        </button>
      </div>
    </div>
  )
}
