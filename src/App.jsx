<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Copa 7 - Amigos do Tennis</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Trophy, Users, Calendar, Target, Crown, Medal, Award, Filter, X, CheckCircle, Star, Lock, Unlock, Shield, Eye, EyeOff, FileText, MapPin, Zap } from 'lucide-react'
import './App.css'

function App() {
  // Jogadores em ordem alfabética
  const jogadores = [
    'Carlos', 'Felipe', 'Hesaú', 'Marcelo', 'Pedro', 
    'Saulo', 'Victor', 'Vinícius', 'Willyan'
  ]

  // Cores modernas para cada jogador (mantendo as mesmas cores, mas reorganizadas alfabeticamente)
  const coresJogadores = {
    'Carlos': 'bg-gradient-to-r from-teal-500 to-teal-600 text-white',
    'Felipe': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
    'Hesaú': 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white',
    'Marcelo': 'bg-gradient-to-r from-green-500 to-green-600 text-white',
    'Pedro': 'bg-gradient-to-r from-pink-500 to-pink-600 text-white',
    'Saulo': 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
    'Victor': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    'Vinícius': 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    'Willyan': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
  }

  const coresBorda = {
    'Carlos': 'border-teal-300',
    'Felipe': 'border-purple-300',
    'Hesaú': 'border-indigo-300',
    'Marcelo': 'border-green-300',
    'Pedro': 'border-pink-300',
    'Saulo': 'border-amber-300',
    'Victor': 'border-blue-300',
    'Vinícius': 'border-red-300',
    'Willyan': 'border-orange-300'
  }

  // Estados de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('torneio-admin-auth') === 'true'
  })
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginPassword, setLoginPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Senha do administrador (em produção, isso deveria estar em um backend seguro)
  const ADMIN_PASSWORD = 'copa7admin2025'

  // Gerar todas as partidas possíveis (todos contra todos)
  const gerarPartidas = () => {
    const partidas = []
    let id = 1
    for (let i = 0; i < jogadores.length; i++) {
      for (let j = i + 1; j < jogadores.length; j++) {
        partidas.push({
          id: id++,
          jogador1: jogadores[i],
          jogador2: jogadores[j],
          vencedor: '',
          placar: '',
          concluida: false
        })
      }
    }
    
    // Inserir resultados dos jogos já realizados
    const resultadosJogos = [
      { id: 18, vencedor: 'Hesaú', placar: '4 x 7, 8 x 6, 6 x 4' }, // Hesaú vs Saulo
      { id: 21, vencedor: 'Hesaú', placar: '7 x 0, 7 x 3' },        // Hesaú vs Willyan
      { id: 26, vencedor: 'Marcelo', placar: '7 x 0, 7 x 1' },      // Marcelo vs Willyan
      { id: 23, vencedor: 'Saulo', placar: '7 x 3, 6 x 8, 5 x 2' }, // Marcelo vs Saulo (Saulo venceu)
      { id: 33, vencedor: 'Willyan', placar: '7 x 2, 6 x 8, 6 x 4' } // Saulo vs Willyan (Willyan venceu)
    ]
    
    // Aplicar os resultados às partidas correspondentes
    resultadosJogos.forEach(resultado => {
      const partida = partidas.find(p => p.id === resultado.id)
      if (partida) {
        partida.vencedor = resultado.vencedor
        partida.placar = resultado.placar
        partida.concluida = true
      }
    })
    
    return partidas
  }

  const [partidas, setPartidas] = useState(() => {
    // Sempre gerar partidas com dados pré-carregados
    const partidasComResultados = gerarPartidas()
    
    // Verificar se há dados salvos no localStorage
    const saved = localStorage.getItem('torneio-partidas')
    if (saved) {
      const partidasSalvas = JSON.parse(saved)
      // Se há dados salvos, usar eles, mas manter os resultados pré-carregados
      // para partidas que não foram modificadas pelo usuário
      partidasComResultados.forEach(partidaPre => {
        const partidaSalva = partidasSalvas.find(p => p.id === partidaPre.id)
        if (partidaSalva && partidaSalva.concluida && !partidaPre.concluida) {
          // Se a partida foi concluída pelo usuário mas não estava pré-carregada, usar dados salvos
          partidaPre.vencedor = partidaSalva.vencedor
          partidaPre.placar = partidaSalva.placar
          partidaPre.concluida = partidaSalva.concluida
        }
      })
    }
    
    return partidasComResultados
  })

  const [jogadorSelecionado, setJogadorSelecionado] = useState(jogadores[0])
  const [filtroJogador, setFiltroJogador] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')

  // Salvar no localStorage sempre que as partidas mudarem
  useEffect(() => {
    localStorage.setItem('torneio-partidas', JSON.stringify(partidas))
  }, [partidas])

  // Funções de autenticação
  const handleLogin = () => {
    if (loginPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('torneio-admin-auth', 'true')
      setShowLoginModal(false)
      setLoginPassword('')
      setLoginError('')
    } else {
      setLoginError('Senha incorreta. Tente novamente.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('torneio-admin-auth')
  }

  const openLoginModal = () => {
    setShowLoginModal(true)
    setLoginError('')
    setLoginPassword('')
  }

  // Atualizar resultado de uma partida (apenas para administradores)
  const atualizarPartida = (id, vencedor, placar) => {
    if (!isAuthenticated) {
      openLoginModal()
      return
    }
    
    setPartidas(prev => prev.map(partida => 
      partida.id === id 
        ? { ...partida, vencedor, placar, concluida: vencedor !== '' }
        : partida
    ))
  }

  // Função para extrair games de um placar
  const extrairGames = (placar) => {
    if (!placar) return { games1: 0, games2: 0 }
    
    // Remover espaços e dividir por 'x' ou 'X'
    const sets = placar.replace(/\s/g, '').split(/[xX]/)
    if (sets.length !== 2) return { games1: 0, games2: 0 }
    
    const games1 = parseInt(sets[0]) || 0
    const games2 = parseInt(sets[1]) || 0
    
    return { games1, games2 }
  }

  // Calcular estatísticas dos jogadores com nova regra de pontuação
  const calcularEstatisticas = () => {
    const stats = {}
    
    jogadores.forEach(jogador => {
      stats[jogador] = {
        nome: jogador,
        jogos: 0,
        vitorias: 0,
        derrotas: 0,
        pontos: 0,
        gamesGanhos: 0,
        gamesPerdidos: 0
      }
    })

    partidas.forEach(partida => {
      if (partida.concluida) {
        stats[partida.jogador1].jogos++
        stats[partida.jogador2].jogos++
        
        // Extrair games do placar
        const { games1, games2 } = extrairGames(partida.placar)
        
        if (partida.vencedor === partida.jogador1) {
          stats[partida.jogador1].vitorias++
          stats[partida.jogador1].pontos += 1
          stats[partida.jogador2].derrotas++
          
          // Contabilizar games
          stats[partida.jogador1].gamesGanhos += games1
          stats[partida.jogador1].gamesPerdidos += games2
          stats[partida.jogador2].gamesGanhos += games2
          stats[partida.jogador2].gamesPerdidos += games1
        } else if (partida.vencedor === partida.jogador2) {
          stats[partida.jogador2].vitorias++
          stats[partida.jogador2].pontos += 1
          stats[partida.jogador1].derrotas++
          
          // Contabilizar games
          stats[partida.jogador2].gamesGanhos += games2
          stats[partida.jogador2].gamesPerdidos += games1
          stats[partida.jogador1].gamesGanhos += games1
          stats[partida.jogador1].gamesPerdidos += games2
        }
      }
    })

    return Object.values(stats).sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos
      if (b.gamesGanhos !== a.gamesGanhos) return b.gamesGanhos - a.gamesGanhos
      return a.gamesPerdidos - b.gamesPerdidos
    })
  }

  // Obter partidas de um jogador específico
  const partidasDoJogador = (jogador) => {
    return partidas.filter(partida => 
      partida.jogador1 === jogador || partida.jogador2 === jogador
    )
  }

  // Filtrar partidas baseado nos filtros selecionados
  const partidasFiltradas = () => {
    let partidasFiltradas = partidas

    if (filtroJogador) {
      partidasFiltradas = partidasFiltradas.filter(partida => 
        partida.jogador1 === filtroJogador || partida.jogador2 === filtroJogador
      )
    }

    if (filtroStatus === 'realizadas') {
      partidasFiltradas = partidasFiltradas.filter(partida => partida.concluida)
    } else if (filtroStatus === 'pendentes') {
      partidasFiltradas = partidasFiltradas.filter(partida => !partida.concluida)
    }

    return partidasFiltradas
  }

  const estatisticas = calcularEstatisticas()
  const totalPartidas = partidas.length
  const partidasConcluidas = partidas.filter(p => p.concluida).length

  // Função para obter ícone de posição
  const obterIconePosicao = (posicao) => {
    switch(posicao) {
      case 0: return <Crown className="w-6 h-6 text-yellow-500" />
      case 1: return <Medal className="w-6 h-6 text-gray-400" />
      case 2: return <Award className="w-6 h-6 text-orange-500" />
      case 3: return <Star className="w-6 h-6 text-blue-500" />
      default: return <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-600">{posicao + 1}</div>
    }
  }

  // Função para determinar se o jogador está classificado (top 4)
  const estaClassificado = (posicao) => posicao < 4

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Copa 7 - Amigos do Tennis
            </h1>
          </div>
          <p className="text-lg text-slate-600 font-medium">Sistema de gerenciamento do torneio - Todos contra todos</p>
          
          {/* Barra de Status de Autenticação */}
          <div className="flex justify-center items-center gap-6 mt-6">
            <Badge className="text-sm px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <Users className="w-4 h-4 mr-2" />
              {jogadores.length} Jogadores
            </Badge>
            <Badge className="text-sm px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <Calendar className="w-4 h-4 mr-2" />
              {partidasConcluidas}/{totalPartidas} Partidas
            </Badge>
            <Badge className="text-sm px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <Target className="w-4 h-4 mr-2" />
              {Math.round((partidasConcluidas/totalPartidas) * 100)}% Completo
            </Badge>
            
            {/* Status de Autenticação */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Badge className="text-sm px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                    <Unlock className="w-4 h-4 mr-1" />
                    Admin
                  </Badge>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="text-xs border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm px-3 py-2 border-slate-300 text-slate-600">
                    <Eye className="w-4 h-4 mr-1" />
                    Visualização
                  </Badge>
                  <Button
                    onClick={openLoginModal}
                    variant="outline"
                    size="sm"
                    className="text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Login Admin
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de Login */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
              <div className="text-center mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Acesso Administrativo</h2>
                <p className="text-slate-600">Digite a senha para editar os resultados das partidas</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="admin-password" className="text-sm font-semibold text-slate-700">
                    Senha do Administrador:
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      placeholder="Digite a senha"
                      className="pr-10 border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">{loginError}</p>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowLoginModal(false)}
                    variant="outline"
                    className="flex-1 border-2 border-slate-300 hover:bg-slate-50"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleLogin}
                    disabled={!loginPassword}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 text-center">
                  <strong>Modo Visualização:</strong> Todos podem ver os resultados<br/>
                  <strong>Modo Admin:</strong> Apenas administradores podem editar
                </p>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="classificacao" className="w-full">
          {/* Layout de Menu 2x3 para incluir Regulamento */}
          <TabsList className="grid w-full grid-cols-2 grid-rows-3 gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 h-auto p-2">
            <TabsTrigger value="classificacao" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white h-12">
              <Trophy className="w-4 h-4 mr-2" />
              Classificação
            </TabsTrigger>
            <TabsTrigger value="partidas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white h-12">
              <Zap className="w-4 h-4 mr-2" />
              Todas as Partidas
            </TabsTrigger>
            <TabsTrigger value="jogador" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white h-12">
              <Users className="w-4 h-4 mr-2" />
              Por Jogador
            </TabsTrigger>
            <TabsTrigger value="estatisticas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white h-12">
              <Target className="w-4 h-4 mr-2" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="regulamento" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white h-12 col-span-2">
              <FileText className="w-4 h-4 mr-2" />
              Regulamento
            </TabsTrigger>
          </TabsList>

          {/* Aba Classificação */}
          <TabsContent value="classificacao">
            <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-slate-200">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Trophy className="text-yellow-500 w-7 h-7" />
                  Ranking Detalhado
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Classificação atual do torneio (1 ponto por vitória • Desempate por games ganhos)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {/* Zona de Classificação */}
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-bold text-green-700">ZONA DE CLASSIFICAÇÃO - TOP 4</h3>
                  </div>
                  <p className="text-sm text-green-600">Os 4 primeiros colocados estão classificados</p>
                </div>

                <div className="space-y-4">
                  {estatisticas.map((jogador, index) => (
                    <div key={jogador.nome} className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                      estaClassificado(index) 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md ring-2 ring-green-200' 
                        : index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 shadow-md' :
                        index === 1 ? 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-300' :
                        index === 2 ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300' :
                        'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center">
                          {obterIconePosicao(index)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${coresJogadores[jogador.nome]}`}>
                              {jogador.nome}
                            </div>
                            {estaClassificado(index) && (
                              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 text-xs">
                                ✓ CLASSIFICADO
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-slate-600 font-medium space-y-1">
                            <div>{jogador.jogos} jogos • {jogador.vitorias}V {jogador.derrotas}D</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{jogador.pontos}</div>
                        <div className="text-sm text-slate-500 font-medium">pontos</div>
                        <div className="text-xs text-slate-400 mt-1">
                          Saldo: {jogador.gamesGanhos - jogador.gamesPerdidos > 0 ? '+' : ''}{jogador.gamesGanhos - jogador.gamesPerdidos}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Todas as Partidas */}
          <TabsContent value="partidas">
            <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-200">
                <CardTitle className="text-2xl">Todas as Partidas</CardTitle>
                <CardDescription className="text-slate-600">
                  {isAuthenticated ? 'Gerencie os resultados de todas as partidas do torneio' : 'Visualize os resultados de todas as partidas do torneio'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {/* Aviso de Modo Visualização */}
                {!isAuthenticated && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="text-sm font-bold text-blue-700">Modo Visualização</h3>
                        <p className="text-xs text-blue-600">Você está visualizando os resultados. Para editar, faça login como administrador.</p>
                      </div>
                      <Button
                        onClick={openLoginModal}
                        size="sm"
                        className="ml-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      >
                        <Shield className="w-4 h-4 mr-1" />
                        Login
                      </Button>
                    </div>
                  </div>
                )}

                {/* Filtros */}
                <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Filtro por Jogador */}
                    <div className="flex items-center gap-4">
                      <Filter className="w-5 h-5 text-slate-600" />
                      <Label htmlFor="filtro-jogador" className="text-sm font-semibold text-slate-700">
                        Filtrar por Jogador:
                      </Label>
                      <div className="flex-1 flex gap-2">
                        <select 
                          id="filtro-jogador"
                          value={filtroJogador}
                          onChange={(e) => setFiltroJogador(e.target.value)}
                          className="flex-1 p-2 border-2 border-slate-200 rounded-lg bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm"
                        >
                          <option value="">🎾 Todos os jogadores</option>
                          {jogadores.map(jogador => (
                            <option key={jogador} value={jogador}>
                              🏆 {jogador}
                            </option>
                          ))}
                        </select>
                        {filtroJogador && (
                          <Button
                            onClick={() => setFiltroJogador('')}
                            variant="outline"
                            size="sm"
                            className="px-2 border-2 border-slate-300 hover:border-red-400 hover:bg-red-50 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Filtro por Status */}
                    <div className="flex items-center gap-4">
                      <CheckCircle className="w-5 h-5 text-slate-600" />
                      <Label htmlFor="filtro-status" className="text-sm font-semibold text-slate-700">
                        Filtrar por Status:
                      </Label>
                      <div className="flex-1 flex gap-2">
                        <select 
                          id="filtro-status"
                          value={filtroStatus}
                          onChange={(e) => setFiltroStatus(e.target.value)}
                          className="flex-1 p-2 border-2 border-slate-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
                        >
                          <option value="">📋 Todas as partidas</option>
                          <option value="realizadas">✅ Partidas realizadas</option>
                          <option value="pendentes">⏳ Partidas pendentes</option>
                        </select>
                        {filtroStatus && (
                          <Button
                            onClick={() => setFiltroStatus('')}
                            variant="outline"
                            size="sm"
                            className="px-2 border-2 border-slate-300 hover:border-red-400 hover:bg-red-50 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {(filtroJogador || filtroStatus) && (
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                        Mostrando {partidasFiltradas().length} partidas
                      </Badge>
                      {filtroJogador && (
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${coresJogadores[filtroJogador]}`}>
                          {filtroJogador}
                        </span>
                      )}
                      {filtroStatus && (
                        <Badge variant="outline" className="border-blue-300 text-blue-600">
                          {filtroStatus === 'realizadas' ? '✅ Realizadas' : '⏳ Pendentes'}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid gap-6">
                  {partidasFiltradas().map((partida) => (
                    <PartidaCard 
                      key={partida.id} 
                      partida={partida} 
                      onUpdate={atualizarPartida}
                      destacarJogador={filtroJogador}
                      coresJogadores={coresJogadores}
                      coresBorda={coresBorda}
                      isAuthenticated={isAuthenticated}
                      onLoginRequest={openLoginModal}
                    />
                  ))}
                  
                  {partidasFiltradas().length === 0 && (filtroJogador || filtroStatus) && (
                    <div className="text-center py-12 text-slate-500">
                      <Filter className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-lg font-medium">Nenhuma partida encontrada com os filtros aplicados</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Por Jogador */}
          <TabsContent value="jogador">
            <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-slate-200">
                <CardTitle className="text-2xl">Partidas por Jogador</CardTitle>
                <CardDescription className="text-slate-600">
                  Visualize as partidas de um jogador específico
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <Label htmlFor="jogador-select" className="text-lg font-semibold text-slate-700">Selecionar Jogador:</Label>
                  <select 
                    id="jogador-select"
                    value={jogadorSelecionado}
                    onChange={(e) => setJogadorSelecionado(e.target.value)}
                    className="w-full mt-3 p-3 border-2 border-slate-200 rounded-xl bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  >
                    {jogadores.map(jogador => (
                      <option key={jogador} value={jogador}>{jogador}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-6">
                  {partidasDoJogador(jogadorSelecionado).map((partida) => (
                    <PartidaCard 
                      key={partida.id} 
                      partida={partida} 
                      onUpdate={atualizarPartida}
                      destacarJogador={jogadorSelecionado}
                      coresJogadores={coresJogadores}
                      coresBorda={coresBorda}
                      isAuthenticated={isAuthenticated}
                      onLoginRequest={openLoginModal}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Estatísticas */}
          <TabsContent value="estatisticas">
            <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-slate-200">
                <CardTitle className="text-2xl">Estatísticas do Torneio</CardTitle>
                <CardDescription className="text-slate-600">
                  Resumo geral do andamento do torneio
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{totalPartidas}</div>
                    <div className="text-slate-600 font-medium">Total de Partidas</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                    <div className="text-4xl font-bold text-green-600 mb-2">{partidasConcluidas}</div>
                    <div className="text-slate-600 font-medium">Partidas Concluídas</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
                    <div className="text-4xl font-bold text-orange-600 mb-2">{totalPartidas - partidasConcluidas}</div>
                    <div className="text-slate-600 font-medium">Partidas Restantes</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-slate-700 mb-6">Progresso por Jogador</h3>
                  <div className="space-y-4">
                    {estatisticas.map((jogador) => {
                      const totalJogosJogador = jogadores.length - 1
                      const progresso = (jogador.jogos / totalJogosJogador) * 100
                      return (
                        <div key={jogador.nome} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold min-w-[80px] text-center ${coresJogadores[jogador.nome]}`}>
                            {jogador.nome}
                          </div>
                          <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${progresso}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-semibold text-slate-600 min-w-[60px] text-right">
                            {jogador.jogos}/{totalJogosJogador}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Regulamento */}
          <TabsContent value="regulamento">
            <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-slate-200">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <FileText className="text-red-500 w-7 h-7" />
                  Regulamento do Torneio
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Regras oficiais da Copa 7 - Amigos do Tennis
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="max-w-4xl mx-auto">
                  {/* Cabeçalho do Regulamento */}
                  <div className="text-center mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border-2 border-red-200">
                    <h2 className="text-3xl font-bold text-red-700 mb-2">Copa 7 - Amigos do Tennis</h2>
                    <p className="text-lg text-red-600 font-semibold">Regulamento Oficial</p>
                  </div>

                  {/* Conteúdo do Regulamento */}
                  <div className="space-y-8">
                    {/* Participantes */}
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-blue-700">Participantes</h3>
                      </div>
                      <p className="text-lg text-blue-800 font-semibold">9 atletas.</p>
                    </div>

                    {/* Primeira Fase */}
                    <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Zap className="w-6 h-6 text-green-600" />
                        <h3 className="text-xl font-bold text-green-700">Primeira Fase</h3>
                      </div>
                      <div className="space-y-3 text-green-800">
                        <p className="text-lg font-semibold">Todos jogam contra todos.</p>
                        <p className="text-lg font-semibold">Cada atleta fará 8 jogos.</p>
                        <p className="text-lg font-semibold">Total de 36 jogos!</p>
                        <p className="text-lg font-semibold">Cada jogo terá 2 TIE-BREAKS.</p>
                        <p className="text-lg font-semibold">Em caso de empate, será disputado um MINI-TIE-BREAK, até 5 pontos, para desempate.</p>
                      </div>
                    </div>

                    {/* Classificação */}
                    <div className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Trophy className="w-6 h-6 text-yellow-600" />
                        <h3 className="text-xl font-bold text-yellow-700">Classificação</h3>
                      </div>
                      <p className="text-lg text-yellow-800 font-semibold">Os 4 melhores se classificam para as semifinais.</p>
                    </div>

                    {/* Critério de Desempate */}
                    <div className="p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border-2 border-indigo-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Target className="w-6 h-6 text-indigo-600" />
                        <h3 className="text-xl font-bold text-indigo-700">Critério de Desempate</h3>
                      </div>
                      <div className="space-y-3 text-indigo-800">
                        <p className="text-lg font-semibold">Em caso de empate entre 2 jogadores, será o confronto direto.</p>
                        <p className="text-lg font-semibold">Em caso de empate de 3 ou mais jogadores: saldo de games dos jogos realizados entre os jogadores empatados, excluindo-se os jogos com os demais jogadores.</p>
                        <p className="text-lg font-semibold">No desempate, deverá ser considerado apenas os games nos 2 primeiros TIE-BREAKS disputados.</p>
                      </div>
                    </div>

                    {/* Local dos Jogos */}
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                      <div className="flex items-center gap-3 mb-4">
                        <MapPin className="w-6 h-6 text-purple-600" />
                        <h3 className="text-xl font-bold text-purple-700">Local dos Jogos</h3>
                      </div>
                      <p className="text-lg text-purple-800 font-semibold">Jogos no ILÉ SAINT-LOUIS ou em local combinado pelos atletas.</p>
                    </div>

                    {/* Fair Play */}
                    <div className="p-8 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border-2 border-emerald-200 text-center">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Award className="w-8 h-8 text-emerald-600" />
                        <h3 className="text-2xl font-bold text-emerald-700">Lema do Torneio</h3>
                      </div>
                      <p className="text-2xl text-emerald-800 font-bold tracking-wide">FAIR PLAY É O NOSSO LEMA!</p>
                    </div>

                    {/* Resumo Visual */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                      <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200">
                        <div className="text-4xl font-bold text-slate-600 mb-2">9</div>
                        <div className="text-slate-600 font-medium">Atletas</div>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200">
                        <div className="text-4xl font-bold text-slate-600 mb-2">36</div>
                        <div className="text-slate-600 font-medium">Jogos Total</div>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200">
                        <div className="text-4xl font-bold text-slate-600 mb-2">4</div>
                        <div className="text-slate-600 font-medium">Classificados</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Componente para cada partida
function PartidaCard({ partida, onUpdate, destacarJogador, coresJogadores, coresBorda, isAuthenticated, onLoginRequest }) {
  const [vencedor, setVencedor] = useState(partida.vencedor)
  const [placar, setPlacar] = useState(partida.placar)

  const salvarResultado = () => {
    if (!isAuthenticated) {
      onLoginRequest()
      return
    }
    onUpdate(partida.id, vencedor, placar)
  }

  const limparResultado = () => {
    if (!isAuthenticated) {
      onLoginRequest()
      return
    }
    setVencedor('')
    setPlacar('')
    onUpdate(partida.id, '', '')
  }

  // Verificar se a partida deve ser destacada
  const partidaDestacada = destacarJogador && (partida.jogador1 === destacarJogador || partida.jogador2 === destacarJogador)

  return (
    <div className={`p-6 border-2 rounded-xl transition-all duration-300 hover:shadow-lg ${
      partida.concluida 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md' 
        : partidaDestacada
        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md ring-2 ring-blue-200'
        : 'bg-white border-slate-200 hover:border-slate-300'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className={`px-3 py-2 rounded-full text-sm font-semibold transition-all ${
            destacarJogador === partida.jogador1 
              ? `${coresJogadores[partida.jogador1]} ring-4 ring-blue-200 scale-110` 
              : coresJogadores[partida.jogador1]
          }`}>
            {partida.jogador1}
          </span>
          <span className="text-slate-500 font-bold text-lg">vs</span>
          <span className={`px-3 py-2 rounded-full text-sm font-semibold transition-all ${
            destacarJogador === partida.jogador2 
              ? `${coresJogadores[partida.jogador2]} ring-4 ring-blue-200 scale-110` 
              : coresJogadores[partida.jogador2]
          }`}>
            {partida.jogador2}
          </span>
        </div>
        <div className="flex gap-2">
          {partidaDestacada && (
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 px-3 py-1">
              🎯 Destacada
            </Badge>
          )}
          {partida.concluida && (
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-3 py-1">
              ✓ Concluída
            </Badge>
          )}
          {!isAuthenticated && (
            <Badge variant="outline" className="border-slate-300 text-slate-600 px-3 py-1">
              <Eye className="w-3 h-3 mr-1" />
              Visualização
            </Badge>
          )}
        </div>
      </div>

      {partida.concluida && (
        <div className="mb-4 p-4 bg-white rounded-lg border-2 border-green-200">
          <div className="text-sm text-slate-600 font-medium mb-1">Resultado:</div>
          <div className="font-bold text-green-700 text-lg">
            🏆 Vencedor: <span className={`px-2 py-1 rounded ${coresJogadores[partida.vencedor]}`}>{partida.vencedor}</span> | 
            📊 Placar: {partida.placar}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor={`vencedor-${partida.id}`} className="text-sm font-semibold text-slate-700">Vencedor:</Label>
          <select 
            id={`vencedor-${partida.id}`}
            value={vencedor}
            onChange={(e) => setVencedor(e.target.value)}
            disabled={!isAuthenticated}
            className={`w-full mt-2 p-3 border-2 rounded-lg transition-all ${
              isAuthenticated 
                ? 'border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                : 'border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed'
            }`}
          >
            <option value="">Selecionar vencedor</option>
            <option value={partida.jogador1}>{partida.jogador1}</option>
            <option value={partida.jogador2}>{partida.jogador2}</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor={`placar-${partida.id}`} className="text-sm font-semibold text-slate-700">Placar:</Label>
          <Input
            id={`placar-${partida.id}`}
            type="text"
            placeholder="Ex: 7 x 5"
            value={placar}
            onChange={(e) => setPlacar(e.target.value)}
            disabled={!isAuthenticated}
            className={`mt-2 border-2 transition-all ${
              isAuthenticated 
                ? 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                : 'border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed'
            }`}
          />
        </div>
        
        <div className="flex items-end gap-2">
          <Button 
            onClick={salvarResultado}
            disabled={!vencedor || !placar}
            className={`flex-1 transition-all duration-300 ${
              isAuthenticated 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0' 
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isAuthenticated ? '💾 Salvar' : '🔒 Bloqueado'}
          </Button>
          {partida.concluida && isAuthenticated && (
            <Button 
              onClick={limparResultado}
              variant="outline"
              className="border-2 border-slate-300 hover:border-red-400 hover:bg-red-50 transition-all duration-300"
              size="sm"
            >
              🗑️
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
{
  "name": "torneio-tenis",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.0.1",
    "@radix-ui/react-accordion": "^1.2.10",
    "@radix-ui/react-alert-dialog": "^1.1.13",
    "@radix-ui/react-aspect-ratio": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.9",
    "@radix-ui/react-checkbox": "^1.3.1",
    "@radix-ui/react-collapsible": "^1.1.10",
    "@radix-ui/react-context-menu": "^2.2.14",
    "@radix-ui/react-dialog": "^1.1.13",
    "@radix-ui/react-dropdown-menu": "^2.1.14",
    "@radix-ui/react-hover-card": "^1.1.13",
    "@radix-ui/react-label": "^2.1.6",
    "@radix-ui/react-menubar": "^1.1.14",
    "@radix-ui/react-navigation-menu": "^1.2.12",
    "@radix-ui/react-popover": "^1.1.13",
    "@radix-ui/react-progress": "^1.1.6",
    "@radix-ui/react-radio-group": "^1.3.6",
    "@radix-ui/react-scroll-area": "^1.2.8",
    "@radix-ui/react-select": "^2.2.4",
    "@radix-ui/react-separator": "^1.1.6",
    "@radix-ui/react-slider": "^1.3.4",
    "@radix-ui/react-slot": "^1.2.2",
    "@radix-ui/react-switch": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.11",
    "@radix-ui/react-toggle": "^1.1.8",
    "@radix-ui/react-toggle-group": "^1.1.9",
    "@radix-ui/react-tooltip": "^1.2.6",
    "@tailwindcss/vite": "^4.1.7",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.15.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.510.0",
    "next-themes": "^0.4.6",
    "react": "^19.1.0",
    "react-day-picker": "8.10.1",
    "react-dom": "^19.1.0",
    "react-hook-form": "^7.56.3",
    "react-resizable-panels": "^3.0.2",
    "react-router-dom": "^7.6.1",
    "recharts": "^2.15.3",
    "sonner": "^2.0.3",
    "tailwind-merge": "^3.3.0",
    "tailwindcss": "^4.1.7",
    "vaul": "^1.1.2",
    "zod": "^3.24.4"
  },
  "devDependencies": {
    "@eslint/js": "^9.25.0",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.4.1",
    "eslint": "^9.25.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^16.0.0",
    "tw-animate-css": "^1.2.9",
    "vite": "^6.3.5"
  },
  "packageManager": "pnpm@10.4.1+sha512.c753b6c3ad7afa13af388fa6d808035a008e30ea9993f58c6663e2bc5ff21679aa834db094987129aa4d488b86df57f7b634981b2f827cdcacc698cc0cfb88af"
}
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
