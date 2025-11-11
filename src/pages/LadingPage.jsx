import React, { useState, useEffect, Suspense } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './LandingPage.module.css';
import Toast from '../components/Toast/Toast';

// ICONS / ASSETS
import LogoImage from '../assets/logo-seuestudio.svg';
import SoundIcon from '../assets/sound.png';
import LinkIcon from '../assets/link.png';
import FeatureAI from '../assets/sound.png';
import FeatureWeb3 from '../assets/link.png';
import FeatureRoyalties from '../assets/save-money.png';

const Web3Icon = () => <img src={FeatureWeb3} alt="Web3" className={styles.featureIconImage} />;
const AiIcon = () => <img src={FeatureAI} alt="AI" className={styles.featureIconImage} />;
const MusicIcon = () => <img src={SoundIcon} alt="Music" className={styles.web3IconImage} />;
const NftIcon = () => <img src={LinkIcon} alt="NFT" className={styles.web3IconImage} />;
const RoyaltiesIcon = () => <img src={FeatureRoyalties} alt="Royalties" className={styles.featureIconImage} />;
const ChevronDown = () => <span className={styles.chevronDown}>↓</span>;

/* ===========================
   CONFIGURAÇÃO - WEB3FORMS
   =========================== */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

/* ===========================
   UTILITÁRIOS
   =========================== */
async function fetchWithTimeout(url, options = {}, timeout = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('timeout');
    }
    throw error;
  }
}

function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!regex.test(email)) return false;
  
  const [local, domain] = email.split('@');
  if (!local || !domain) return false;
  if (local.length > 64 || domain.length > 255) return false;
  
  return true;
}

const ERROR_MESSAGES = {
  network: 'Problema de conexão. Verifique sua internet e tente novamente.',
  timeout: 'A requisição demorou demais. Tente novamente.',
  validation: 'Verifique as informações e tente novamente.',
  server: 'Nossos servidores estão ocupados. Aguarde um momento.',
  spam: 'Seu e-mail foi marcado como spam. Use um e-mail diferente.',
  invalid_key: 'Problema de configuração. Entre em contato com o suporte.',
  default: 'Algo deu errado. Tente novamente em instantes.'
};

function getUserFriendlyError(error) {
  console.log('Error details:', error);
  
  if (error.message === 'timeout') return ERROR_MESSAGES.timeout;
  if (error.message?.includes('Failed to fetch')) return ERROR_MESSAGES.network;
  if (error.message?.includes('400')) return ERROR_MESSAGES.spam;
  if (error.message?.includes('401')) return ERROR_MESSAGES.invalid_key;
  if (error.message?.includes('spam')) return ERROR_MESSAGES.spam;
  
  return ERROR_MESSAGES.default;
}

/* ============================
   INTEGRAÇÃO DIFY - SIMPLIFICADA
   ============================ */
const DifyChatIntegration = () => {
  useEffect(() => {
    // Configuração do Dify
    window.difyChatbotConfig = {
      token: '0GvHj0wC6k0AKGMx',
      inputs: {
        platform: 'SeuEstúdio.ai'
      }
    };

    // Evita carregar duplicado
    if (document.getElementById('dify-script')) return;

    const script = document.createElement('script');
    script.id = 'dify-script';
    script.src = 'https://udify.app/embed.min.js';
    script.defer = true;
    
    script.onload = () => {
      console.log('Dify chatbot carregado com sucesso');
    };

    script.onerror = (error) => {
      console.error('Failed to load Dify chatbot script:', error);
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('dify-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return null;
};

/* ============================
   COMPONENTE PRINCIPAL
   ============================ */
const LandingPage = () => {
  const sliderSettings = { 
    dots: true, 
    infinite: true, 
    speed: 500, 
    slidesToShow: 1, 
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 5000, 
    arrows: true, 
    pauseOnHover: true,
    fade: true
  };

  const [formStatus, setFormStatus] = useState({ 
    loading: false, 
    success: false, 
    error: false, 
    message: '' 
  });
  const [headerScrolled, setHeaderScrolled] = useState(false);

  // Verificar WebAssembly
  useEffect(() => {
    const checkWebAssemblySupport = async () => {
      try {
        if (typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function') {
          console.log('WebAssembly suportado');
        } else {
          console.warn('WebAssembly não suportado');
        }
      } catch (error) {
        console.warn('WebAssembly error:', error);
      }
    };
    
    checkWebAssemblySupport();
  }, []);

  // Verificar chave Web3Forms
  useEffect(() => {
    if (!WEB3FORMS_KEY) {
      console.error('Web3Forms access key não encontrada!');
      setFormStatus({ 
        loading: false, 
        success: false, 
        error: true, 
        message: 'Erro de configuração. Chave Web3Forms não encontrada.' 
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { 
      icon: <AiIcon />, 
      title: "Co-criação com IA", 
      description: "Modelos generativos de última geração para composições, beats e letras inteligentes.", 
      items: ["Geração de stems inteligentes", "Composição assistida por IA", "Mastering automático"]
    },
    { 
      icon: <Web3Icon />, 
      title: "Web3 & NFTs", 
      description: "Minte sua música como NFT e mantenha controle total sobre sua propriedade intelectual.", 
      items: ["Minting simplificado em 1-clique", "Splits automáticos de royalties", "Carteira Web3 integrada"]
    },
    { 
      icon: <RoyaltiesIcon />, 
      title: "Royalties Automatizados", 
      description: "Distribuição transparente e instantânea via smart contracts na blockchain.", 
      items: ["Split por colaborador", "Pagamentos diretos em cripto", "Relatórios em tempo real"]
    }
  ];

  const stats = [
    { number: "100%", label: "Controle da Propriedade" }, 
    { number: "$0", label: "Taxas Iniciais" }, 
    { number: "Web3", label: "Royalties Automatizados" }, 
    { number: "24/7", label: "Co-piloto Criativo" }
  ];

  const testimonials = [
    { 
      text: "A plataforma automatizou completamente nossa distribuição e deixou os splits de royalties cristalinos. Essencial para qualquer trabalho colaborativo sério.", 
      author: "Alex V.", 
      role: "Artista & Manager" 
    },
    { 
      text: "A IA me ajudou a finalizar faixas em horas ao invés de dias. A geração de stems é um divisor de águas para produtores independentes.", 
      author: "Lara M.", 
      role: "Produtora Musical" 
    },
    { 
      text: "Finalmente uma solução que entende as necessidades dos artistas. Web3 sem complicação, IA que realmente ajuda no processo criativo.", 
      author: "Rafael T.", 
      role: "Compositor" 
    }
  ];

  const web3Features = [
    { icon: <NftIcon />, text: "NFTs de utilidade real" },
    { icon: <RoyaltiesIcon />, text: "Pagamentos automáticos" },
    { icon: <MusicIcon />, text: "Proteção do master" }
  ];

  const steps = [
    { number: "1", title: "Co-Crie", description: "Use IA generativa para criar ideias, stems e arranjos musicais únicos." },
    { number: "2", title: "Minte", description: "Transforme seu master final em NFT com splits automáticos pré-configurados." },
    { number: "3", title: "Receba", description: "Royalties distribuídos automaticamente via smart contracts na blockchain." }
  ];

  const SubmitButton = ({ loading, children }) => (
    <button 
      type="submit" 
      className={`${styles.ctaButtonPrimary} ${loading ? styles.loading : ''}`} 
      disabled={loading}
    >
      {loading ? (
        <span className={styles.buttonSpinner} aria-hidden="true" />
      ) : (
        children
      )}
    </button>
  );

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim();
    
    // Verificar se a chave existe
    if (!WEB3FORMS_KEY) {
      setFormStatus({ 
        loading: false, 
        success: false, 
        error: true, 
        message: 'Erro de configuração. Entre em contato com o suporte.' 
      });
      return;
    }
    
    if (!isValidEmail(email)) {
      setFormStatus({ 
        loading: false, 
        success: false, 
        error: true, 
        message: 'Por favor, insira um e-mail válido.' 
      });
      return;
    }
    
    setFormStatus({ loading: true, success: false, error: false, message: '' });
    
    try {
      // Usar FormData que é mais compatível com Web3Forms
      const formData = new FormData();
      formData.append('access_key', WEB3FORMS_KEY);
      formData.append('email', email);
      formData.append('subject', 'Nova inscrição - Waitlist SeuEstúdio.ai');
      formData.append('from_name', 'SeuEstúdio.ai');
      formData.append('botcheck', ''); // Campo honeypot vazio
      
      console.log('Enviando para Web3Forms:', { 
        email: email, 
        hasKey: !!WEB3FORMS_KEY 
      });
      
      const res = await fetchWithTimeout(
        WEB3FORMS_URL, 
        { 
          method: 'POST', 
          body: formData // Usar FormData em vez de JSON
        },
        15000
      );
      
      console.log('Status da resposta:', res.status);
      
      let data;
      try {
        data = await res.json();
        console.log('Resposta Web3Forms:', data);
      } catch (parseError) {
        console.error('Erro ao parsear resposta:', parseError);
        throw new Error('Resposta inválida do servidor');
      }
      
      if (res.ok && data.success) {
        setFormStatus({ 
          loading: false, 
          success: true, 
          error: false, 
          message: '🎉 Sucesso! Você está na lista de acesso VIP. Em breve entraremos em contato!' 
        });
        form.reset();
        
        // Analytics
        if (window.gtag) {
          window.gtag('event', 'waitlist_submit', { method: 'form' });
        }
      } else {
        // Tratamento específico de erros do Web3Forms
        if (data.message?.toLowerCase().includes('spam')) {
          throw new Error(ERROR_MESSAGES.spam);
        } else if (data.message?.toLowerCase().includes('invalid access key')) {
          throw new Error(ERROR_MESSAGES.invalid_key);
        } else if (data.message) {
          throw new Error(data.message);
        } else {
          throw new Error(`Erro ${res.status}: ${data.message || 'Erro desconhecido'}`);
        }
      }
    } catch (err) {
      console.error('Waitlist error:', err);
      
      const userMessage = getUserFriendlyError(err);
      
      setFormStatus({ 
        loading: false, 
        success: false, 
        error: true, 
        message: userMessage 
      });
    } finally {
      // Limpar mensagem após 8 segundos
      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, message: '' }));
      }, 8000);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={`${styles.header} ${headerScrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.headerContent}>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className={styles.logoButton}
            aria-label="Voltar ao topo"
          >
            <img src={LogoImage} alt="Logo SeuEstúdio.ai" className={styles.logoImage}/>
          </button>
          <button 
            className={styles.ctaButtonHeader} 
            onClick={() => scrollToSection('final-cta')}
          >
            Garantir Acesso VIP
          </button>
        </div>
      </header>

      {/* Chat Dify Integrado */}
      <DifyChatIntegration />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Revolucione Sua <span className={styles.highlight}>Música</span> com IA & Web3
            </h1>
            <p className={styles.heroSubtitle}>
              Crie com inteligência artificial, proteja com blockchain e monetize com smart contracts. 
              Junte-se à revolução musical dos criadores independentes.
            </p>

            <div className={styles.waitlistFormContainer}>
              <form onSubmit={handleWaitlistSubmit} className={styles.waitlistForm}>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="seu@email.com" 
                  required 
                  className={styles.emailInput} 
                  disabled={formStatus.loading} 
                  aria-label="Seu e-mail para inscrição na lista VIP"
                />
                {/* Campo honeypot para bots - escondido */}
                <input 
                  type="checkbox" 
                  name="botcheck" 
                  className={styles.honeyPot} 
                  tabIndex="-1" 
                  autoComplete="off"
                />
                <SubmitButton loading={formStatus.loading}>
                  {formStatus.loading ? 'Entrando...' : 'Garantir Acesso VIP'}
                </SubmitButton>
              </form>
              {!WEB3FORMS_KEY && (
                <p style={{ 
                  marginTop: '12px', 
                  color: '#ff6b6b', 
                  fontSize: '0.9rem',
                  textAlign: 'center'
                }}>
                  ⚠️ Configuração incompleta. Entre em contato com o suporte.
                </p>
              )}
              <p style={{ 
                marginTop: '12px', 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                🎵 Ou clique no ícone do chat para conversar com nosso assistente IA especializado
              </p>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div 
              className={styles.scrollIndicator} 
              onClick={() => scrollToSection('stats')}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  scrollToSection('stats');
                }
              }}
            >
              <span>Descubra Como Funciona</span>
              <ChevronDown/>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection} id="stats">
        <div className={styles.statsContainer}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Tecnologia para Criadores</h2>
          <p className={styles.sectionSubtitle}>
            Ferramentas profissionais acessíveis para artistas e produtores independentes.
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              <ul className={styles.featureList}>
                {feature.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Web3 Section */}
      <section className={styles.web3Section}>
        <div className={styles.web3Content}>
          <div className={styles.web3Text}>
            <h2>Domínio Total com Blockchain</h2>
            <p>
              Nossos smart contracts distribuem royalties de forma transparente, automática e auditável. 
              Você mantém 100% do controle criativo e financeiro sobre sua música, sem intermediários.
            </p>
            <div className={styles.web3Features}>
              {web3Features.map((feature, index) => (
                <div key={index} className={styles.web3Feature}>
                  {feature.icon}
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.web3Visual}>
            <div className={styles.blockchainAnimation}>
              <div className={styles.block}>Criação</div>
              <div className={styles.chain}>⛓️</div>
              <div className={styles.block}>NFT</div>
              <div className={styles.chain}>⛓️</div>
              <div className={styles.block}>Royalties</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <h2>Simples e Poderoso</h2>
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonialsSection}>
        <h2>O Que Os Criadores Dizem</h2>
        <Suspense fallback={<div className={styles.loadingSlider}>Carregando depoimentos...</div>}>
          <Slider {...sliderSettings} className={styles.testimonialsSlider}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialSlide}>
                <div className={styles.testimonialCard}>
                  <p className={styles.testimonialText}>"{testimonial.text}"</p>
                  <div className={styles.testimonialAuthor}>
                    <strong>{testimonial.author}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </Suspense>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta} id="final-cta">
        <div className={styles.ctaContent}>
          <h2>Junte-se à Revolução</h2>
          <p>
            Vagas limitadas para early adopters. Garanta seu acesso VIP à plataforma 
            que está reinventando a indústria musical para criadores independentes.
          </p>
          <div className={styles.waitlistFormContainer}>
            <form onSubmit={handleWaitlistSubmit} className={styles.waitlistForm}>
              <input 
                type="email" 
                name="email" 
                placeholder="seu@email.com" 
                required 
                className={styles.emailInput} 
                disabled={formStatus.loading} 
                aria-label="Seu e-mail para inscrição na lista VIP"
              />
              {/* Campo honeypot para bots - escondido */}
              <input 
                type="checkbox" 
                name="botcheck" 
                className={styles.honeyPot} 
                tabIndex="-1" 
                autoComplete="off"
              />
              <SubmitButton loading={formStatus.loading}>
                {formStatus.loading ? 'Entrando...' : 'Quero Meu Acesso VIP'}
              </SubmitButton>
            </form>
          </div>
        </div>
      </section>

      {/* Toast de feedback */}
      <Toast 
        message={formStatus.message} 
        type={formStatus.success ? 'success' : 'error'} 
        visible={Boolean(formStatus.message)} 
        onClose={() => setFormStatus(prev => ({ ...prev, message: '' }))} 
      />
    </div>
  );
};

export default LandingPage;