import { useState } from 'react'
import { dadosClima } from './dadosClima'
import { getInfoClima } from './codigosWmo'
import './App.css'

function nomeDoDia(dataStr, indice) {
  if (indice === 0) return 'Hoje'
  if (indice === 1) return 'Amanhã'
  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const data = new Date(dataStr + 'T00:00:00')
  return dias[data.getDay()]
}

function App() {
  const [busca, setBusca] = useState('')
  const [cidade, setCidade] = useState(dadosClima[0])

  function buscar() {
    const resultado = dadosClima.find(
      (item) => item.name.toLowerCase() === busca.toLowerCase()
    )
    if (resultado) setCidade(resultado)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') buscar()
  }

  if (!cidade) return null

  const climaAtual = getInfoClima(cidade.current.weather_code)

  return (
    <div className="app">
      <div className="primeira">
        <div className="logo">☀️</div>
        <div className="coluna">
          <h1>Sol Chuva</h1>
          <p>O tempo certo, onde você estiver</p>
        </div>
      </div>

      <div className="search-row">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite o nome de uma cidade..."
        />
        <button className="go" onClick={buscar}>Buscar</button>
      </div>

      <div className="chips">
        {dadosClima.map((item) => (
          <button
            key={item.id}
            className={`chip ${cidade.id === item.id ? 'active' : ''}`}
            onClick={() => setCidade(item)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="main-card">
        <div className="main-top">
          <div>
            <h2>{cidade.name}</h2>
            <p>{cidade.admin1} — {cidade.country}</p>
          </div>
        </div>

        <div className="temp-row">
          <div className="temp-icon">{climaAtual.icone}</div>
          <div>
            <div className="temp-num">{cidade.current.temperature_2m}°C</div>
            <div className="temp-desc">{climaAtual.descricao}</div>
          </div>
        </div>

        <div className="stats">
          <div className="stat">Sensação <b>{cidade.current.apparent_temperature}°C</b></div>
          <div className="stat">Umidade <b>{cidade.current.relative_humidity_2m}%</b></div>
          <div className="stat">Vento <b>{cidade.current.wind_speed_10m} km/h</b></div>
          <div className="stat">Precipitação <b>{cidade.current.precipitation} mm</b></div>
          <div className="stat">Índice UV <b>{cidade.current.uv_index}</b></div>
          <div className="stat">Nascer / Pôr do sol <b>{cidade.current.sunrise} / {cidade.current.sunset}</b></div>
        </div>
      </div>

      <div className="forecast-card">
        <p className="forecast-title">Previsão para os próximos {cidade.daily.length} dias</p>
        <div className="days">
          {cidade.daily.map((dia, indice) => {
            const info = getInfoClima(dia.weather_code)
            return (
              <div className="day" key={dia.date}>
                <div className="d">{nomeDoDia(dia.date, indice)}</div>
                <div className="ic">{info.icone}</div>
                <div className="cond">{info.descricao}</div>
                <div className="t">{dia.temperature_2m_max}° <span>{dia.temperature_2m_min}°</span></div>
                <div className="hum">💧 {dia.precipitation_probability_max}%</div>
              </div>
            )
          })}
        </div>
      </div>

      <footer>Sol Chuva • Trabalho escolar • 2026</footer>
    </div>
  )
}

export default App
