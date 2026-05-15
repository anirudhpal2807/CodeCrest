import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const TIPS = [
  "Ask for hints before full solutions.",
  "Paste failing test output for targeted help.",
  "Request time/space complexity tradeoffs.",
];

function ChatAi({ problem }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        {
          text: "Hi! I'm CodeCrest's AI assistant. Ask anything about this problem—hints, approaches, or debugging help.",
        },
      ],
    },
  ]);
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const onSubmit = async (data) => {
    const userMsg = { role: "user", parts: [{ text: data.message }] };
    const nextThread = [...messages, userMsg];
    setMessages((prev) => [...prev, userMsg]);
    reset();
    setIsSending(true);

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages: nextThread,
        title: problem?.title || "General Question",
        description: problem?.description || "No specific problem context",
        testCases: problem?.visibleTestCases || [],
        startCode: problem?.startCode || "",
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: response.data.message }],
        },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      const serverMsg =
        error.response?.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : null;
      const fallback =
        serverMsg ||
        "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: fallback }],
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const problemTitle = problem?.title?.trim() || "Practice problem";
  const difficulty = problem?.difficulty;

  return (
    <div
      className="flex flex-col flex-1 min-h-0 h-full rounded-2xl overflow-hidden border shadow-2xl"
      style={{
        borderColor: "var(--cc-border)",
        background:
          "linear-gradient(165deg, rgba(99, 102, 241, 0.07) 0%, var(--cc-bg-card) 42%, var(--cc-bg-secondary) 100%)",
        boxShadow:
          "var(--cc-shadow-xl), 0 0 0 1px rgba(148, 163, 184, 0.06) inset, 0 -24px 48px -32px rgba(99, 102, 241, 0.15)",
      }}
    >
      <div className="flex flex-1 min-h-0">
        {/* Context rail — modern SaaS sidebar */}
        <aside
          className="hidden lg:flex w-[220px] shrink-0 flex-col border-r"
          style={{
            borderColor: "var(--cc-border)",
            background: "rgba(15, 23, 42, 0.45)",
          }}
        >
          <div
            className="p-4 border-b"
            style={{ borderColor: "var(--cc-border)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, var(--cc-primary) 0%, var(--cc-accent) 100%)",
                  boxShadow: "0 4px 14px var(--cc-primary-glow)",
                }}
              >
                <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "var(--cc-text-muted)" }}
                >
                  Context
                </p>
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: "var(--cc-text-secondary)" }}
                >
                  This problem
                </p>
              </div>
            </div>
            <p
              className="text-sm font-semibold leading-snug line-clamp-3"
              style={{ color: "var(--cc-text-primary)" }}
              title={problemTitle}
            >
              {problemTitle}
            </p>
            {difficulty && (
              <span
                className="inline-flex mt-2.5 px-2 py-0.5 rounded-md text-[11px] font-medium capitalize"
                style={{
                  background: "rgba(99, 102, 241, 0.12)",
                  color: "var(--cc-primary-light)",
                  border: "1px solid rgba(99, 102, 241, 0.25)",
                }}
              >
                {difficulty}
              </span>
            )}
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Lightbulb
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: "var(--cc-accent)" }}
              />
              <span
                className="text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--cc-text-muted)" }}
              >
                Suggestions
              </span>
            </div>
            <ul className="space-y-2.5">
              {TIPS.map((tip) => (
                <li
                  key={tip}
                  className="text-xs leading-relaxed pl-3 border-l-2"
                  style={{
                    color: "var(--cc-text-secondary)",
                    borderColor: "rgba(6, 182, 212, 0.35)",
                  }}
                >
                  {tip}
                </li>
              ))}
            </ul>
            <div
              className="mt-5 p-3 rounded-xl flex gap-2.5"
              style={{
                background: "rgba(16, 185, 129, 0.06)",
                border: "1px solid rgba(16, 185, 129, 0.15)",
              }}
            >
              <ShieldCheck
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: "var(--cc-success)" }}
              />
              <p
                className="text-[11px] leading-relaxed"
                style={{ color: "var(--cc-text-muted)" }}
              >
                Your code stays in this workspace. The model only sees what you
                send in chat and the problem metadata.
              </p>
            </div>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          <header
            className="shrink-0 px-4 sm:px-5 py-4 border-b"
            style={{
              borderColor: "var(--cc-border)",
              background: "rgba(11, 15, 26, 0.65)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2
                    className="text-lg sm:text-xl font-bold tracking-tight"
                    style={{ color: "var(--cc-text-primary)" }}
                  >
                    Chat with{" "}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(115deg, var(--cc-primary-light) 0%, var(--cc-accent-light) 50%, var(--cc-primary-light) 100%)",
                      }}
                    >
                      CodeCrest
                    </span>
                  </h2>
                </div>
                <p
                  className="text-xs sm:text-sm mt-1 max-w-xl"
                  style={{ color: "var(--cc-text-muted)" }}
                >
                  Context-aware help for{" "}
                  <span style={{ color: "var(--cc-text-secondary)" }}>
                    {problemTitle}
                  </span>
                  . Clear, structured answers—like a product you&apos;d pay for.
                </p>
              </div>
            </div>
          </header>

          <div
            className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-4"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.08), transparent)",
            }}
          >
            {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={index}
                    className={`animate-fade-in flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5"
                      style={{
                        background: isUser
                          ? "linear-gradient(145deg, var(--cc-bg-elevated), var(--cc-bg-tertiary))"
                          : "linear-gradient(135deg, var(--cc-primary) 0%, var(--cc-primary-dark) 100%)",
                        border: isUser
                          ? "1px solid var(--cc-border)"
                          : "none",
                        boxShadow: isUser
                          ? "var(--cc-shadow-sm)"
                          : "0 4px 14px var(--cc-primary-glow)",
                      }}
                    >
                      {isUser ? (
                        <User
                          className="w-4 h-4"
                          style={{ color: "var(--cc-text-secondary)" }}
                        />
                      ) : (
                        <Bot className="w-4 h-4 text-white" strokeWidth={2} />
                      )}
                    </div>
                    <div
                      className={`max-w-[min(100%,560px)] min-w-0 ${isUser ? "text-right" : ""}`}
                    >
                      <div
                        className={`inline-block text-left px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          isUser
                            ? "rounded-tr-md shadow-lg"
                            : "rounded-tl-md"
                        }`}
                        style={{
                          background: isUser
                            ? "linear-gradient(135deg, var(--cc-primary) 0%, var(--cc-primary-dark) 100%)"
                            : "var(--cc-bg-elevated)",
                          color: isUser ? "#fff" : "var(--cc-text-primary)",
                          border: isUser
                            ? "none"
                            : "1px solid var(--cc-border)",
                          boxShadow: isUser
                            ? "0 8px 24px -6px rgba(99, 102, 241, 0.45)"
                            : "var(--cc-shadow-md)",
                        }}
                      >
                        <pre className="whitespace-pre-wrap font-sans m-0">
                          {msg.parts[0].text}
                        </pre>
                      </div>
                    </div>
                  </div>
                );
              })}

            {isSending && (
              <div className="animate-fade-in flex gap-3">
                <div
                  className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--cc-primary) 0%, var(--cc-primary-dark) 100%)",
                    boxShadow: "0 4px 14px var(--cc-primary-glow)",
                  }}
                >
                  <Bot className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <div
                  className="px-4 py-3 rounded-2xl rounded-tl-md text-sm flex items-center gap-2"
                  style={{
                    background: "var(--cc-bg-elevated)",
                    border: "1px solid var(--cc-border)",
                    color: "var(--cc-text-muted)",
                  }}
                >
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>CodeCrest is thinking…</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="shrink-0 px-3 sm:px-5 pb-4 pt-2"
            style={{
              borderTop: "1px solid var(--cc-border)",
              background: "rgba(17, 24, 39, 0.92)",
              backdropFilter: "blur(14px)",
            }}
          >
            <div
              className="flex items-end gap-2 p-1.5 pl-3 rounded-2xl border transition-shadow focus-within:ring-2"
              style={{
                borderColor: "var(--cc-border-hover)",
                background: "var(--cc-bg-input)",
                boxShadow: "var(--cc-shadow-sm)",
              }}
            >
              <input
                placeholder="Message CodeCrest about this problem…"
                disabled={isSending}
                className="cc-input flex-1 !border-0 !bg-transparent !shadow-none !px-1 !py-2.5 focus:!ring-0"
                {...register("message", { required: true, minLength: 2 })}
              />
              <button
                type="submit"
                disabled={isSending || !!errors.message}
                className="cc-btn-primary !p-3 !rounded-xl shrink-0 flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                aria-label="Send message"
              >
                {isSending ? (
                  <Loader2 className="w-[18px] h-[18px] animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            <p
              className="text-[10px] mt-2 px-1"
              style={{ color: "var(--cc-text-dimmed)" }}
            >
              Enter to send · AI can make mistakes; verify critical logic
              before submitting.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatAi;
