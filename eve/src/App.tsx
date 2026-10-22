import {
  createElement,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  getGetEveAccessSessionQueryKey,
  useGetEveAccessSession,
  useLogoutEveAccess,
  useVerifyEveAccess,
} from "@workspace/api-client-react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Pause,
  Play,
  RotateCcw,
  Volume2,
} from "lucide-react";

const queryClient = new QueryClient();
const asset = "/assets/";
const roomSrc = `${asset}images/Gemini_Generated_Image_qdjpahqdjpahqdjp_1792352212260.jpg`;
const librarySrc = `${asset}images/biblioteca_gotica_1792352212260.jpg`;
const ballroomSrc = `${asset}images/Gemini_Generated_Image_tx1ibctx1ibctx1i_1792352212260.jpg`;
const terraceSrc = `${asset}images/f15a2dec4b799b4f4d5654f1eec145e7_1792352212261.jpg`;
const princessCutoutSrc = `${asset}images/analy-final-birthday.png`;
const princeCutoutSrc = `${asset}images/analy-final-birthday.png`;
const letterAudio = `${asset}audio/ElevenLabs_2026-10-18T18_47_55_Max_-_Elearning_and_Documentary_1792352212261.mp3`;
const voiceAudio: Record<string, string> = {
  greeting: `${asset}audio/eve-greeting.mp3`,
  library: `${asset}audio/eve-basement.mp3`,
  bedroom: `${asset}audio/eve-bedroom.mp3`,
  ballroom: `${asset}audio/eve-ballroom.mp3`,
  terrace: `${asset}audio/eve-rooftop.mp3`,
};

const letterText = `Para a princesa que roubou meus pensamentos…

Minha querida,

Há coisas que nem mesmo o tempo consegue apagar. Algumas pessoas passam por nossas vidas como estrelas cadentes; outras permanecem, mesmo quando o mundo inteiro parece mudar.

Você… você é diferente.

Existe algo no seu olhar que me faz esquecer todas as palavras que ensaiei. E, por mais que eu tente encontrar uma explicação, sempre chego à mesma conclusão: há sentimentos que não foram feitos para serem explicados, apenas sentidos.

Talvez eu nunca consiga dizer tudo o que guardo dentro de mim. Talvez algumas palavras precisem permanecer escondidas entre estas linhas, esperando o momento certo para serem descobertas.

Mas, se algum dia você se sentir sozinha neste castelo, se a noite parecer longa demais ou se as estrelas deixarem de brilhar, lembre-se de uma coisa: em algum lugar, sob o mesmo céu, existe alguém que pensa em você mais do que consegue admitir.

Não prometo que o mundo será gentil. Não prometo que todos os caminhos serão fáceis. Mas, se você me permitir, gostaria de estar ao seu lado quando as luzes se apagarem e quando um novo amanhecer chegar.

Guarde esta carta como quem guarda um segredo.

E, quando terminar de lê-la, olhe para a lua.

Talvez você descubra que algumas histórias começam muito antes de seus protagonistas perceberem.

Com sentimentos que minhas palavras ainda não conseguem revelar,

Seu admirador secreto.`;

const finalText = `Oiiiii bestttttttttt, acho que eu me superei fazendo essa homenagem, eu quero sempre que vc se lembre, que eu vou estar do seu lado independente de qualquer coisa, quero que vc se lembre que eu te amo com todas as minhas forças e não te largo por nada, se eu fosse escrever tudo oq eu sinto pela nossa amizade acho que não caberia nesse site kkkkkkk

Maninha, eu profetizo bênçãos sobre a sua vida, eu profetizo bênçãos sobre a sua voz, e que quando vc abrir sua boca pra louvar, vai ser a voz de Deus vinda direta do trono DEle, profetizo bênçãos sobre a sua caminhada com Cristo, que vc nunca se esqueça de onde ele te tirou e aonde ele vai te colocar, que Deus abençoe sua ida para a Itália daqui a um ano ou talvez um ano e meio, é meio triste falar isso, mas pode ter certeza que até a gente se encontrar de novo, NINGUÉM, absolutamente NINGUÉM vai tomar seu lugar como minha melhor amiga, esse espaço já tem dona e está reservado exclusivamente pra vc até a Emmy chegar

Agora quero falar sobre como vc foi incrível pra mim e continua sendo, maninha, vc sempre foi luz, amor, paz, e carinho pra mim, vc veio até mim com um conjunto imenso de coisas boas, enquanto eu só tinha coisas ruins pra te agregar, e mesmo assim vc permaneceu do meu lado, e eu busco te retribuir isso todo santo dia, pq eu sinto que se eu passar um dia sem fazer algo por vc ou te fazer feliz, eu estou falhando na minha missão de ser melhor amigo de uma pessoa incrível igual vc

Agora vamos falar do Mike kkkk, eu profetizo que vc vai casar com ele, namorar, passar por todas as coisas de casal que vc quer, profetizo que vc vai ter uma lua de mel muito bonita sendo uma turnê pela Europa, e conhecendo todos aqueles lugares chiques que vc sempre sonhou, profetizo que seus filhos vão ser a coisa mais fofa desse mundo, se tem uma coisa que eu tenho certeza que o Mike vai ser, é sortudo e feliz, por te VOCÊ maninha

Eu te amo com todas as minhas forças Analy, minha eterna maninha, e minha eterna bestttttttttt ❤️💖💓💕💞💝💘

E feliz aniversário de 15 anossssss velhinha.`;

type Phase = "castle" | "library" | "bedroom" | "ballroom" | "terrace";
type AudioKind = "voice" | "letter" | null;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <Experience />
        </ErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function Experience() {
  const client = useQueryClient();
  const session = useGetEveAccessSession();
  const verify = useVerifyEveAccess();
  const logout = useLogoutEveAccess();
  const [phase, setPhase] = useState<Phase>("castle");
  const [code, setCode] = useState("");
  const [accessError, setAccessError] = useState("");
  const [notice, setNotice] = useState("");
  const [bookOpen, setBookOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [letterRead, setLetterRead] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [teddyMessage, setTeddyMessage] = useState(false);
  const [ballroomChoice, setBallroomChoice] = useState<
    "accept" | "decline" | null
  >(() => {
    try {
      const stored = localStorage.getItem("eve-ballroom-choice");
      return stored === "accept" || stored === "decline" ? stored : null;
    } catch {
      return null;
    }
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioKind, setAudioKind] = useState<AudioKind>(null);
  const [audioStatus, setAudioStatus] = useState("Pronta");
  const [activeVoice, setActiveVoice] = useState("");
  const [modelStatus, setModelStatus] = useState(
    "O modelo será preparado ao abrir o castelo.",
  );
  const [modelFailed, setModelFailed] = useState(false);
  const [danceVideoFailed, setDanceVideoFailed] = useState(false);
  const viewerRef = useRef<HTMLElement | null>(null);
  const danceVideoRef = useRef<HTMLVideoElement>(null);
  const fadeRef = useRef<number | null>(null);
  const revealTimer = useRef<number | null>(null);
  const authenticated = session.data?.authenticated === true;

  const stopAudio = useCallback(() => {
    if (revealTimer.current) {
      window.clearInterval(revealTimer.current);
      revealTimer.current = null;
    }
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setAudioKind(null);
    setActiveVoice("");
    setAudioStatus("Pronta");
  }, []);

  const playSource = useCallback(
    async (src: string, kind: Exclude<AudioKind, null>, key = "") => {
      danceVideoRef.current?.pause();
      const audio = audioRef.current;
      if (!audio) return false;
      audio.pause();
      audio.currentTime = 0;
      setAudioKind(kind);
      setActiveVoice(key);
      setAudioStatus("Carregando áudio…");
      audio.src = src;
      audio.load();
      try {
        await audio.play();
        setAudioStatus("Reproduzindo");
        return true;
      } catch {
        setAudioStatus("Áudio indisponível neste momento");
        setNotice(
          "Não foi possível iniciar o áudio. Você ainda pode continuar lendo a história.",
        );
        return false;
      }
    },
    [],
  );

  const playVoice = (key: string) =>
    void playSource(voiceAudio[key], "voice", key);

  const enter = (next: Phase) => {
    stopAudio();
    danceVideoRef.current?.pause();
    setNotice("");
    if (fadeRef.current) window.clearTimeout(fadeRef.current);
    setPhase(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!authenticated || phase !== "castle") return;
    let disposed = false;
    let timeoutId = 0;
    const viewer = viewerRef.current as
      | (HTMLElement & {
          loaded?: boolean;
          resetTurntableRotation?: () => void;
        })
      | null;
    if (!viewer) return;
    const updateStatus = () => {
      if (disposed) return;
      setModelStatus("Castelo pronto para ser observado · arraste para girar.");
      setModelFailed(false);
    };
    const onError = () => {
      if (disposed) return;
      setModelStatus(
        "Não foi possível carregar o modelo. Os quatro destinos continuam disponíveis abaixo.",
      );
      setModelFailed(true);
    };
    viewer.addEventListener("load", updateStatus);
    viewer.addEventListener("error", onError);
    if (customElements.get("model-viewer")) {
      viewer.setAttribute("src", `${asset}castle.glb`);
      setModelStatus("Carregando a projeção do castelo…");
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        "script[data-eve-model-viewer]",
      );
      const script = existing ?? document.createElement("script");
      if (!existing) {
        script.type = "module";
        script.src =
          "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
        script.dataset.eveModelViewer = "true";
        document.head.appendChild(script);
      }
      const waitForElement = window.setInterval(() => {
        if (customElements.get("model-viewer")) {
          window.clearInterval(waitForElement);
          if (!disposed) {
            viewer.setAttribute("src", `${asset}castle.glb`);
            setModelStatus("Carregando a projeção do castelo…");
          }
        }
      }, 200);
      timeoutId = window.setTimeout(() => {
        window.clearInterval(waitForElement);
        if (!customElements.get("model-viewer")) onError();
      }, 12000);
    }
    return () => {
      disposed = true;
      window.clearTimeout(timeoutId);
      viewer.removeEventListener("load", updateStatus);
      viewer.removeEventListener("error", onError);
    };
  }, [authenticated, phase]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      if (
        audioKind !== "letter" ||
        !Number.isFinite(audio.duration) ||
        audio.duration <= 0
      )
        return;
      setRevealed(
        Math.min(
          letterText.length,
          Math.floor((audio.currentTime / audio.duration) * letterText.length),
        ),
      );
    };
    const onEnded = () => {
      if (audioKind === "letter") {
        setRevealed(letterText.length);
        setLetterRead(true);
      }
      setAudioStatus("Áudio concluído");
    };
    const onError = () => {
      if (audioKind !== "letter") return;
      setAudioStatus("Narração indisponível · leitura na tela");
      setNotice(
        "A narração não pôde ser carregada. A carta está disponível para leitura.",
      );
      if (!letterRead) {
        if (revealTimer.current) window.clearInterval(revealTimer.current);
        revealTimer.current = window.setInterval(
          () =>
            setRevealed((value) => {
              if (value >= letterText.length) {
                if (revealTimer.current)
                  window.clearInterval(revealTimer.current);
                setLetterRead(true);
                return letterText.length;
              }
              return Math.min(letterText.length, value + 5);
            }),
          110,
        );
      }
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [audioKind, letterRead]);

  useEffect(
    () => () => {
      if (revealTimer.current) window.clearInterval(revealTimer.current);
      audioRef.current?.pause();
    },
    [],
  );

  const openLetter = () => {
    setLetterOpen(true);
    setLetterRead(false);
    setRevealed(0);
    if (revealTimer.current) window.clearInterval(revealTimer.current);
    void playSource(letterAudio, "letter");
  };

  const replayLetter = () => {
    setLetterRead(false);
    setRevealed(0);
    if (revealTimer.current) window.clearInterval(revealTimer.current);
    void playSource(letterAudio, "letter");
  };

  const pauseLetter = () => {
    audioRef.current?.pause();
    if (revealTimer.current) window.clearInterval(revealTimer.current);
    setAudioStatus("Pausada");
  };

  const resumeLetter = async () => {
    const audio = audioRef.current;
    if (!audio || audioKind !== "letter") return replayLetter();
    try {
      await audio.play();
      setAudioStatus("Reproduzindo");
    } catch {
      setAudioStatus("Toque novamente para retomar");
    }
  };

  const confirmChoice = (choice: "accept" | "decline") => {
    if (choice === "accept") setDanceVideoFailed(false);
    setBallroomChoice(choice);
    try {
      localStorage.setItem("eve-ballroom-choice", choice);
    } catch {
      setNotice("Sua escolha foi mantida enquanto esta página estiver aberta.");
    }
  };

  const submitAccess = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAccessError("");
    if (!code.trim()) {
      setAccessError("Insira a chave para solicitar autorização.");
      return;
    }
    verify.mutate(
      { data: { code: code.trim() } },
      {
        onSuccess: (result) => {
          client.setQueryData(getGetEveAccessSessionQueryKey(), result);
          setCode("");
          if (!result.authenticated)
            setAccessError(
              "Acesso não autorizado. Confira a chave e tente novamente.",
            );
        },
        onError: () =>
          setAccessError(
            "Não foi possível validar a chave agora. Tente novamente.",
          ),
      },
    );
  };

  const signOut = () =>
    logout.mutate(undefined, {
      onSuccess: (result) => {
        stopAudio();
        danceVideoRef.current?.pause();
        client.setQueryData(getGetEveAccessSessionQueryKey(), result);
        setPhase("castle");
      },
    });

  if (session.isLoading) {
    return (
      <main className="eve-app">
        <div className="shell">
          <header className="topbar">
            <div className="brandmark">E.V.E.</div>
            <span className="phase-index">INICIALIZANDO</span>
          </header>
          <div
            className="loading-box"
            role="status"
            data-testid="status-session-loading"
          >
            A conexão segura está sendo verificada…
          </div>
        </div>
      </main>
    );
  }

  if (session.isError) {
    return (
      <main className="eve-app">
        <div className="shell">
          <header className="topbar">
            <div className="brandmark">E.V.E.</div>
            <span className="phase-index">SISTEMA EM PAUSA</span>
          </header>
          <div
            className="error-box"
            role="alert"
            data-testid="status-session-error"
          >
            <strong>Não foi possível consultar a autorização.</strong>
            <p>
              A experiência permanece protegida até que a conexão com E.V.E.
              seja restabelecida.
            </p>
            <button
              className="button button-primary"
              onClick={() => void session.refetch()}
              data-testid="button-retry-session"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="eve-app">
      <div className="shell">
        <header className="topbar">
          <div className="brandmark" aria-label="E.V.E.">
            <span className="brand-seal">015</span>E.V.E.
          </div>
          <span className="top-meta">
            Eternal Voyage Engine · arquivo pessoal
          </span>
          <div className="top-right">
            <span className="online">
              <i aria-hidden="true" />{" "}
              {authenticated ? "SISTEMA ONLINE" : "ACESSO RESTRITO"}
            </span>
            {authenticated && (
              <span className="phase-index" data-testid="status-current-phase">
                {phaseNumber(phase)} / 6
              </span>
            )}
            {authenticated && (
              <button
                className="button-text"
                onClick={signOut}
                disabled={logout.isPending}
                data-testid="button-logout"
              >
                {logout.isPending ? "Encerrando…" : "Sair"}
              </button>
            )}
          </div>
        </header>

        {!authenticated ? (
          <section className="gate-layout" aria-labelledby="gate-title">
            <div className="gate-copy">
              <p className="eyebrow">Sistema E.V.E. inicializado.</p>
              <h1 id="gate-title">
                Uma história <span>só sua.</span>
              </h1>
              <p className="intro">
                Identidade da visitante necessária para continuar. Uma noite de
                castelo, segredos e pequenos capítulos espera por Analy.
              </p>
              <div className="subtle-rule" />
              <p className="status-line" data-testid="text-gate-status">
                ARQUIVO PESSOAL · 015
              </p>
            </div>
            <div>
              <div className="system-orb" aria-hidden="true">
                <span className="orb-core" />
                <span className="orb-label">E.V.E. / 015</span>
              </div>
              <form
                className="access-panel"
                onSubmit={submitAccess}
                data-testid="form-access"
              >
                <label htmlFor="access-code">Chave de acesso</label>
                <div className="access-row">
                  <input
                    id="access-code"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Insira sua chave"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    disabled={verify.isPending}
                    data-testid="input-access-code"
                  />
                  <button
                    className="button button-primary"
                    type="submit"
                    disabled={verify.isPending}
                    data-testid="button-authorize"
                  >
                    {verify.isPending ? "Verificando…" : "Autorizar e entrar"}{" "}
                    <ArrowRight size={15} />
                  </button>
                </div>
                <p className="form-note">
                  O acesso é verificado com segurança pelo sistema E.V.E.
                </p>
                {(accessError || verify.isError) && (
                  <p
                    className="status-line status-error"
                    role="alert"
                    data-testid="status-access-error"
                  >
                    {accessError || "A solicitação falhou. Tente novamente."}
                  </p>
                )}
              </form>
            </div>
          </section>
        ) : (
          <>
            <section className="screen" key={phase}>
              <div
                className="assistant"
                aria-live="polite"
                data-testid="content-eve-assistant"
              >
                <span className="assistant-mark">E</span>
                <span>
                  <strong>E.V.E. · Assistente pessoal</strong>
                  <br />
                  {assistantFor(phase, ballroomChoice)}
                </span>
              </div>
              {phase === "castle" && (
                <>
                  <div className="screen-heading">
                    <div>
                      <p className="eyebrow">
                        CAPÍTULO I · PROJEÇÃO HOLOGRÁFICA
                      </p>
                      <h2>O castelo desperta</h2>
                      <div className="subtle-rule" />
                    </div>
                    <p>
                      Bem-vinda, Analy. Este castelo guarda quatro caminhos —
                      cada um conduz a uma parte diferente da sua história.
                    </p>
                  </div>
                  <div className="castle-panel">
                    {createElement("model-viewer" as any, {
                      ref: (node: HTMLElement | null) => {
                        viewerRef.current = node;
                      },
                      className: "castle-scene",
                      alt: "Modelo tridimensional exterior do castelo E.V.E.",
                      "camera-controls": true,
                      "touch-action": "pan-y",
                      "auto-rotate": true,
                      "auto-rotate-delay": "2200",
                      "rotation-per-second": "4deg",
                      "interaction-prompt": "auto",
                      "environment-image": "neutral",
                      loading: "lazy",
                      "camera-orbit": "35deg 70deg 150%",
                      "min-camera-orbit": "auto 15deg auto",
                      "max-camera-orbit": "auto 100deg auto",
                      "field-of-view": "30deg",
                    })}
                    <div
                      className="model-state"
                      role="status"
                      data-testid="status-castle-model"
                    >
                      {modelStatus}
                    </div>
                    <div className="castle-caption">
                      Exterior do castelo · os cenários interiores abrem como
                      cenas próprias
                    </div>
                  </div>
                  {modelFailed && (
                    <div
                      className="toast-line"
                      role="status"
                      data-testid="status-castle-fallback"
                    >
                      A projeção 3D não está disponível. Você ainda pode
                      explorar todos os destinos.{" "}
                      <button
                        className="button button-quiet"
                        onClick={() => {
                          const viewer = viewerRef.current;
                          if (!viewer) return;
                          setModelFailed(false);
                          setModelStatus(
                            "Tentando carregar a projeção novamente…",
                          );
                          viewer.removeAttribute("src");
                          window.setTimeout(
                            () =>
                              viewer.setAttribute("src", `${asset}castle.glb`),
                            80,
                          );
                        }}
                        data-testid="button-retry-castle"
                      >
                        Tentar novamente
                      </button>
                    </div>
                  )}
                  <div className="scene-actions">
                    <button
                      className="button button-quiet"
                      onClick={() => {
                        const viewer = viewerRef.current as
                          | (HTMLElement & {
                              resetTurntableRotation?: () => void;
                            })
                          | null;
                        viewer?.resetTurntableRotation?.();
                        viewer?.setAttribute(
                          "camera-orbit",
                          "35deg 70deg 150%",
                        );
                      }}
                      data-testid="button-reset-castle"
                    >
                      <RotateCcw size={14} /> Restaurar câmera
                    </button>
                    <button
                      className="button button-quiet"
                      onClick={() => playVoice("greeting")}
                      data-testid="button-play-greeting"
                    >
                      <Volume2 size={14} /> Ouvir apresentação da E.V.E.
                    </button>
                    <span
                      className="audio-status"
                      role="status"
                      data-testid="status-audio"
                    >
                      {audioStatus}
                    </span>
                  </div>
                  <div
                    className="destinations"
                    aria-label="Quatro destinos do castelo"
                    data-testid="content-destinations"
                  >
                    <button
                      className="destination"
                      onClick={() => enter("library")}
                      data-testid="button-destination-library"
                    >
                      <span className="num">01 / SUBSOLO</span>
                      <strong>A biblioteca</strong>
                      <small>Um livro entre sombras e segredos</small>
                    </button>
                    <button
                      className="destination"
                      onClick={() => enter("bedroom")}
                      data-testid="button-destination-bedroom"
                    >
                      <span className="num">02 / ALA LESTE</span>
                      <strong>O quarto</strong>
                      <small>Uma carta aguardando ser aberta</small>
                    </button>
                    <button
                      className="destination"
                      onClick={() => enter("ballroom")}
                      data-testid="button-destination-ballroom"
                    >
                      <span className="num">03 / GRANDE SALÃO</span>
                      <strong>O baile</strong>
                      <small>Um convite, uma escolha sua</small>
                    </button>
                    <button
                      className="destination"
                      onClick={() => enter("terrace")}
                      data-testid="button-destination-terrace"
                    >
                      <span className="num">04 / TORRE ALTA</span>
                      <strong>O terraço</strong>
                      <small>A última página sob a lua</small>
                    </button>
                  </div>
                </>
              )}

              {phase === "library" && (
                <>
                  <div className="screen-heading">
                    <div>
                      <p className="eyebrow">
                        CAPÍTULO II · ARQUIVO DE ROMANCE SOMBRIO
                      </p>
                      <h2>A biblioteca secreta</h2>
                    </div>
                    <p>
                      Entre lombadas antigas, um título parece esperar por você.
                    </p>
                  </div>

                  <div
                    className="image-scene library-bg"
                    style={{ backgroundImage: `url("${librarySrc}")` }}
                  >
                    <div className="scene-content">
                      <p className="eyebrow">
                        COLEÇÃO PARTICULAR · VOLUME EM DESTAQUE
                      </p>
                      <h2>Histórias guardadas na penumbra.</h2>
                      <p>
                        O silêncio desta biblioteca tem páginas. Um livro se
                        destaca entre tantos outros — uma história de amor,
                        tensão e lealdade.
                      </p>

                      <div className="book-stage">
                        <button
                          className="book-visual"
                          onClick={() => setBookOpen((value) => !value)}
                          aria-expanded={bookOpen}
                          data-testid="button-open-book"
                        >
                          <span>
                            TWISTED
                            <br />
                            LOVE
                          </span>
                        </button>

                        <div className="book-meta">
                          <strong>Um livro em destaque</strong>
                          Toque na lombada para abrir a ficha.
                        </div>
                      </div>

                      {bookOpen && (
                        <div
                          className="book-card"
                          role="region"
                          aria-labelledby="book-title"
                          data-testid="content-book-card"
                        >
                          <p className="eyebrow">BIBLIOTECA REAL</p>

                          <img
                            src="/assets/book/7120bDC9XIL._AC_UF1000,1000_QL80_.jpg"
                            alt="Capa de Amor Corrompido — Twisted Love, de Ana Huang"
                            className="book-cover"
                          />

                          <h3 id="book-title">
                            Amor Corrompido — Twisted Love
                          </h3>
                          <p>Autora: Ana Huang</p>

                          <p className="age-note">
                            <strong>Nota de idade e conteúdo · 18+</strong>
                            <br />
                            Este livro é destinado ao público adulto. Converse
                            com um responsável antes de acessar o conteúdo.
                          </p>

                          <a
                            className="legal-link"
                            href="/assets/book/Amor-corrompido-Twisted-Love-1-Ana-Huang.pdf"
                            target="_blank"
                            rel="noreferrer"
                            data-testid="link-read-book"
                          >
                            Abrir PDF para leitura <ArrowRight size={12} />
                          </a>
                        </div>
                      )}

                      <div className="scene-actions">
                        <button
                          className="button button-quiet"
                          onClick={() => playVoice("library")}
                          data-testid="button-play-library"
                        >
                          <Volume2 size={14} /> Ouvir E.V.E.
                        </button>

                        <button
                          className="button button-quiet"
                          onClick={() => enter("castle")}
                          data-testid="button-back-library"
                        >
                          <ArrowLeft size={14} /> Voltar ao castelo
                        </button>

                        <button
                          className="button button-primary"
                          onClick={() => enter("bedroom")}
                          data-testid="button-next-bedroom"
                        >
                          Ir ao quarto <ArrowRight size={14} />
                        </button>
                      </div>

                      <span
                        className="audio-status"
                        role="status"
                        data-testid="status-audio"
                      >
                        {audioStatus}
                      </span>
                    </div>
                  </div>
                </>
              )}
              {phase === "bedroom" && (
                <>
                  <div className="screen-heading">
                    <div>
                      <p className="eyebrow">CAPÍTULO III · ALA LESTE</p>
                      <h2>O quarto à luz da lua</h2>
                    </div>
                    <p>
                      Há uma carta selada junto à janela. Talvez seja hora de
                      descobrir o que ela guarda.
                    </p>
                  </div>
                  <div
                    className="image-scene bedroom-bg"
                    style={{ backgroundImage: `url("${roomSrc}")` }}
                  >
                    <div className="bedroom-layout">
                      <div className="scene-content">
                        <p className="eyebrow">UMA MENSAGEM EM PAPEL</p>
                        <h2>Alguém deixou palavras para você.</h2>
                        <p>
                          Abra a carta quando estiver pronta. A narração começa
                          apenas com o seu toque e pode ser pausada a qualquer
                          momento.
                        </p>
                        {!letterOpen ? (
                          <button
                            className="button button-primary"
                            onClick={openLetter}
                            data-testid="button-open-letter"
                          >
                            <BookOpen size={15} /> Abrir a carta selada
                          </button>
                        ) : (
                          <div
                            className="letter-wrap"
                            data-testid="content-letter"
                          >
                            <p>{letterText.slice(0, revealed)}</p>
                            {revealed >= letterText.length && (
                              <span className="micro">
                                FIM DA CARTA · SEU ADMIRADOR SECRETO
                              </span>
                            )}
                            <div className="audio-row">
                              <button
                                className="button"
                                onClick={resumeLetter}
                                data-testid="button-resume-letter"
                              >
                                <Play size={13} /> Retomar
                              </button>
                              <button
                                className="button"
                                onClick={pauseLetter}
                                data-testid="button-pause-letter"
                              >
                                <Pause size={13} /> Pausar
                              </button>
                              <button
                                className="button"
                                onClick={replayLetter}
                                data-testid="button-replay-letter"
                              >
                                <RotateCcw size={13} /> Ouvir novamente
                              </button>
                              <span
                                className="audio-status"
                                role="status"
                                data-testid="status-letter-audio"
                              >
                                {audioStatus}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="scene-actions">
                          <button
                            className="button button-quiet"
                            onClick={() => playVoice("bedroom")}
                            data-testid="button-play-bedroom"
                          >
                            <Volume2 size={14} /> Ouvir E.V.E.
                          </button>
                          <button
                            className="button button-quiet"
                            onClick={() => enter("castle")}
                            data-testid="button-back-bedroom"
                          >
                            <ArrowLeft size={14} /> Voltar ao castelo
                          </button>
                          <button
                            className="button button-primary"
                            onClick={() => enter("ballroom")}
                            data-testid="button-next-ballroom"
                          >
                            Ir ao baile <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                      <img
                        className="princess"
                        src={princessCutoutSrc}
                        alt="Ilustração recortada da princesa Analy com vestido azul e tiara prateada"
                        loading="lazy"
                        data-testid="img-princess-bedroom"
                      />
                    </div>
                    <button
                      className="teddy"
                      onClick={() => setTeddyMessage((value) => !value)}
                      aria-label="Tocar no ursinho de pelúcia"
                      aria-pressed={teddyMessage}
                      data-testid="button-teddy"
                    >
                      <span className="bear-head">
                        <span className="bear-face" />
                      </span>
                      <span className="bear-body" />
                    </button>
                    {teddyMessage && (
                      <p
                        className="teddy-note"
                        role="status"
                        data-testid="status-teddy"
                      >
                        Um pequeno guardião acompanha a princesa nesta noite.
                      </p>
                    )}
                  </div>
                </>
              )}

              {phase === "ballroom" && (
                <>
                  <div className="screen-heading">
                    <div>
                      <p className="eyebrow">CAPÍTULO IV · GRANDE SALÃO</p>
                      <h2>Uma noite de baile</h2>
                    </div>
                    <p>
                      A música parece suspensa no ar. Diante de você, há um
                      único convite — a resposta é inteiramente sua.
                    </p>
                  </div>
                  <div
                    className="image-scene ballroom-bg"
                    style={{ backgroundImage: `url("${ballroomSrc}")` }}
                  >
                    <div className="scene-content ballroom-content">
                      <p className="eyebrow">
                        O SALÃO REAL · UMA ESCOLHA PESSOAL
                      </p>
                      <div className="prince-row">
                        <img
                          className="prince-art"
                          src={princeCutoutSrc}
                          alt="Ilustração recortada do príncipe loiro de olhos verdes em traje formal preto"
                          loading="lazy"
                          data-testid="img-prince"
                        />
                        <p className="micro">
                          O príncipe loiro se aproxima e estende a mão.
                        </p>
                      </div>
                      <p className="invitation">
                        “Concede-me esta dança, princesa?”
                      </p>
                      {!ballroomChoice ? (
                        <div
                          className="choice-row"
                          data-testid="content-ballroom-choice"
                        >
                          <button
                            className="button button-primary"
                            onClick={() => confirmChoice("accept")}
                            data-testid="button-accept-dance"
                          >
                            <Check size={14} /> Aceitar a dança
                          </button>
                          <button
                            className="button"
                            onClick={() => confirmChoice("decline")}
                            data-testid="button-decline-dance"
                          >
                            Recusar gentilmente
                          </button>
                        </div>
                      ) : (
                        <div
                          className="response"
                          role="status"
                          data-testid="content-ballroom-response"
                        >
                          {ballroomChoice === "accept" ? (
                            <>
                              <p>A dança foi aceita.</p>

                              <div className="dance-video-wrap">
                                <video
                                  className="dance-video"
                                  ref={danceVideoRef}
                                  src="/assets/videos/waltz_ballroom_couple_1792354303448.mp4"
                                  controls
                                  playsInline
                                  preload="none"
                                  poster={ballroomSrc}
                                  aria-label="Vídeo de Analy e do príncipe dançando no baile"
                                  onPlay={stopAudio}
                                  onError={() => setDanceVideoFailed(true)}
                                  data-testid="video-ballroom-dance"
                                >
                                  Seu navegador não consegue reproduzir este
                                  vídeo.
                                </video>

                                {danceVideoFailed ? (
                                  <p
                                    className="dance-note"
                                    role="status"
                                    data-testid="status-dance-video-error"
                                  >
                                    O vídeo não pôde ser carregado. O salão
                                    continua disponível e você ainda pode seguir
                                    para a próxima cena.
                                  </p>
                                ) : (
                                  <p className="dance-note">
                                    Toque em reproduzir para assistir. O som só
                                    começa com sua ação.
                                  </p>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <p>
                                “Então, guardarei esta dança para outra
                                ocasião.”
                              </p>
                              <p className="dance-note">
                                O príncipe aceita sua resposta com gentileza. A
                                história continua no seu ritmo.
                              </p>
                            </>
                          )}
                        </div>
                      )}
                      <div className="scene-actions">
                        <button
                          className="button button-quiet"
                          onClick={() => playVoice("ballroom")}
                          data-testid="button-play-ballroom"
                        >
                          <Volume2 size={14} /> Ouvir E.V.E.
                        </button>
                        <button
                          className="button button-quiet"
                          onClick={() => enter("castle")}
                          data-testid="button-back-ballroom"
                        >
                          <ArrowLeft size={14} /> Voltar ao castelo
                        </button>
                        {ballroomChoice && (
                          <button
                            className="button button-primary"
                            onClick={() => enter("terrace")}
                            data-testid="button-continue-terrace"
                          >
                            Continuar <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                      <span
                        className="audio-status"
                        role="status"
                        data-testid="status-audio"
                      >
                        {audioStatus}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {phase === "terrace" && (
                <>
                  <div
                    className="image-scene final-scene"
                    style={{ backgroundImage: `url("${terraceSrc}")` }}
                  >
                    <div className="final-copy">
                      <p className="eyebrow">
                        CAPÍTULO FINAL · SOB O MESMO CÉU
                      </p>
                      <h2>
                        Esta história
                        <br />
                        <em>é sua, Analy.</em>
                      </h2>
                      <p
                        className="final-message"
                        data-testid="content-birthday-message"
                      >
                        {finalText}
                      </p>
                      <p className="final-signoff">Feliz 15 anos · Analy</p>
                      <div className="scene-actions">
                        <button
                          className="button button-quiet"
                          onClick={() => playVoice("terrace")}
                          data-testid="button-play-terrace"
                        >
                          <Volume2 size={14} /> Ouvir E.V.E.
                        </button>
                        <button
                          className="button button-quiet"
                          onClick={() => enter("castle")}
                          data-testid="button-back-terrace"
                        >
                          <ArrowLeft size={14} /> Voltar ao castelo
                        </button>
                      </div>
                      <span
                        className="audio-status"
                        role="status"
                        data-testid="status-audio"
                      >
                        {audioStatus}
                      </span>
                      <p
                        className="complete-mark"
                        data-testid="status-story-complete"
                      >
                        E.V.E. · ARQUIVO 015 · HISTÓRIA CONCLUÍDA
                      </p>
                    </div>
                    <img
                      className="final-princess"
                      src={princessCutoutSrc}
                      alt="Ilustração recortada da princesa Analy sob o céu do terraço"
                      loading="lazy"
                      data-testid="img-princess-terrace"
                    />
                  </div>
                </>
              )}
              {notice && (
                <p
                  className="toast-line"
                  role="status"
                  data-testid="status-notice"
                >
                  {notice}
                </p>
              )}
            </section>
            <footer className="footer">
              <span>E.V.E. · Eternal Voyage Engine</span>
              <span>Uma história preparada para Analy</span>
            </footer>
          </>
        )}
        <audio
          ref={audioRef}
          preload="none"
          onPause={() => {
            if (audioKind) setAudioStatus("Pausada");
          }}
          onPlay={() => setAudioStatus("Reproduzindo")}
          data-testid="audio-player"
        />
      </div>
    </main>
  );
}

function phaseNumber(phase: Phase) {
  return {
    castle: "02",
    library: "03",
    bedroom: "04",
    ballroom: "05",
    terrace: "06",
  }[phase];
}

function assistantFor(phase: Phase, choice: "accept" | "decline" | null) {
  if (phase === "castle")
    return "Bem-vinda, Analy. O castelo está pronto para ser explorado.";
  if (phase === "library")
    return "A biblioteca guarda histórias que encontram suas leitoras no momento certo.";
  if (phase === "bedroom")
    return "A carta é sua. Você pode ouvir, pausar, retomar ou simplesmente ler no seu tempo.";
  if (phase === "ballroom")
    return choice
      ? "Sua escolha foi recebida e será respeitada. A história segue adiante."
      : "Há apenas um convite. Você decide se aceita ou recusa; nenhuma resposta fecha o caminho.";
  return "A lua acompanha o fim desta jornada. O capítulo que vem depois pertence a você.";
}

export default App;
