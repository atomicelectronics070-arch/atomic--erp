"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, ChevronRight, CheckCircle2, PlayCircle, BookOpen, Bot, X, ArrowRight } from "lucide-react"

export default function LessonPlayer({ course, lesson, prevLesson, isCompleted, markCompletedAction }: any) {
    const [showAiTutor, setShowAiTutor] = useState(false)
    const [quizStep, setQuizStep] = useState<"CONTENT" | "QUIZ" | "PASSED">("CONTENT")
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [quizResults, setQuizResults] = useState<boolean[]>([])

    // Parse Quiz Data
    let quiz: any[] = []
    try {
        if (lesson.quizData) quiz = JSON.parse(lesson.quizData)
    } catch (e) { console.error("Invalid Quiz Data", e) }

    const handleStartQuiz = () => {
        setQuizStep("QUIZ")
        setCurrentQuestion(0)
        setQuizResults([])
        setSelectedAnswer(null)
    }

    const handleAnswer = () => {
        if (selectedAnswer === null) return
        const isCorrect = selectedAnswer === quiz[currentQuestion].c
        const newResults = [...quizResults, isCorrect]
        setQuizResults(newResults)

        if (currentQuestion < quiz.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedAnswer(null)
        } else {
            const allCorrect = newResults.every(r => r === true)
            if (allCorrect) {
                setQuizStep("PASSED")
            } else {
                alert("Has fallado algunas preguntas. Revisa el contenido e inténtalo de nuevo.")
                setQuizStep("CONTENT")
            }
        }
    }

    return (
        <div className="min-h-screen bg-[#F4F1EB] text-[#0F1923] flex flex-col lg:flex-row overflow-hidden h-screen relative">
            {/* AI TUTOR SLIDE-OVER ... (rest of the component) */}
            {/* AI TUTOR SLIDE-OVER */}
            <AnimatePresence>
                {showAiTutor && (
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-[#0F1923] z-[100] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] border-l border-white/10 flex flex-col"
                    >
                        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#E8341A] flex items-center justify-center shadow-[0_0_20px_rgba(232,52,26,0.4)]">
                                    <Bot size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tighter italic leading-none">Atomic AI Tutor</h3>
                                    <p className="text-[8px] font-black text-[#E8341A] uppercase tracking-[0.4em] mt-2">Soporte Técnico en Tiempo Real</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAiTutor(false)} className="text-white/20 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar-hidden">
                            <div className="bg-white/5 p-6 border-l-2 border-[#E8341A]">
                                <p className="text-white/70 text-[11px] leading-relaxed font-medium uppercase tracking-wide">
                                    Hola, soy tu asistente de Atomic Academy. Estoy analizando el contenido de "<span className="text-white font-black">{lesson.title}</span>". ¿En qué parte técnica necesitas profundizar?
                                </p>
                            </div>
                            <div className="space-y-6 opacity-40">
                                <div className="flex justify-end">
                                    <div className="bg-[#E8341A]/10 border border-[#E8341A]/20 p-4 text-[10px] text-white uppercase tracking-widest max-w-[80%]">
                                        ¿Cómo se configura el puerto 8080 en este NVR?
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/10 p-4 text-[10px] text-white/50 uppercase tracking-widest max-w-[80%] italic">
                                        Analizando protocolos de red...
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 border-t border-white/5 bg-black/20">
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    placeholder="CONSULTAR NÚCLEO DE DATOS..." 
                                    className="w-full bg-white/5 border border-white/10 p-5 text-white text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:border-[#E8341A] transition-all pr-16"
                                />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E8341A] hover:scale-110 transition-transform">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                            <p className="text-[7px] font-bold text-white/20 uppercase tracking-[0.4em] mt-4 text-center italic">Conectado a Atomic Neural Core v4.2</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar / Curriculum */}
            <aside className="w-full lg:w-[400px] bg-[#0F1923] text-white flex flex-col h-auto lg:h-full relative z-30 shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                    <Link href={`/web/academy/course/${course.slug}`} className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E8341A] hover:text-white transition-all mb-8 flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-none border border-[#E8341A]/30 flex items-center justify-center group-hover:bg-[#E8341A] group-hover:text-white transition-all">
                            <ChevronLeft size={16} />
                        </div>
                        Volver al Índice
                    </Link>
                    <div className="space-y-2 mt-10">
                        <span className="text-[9px] font-black text-[#E8341A] uppercase tracking-[0.5em] block">Módulo Actual</span>
                        <h2 className="text-3xl font-black uppercase tracking-tighter leading-none italic">{course.title}</h2>
                    </div>
                    <div className="mt-10 space-y-4 bg-white/5 p-6 rounded-none border border-white/5">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                            <span>Tu Dominio</span>
                            <span className="text-[#E8341A]">{course.enrollments[0].progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-none overflow-hidden">
                            <div className="h-full bg-[#E8341A] shadow-[0_0_15px_rgba(232,52,26,0.5)] transition-all duration-1000" style={{ width: `${course.enrollments[0].progress}%` }}></div>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar-hidden bg-white/[0.01]">
                    {course.lessons.map((l: any, index: number) => {
                        const lCompleted = l.progress && l.progress.length > 0 && l.progress[0].completed
                        const isActive = l.id === lesson.id
                        return (
                            <Link 
                                href={`/web/academy/lesson/${course.slug}/${l.slug}`} 
                                key={l.id}
                                className={`flex items-start gap-6 p-8 border-b border-white/5 transition-all relative group ${isActive ? 'bg-white/5' : 'hover:bg-white/[0.03]'}`}
                            >
                                {isActive && <div className="absolute left-0 top-0 w-1.5 h-full bg-[#E8341A] shadow-[0_0_20px_rgba(232,52,26,0.8)]" />}
                                <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-none border ${lCompleted ? 'bg-green-500 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]' : (isActive ? 'bg-[#E8341A] border-[#E8341A] text-white shadow-[0_0_15px_rgba(232,52,26,0.3)]' : 'bg-transparent border-white/10 text-white/20 group-hover:border-white/30 transition-all')}`}>
                                    {lCompleted ? <CheckCircle2 size={18} /> : <span className="font-mono font-black text-sm">{index + 1}</span>}
                                </div>
                                <div className="flex-1">
                                    <span className={`text-[8px] font-black uppercase tracking-[0.3em] block mb-2 ${isActive ? 'text-[#E8341A]' : 'text-white/20'}`}>Fase 0{index + 1}</span>
                                    <h4 className={`text-xs font-black uppercase tracking-widest leading-relaxed transition-colors ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>{l.title}</h4>
                                </div>
                                {isActive && <PlayCircle size={16} className="text-[#E8341A] animate-pulse" />}
                            </Link>
                        )
                    })}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative bg-[#F4F1EB] overflow-hidden">
                <button 
                    onClick={() => setShowAiTutor(true)}
                    className="fixed bottom-10 right-10 z-[60] w-20 h-20 bg-[#E8341A] text-white flex flex-col items-center justify-center shadow-[0_20px_40px_rgba(232,52,26,0.4)] hover:scale-110 active:scale-95 transition-all group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <Bot size={28} className="relative z-10" />
                    <span className="text-[7px] font-black uppercase tracking-widest mt-1 relative z-10">AI TUTOR</span>
                </button>

                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="w-full bg-[#020617] relative flex flex-col">
                    <div className="aspect-video w-full max-h-[70vh] relative group overflow-hidden bg-black shadow-2xl">
                        {lesson.videoUrl ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="w-24 h-24 rounded-full bg-[#E8341A]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <PlayCircle size={64} className="text-[#E8341A] drop-shadow-[0_0_30px_rgba(232,52,26,0.5)]" />
                                </div>
                                <h3 className="text-white/30 text-[11px] font-black uppercase tracking-[0.5em] italic">Transmisión de Conocimiento Activa</h3>
                                <p className="text-white/10 text-[8px] font-bold mt-2 font-mono uppercase">ENC: {lesson.videoUrl}</p>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
                                <div className="w-20 h-1 bg-[#E8341A] mb-8 animate-pulse"></div>
                                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-none mb-4">{lesson.title}</h1>
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Módulo de Especialización Teórica</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar-hidden relative">
                    <div className="max-w-4xl mx-auto px-8 py-20">
                        {quizStep === "QUIZ" ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0F1923] p-16 text-white border-t-8 border-[#E8341A] shadow-2xl">
                                <div className="flex justify-between items-center mb-12">
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#E8341A]">Examen de Validación</span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Pregunta {currentQuestion + 1} de {quiz.length}</span>
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-tight mb-12">{quiz[currentQuestion].q}</h2>
                                <div className="space-y-4">
                                    {quiz[currentQuestion].a.map((option: string, i: number) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setSelectedAnswer(i)}
                                            className={`w-full p-6 text-left text-[11px] font-black uppercase tracking-widest border transition-all ${selectedAnswer === i ? 'bg-[#E8341A] border-[#E8341A] text-white' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                                        >
                                            <span className="mr-4 opacity-30">{String.fromCharCode(65 + i)})</span> {option}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    disabled={selectedAnswer === null}
                                    onClick={handleAnswer}
                                    className="w-full py-6 bg-white text-[#0F1923] mt-12 font-black text-[12px] uppercase tracking-[0.6em] hover:bg-[#E8341A] hover:text-white transition-all disabled:opacity-20"
                                >
                                    Siguiente Fase
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                <div className="prose prose-neutral max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter">
                                    {lesson.content ? (
                                        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                                    ) : (
                                        <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-[#0F1923]/10">
                                            <BookOpen size={32} className="text-[#0F1923]/20" />
                                            <p className="text-[#0F1923]/30 text-[10px] font-black uppercase tracking-[0.4em] italic mt-4">El núcleo de datos está siendo procesado</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-32 pt-12 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-10">
                                    <div className="flex items-center gap-6">
                                        {prevLesson && (
                                            <Link href={`/web/academy/lesson/${course.slug}/${prevLesson.slug}`} className="px-8 py-5 border-2 border-[#0F1923] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#0F1923] hover:text-white transition-all flex items-center gap-3 skew-x-[-12deg]">
                                                <div className="skew-x-[12deg] flex items-center gap-3"><ChevronLeft size={16} /> Anterior</div>
                                            </Link>
                                        )}
                                    </div>

                                    {(quiz.length > 0 && quizStep === "CONTENT" && !isCompleted) ? (
                                        <button 
                                            onClick={handleStartQuiz}
                                            className="px-12 py-5 bg-[#0F1923] text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#E8341A] transition-all flex items-center gap-4 shadow-xl"
                                        >
                                            Iniciar Validación <ArrowRight size={18} />
                                        </button>
                                    ) : (
                                        <form action={markCompletedAction}>
                                            <button type="submit" className={`px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 skew-x-[-12deg] group relative overflow-hidden ${isCompleted ? 'bg-green-600 text-white' : 'bg-[#E8341A] text-white shadow-[0_20px_50px_-10px_rgba(232,52,26,0.5)]'}`}>
                                                <div className="skew-x-[12deg] flex items-center gap-4 relative z-10">
                                                    {isCompleted ? <>Fase Completada <CheckCircle2 size={18} /></> : <>Finalizar Fase <ChevronRight size={18} /></>}
                                                </div>
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
