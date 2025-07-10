
import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [partidas, setPartidas] = useState([])

  const fetchPartidas = async () => {
    const { data } = await supabase.from('partidas').select('*')
    setPartidas(data)
  }

  useEffect(() => {
    fetchPartidas()
  }, [])

  return (
    <div>
      <h1>Partidas</h1>
      <ul>
        {partidas.map(p => (
          <li key={p.id}>
            {p.jogador1} vs {p.jogador2} — {p.vencedor || 'Em aberto'} ({p.placar})
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
