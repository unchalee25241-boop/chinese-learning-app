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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-white mb-6 text-center">
          {isLogin ? '🔑 เข้าสู่ระบบ' : '✨ สมัครสมาชิก'}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 mb-3 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 mb-4 outline-none"
        />

        {message && <p className="text-sm text-center mb-4">{message}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-orange-500 text-white rounded-xl py-3 font-bold mb-3"
        >
          {loading ? 'กำลังโหลด...' : isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
        </button>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-gray-400 text-sm"
        >
          {isLogin ? 'ยังไม่มีบัญชี? สมัครสมาชิก' : 'มีบัญชีแล้ว? เข้าสู่ระบบ'}
        </button>

        <button onClick={onClose} className="w-full text-gray-600 text-sm mt-2">
          ยกเลิก
        </button>
      </div>
    </div>
  )
}
