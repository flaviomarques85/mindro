// src/pages/LandingPage.tsx
import React from 'react';
import Navbar from '../components/Navbar';
import '../App.css';  // garante o estilo global (Inter, card, button etc.)
import heroImage from '../assets/english-course-online.jpg';
import hubspot from '../assets/hubspot-icon.svg';
import chargebee from '../assets/chargebee-icon.svg';
import zendesk from '../assets/zendesk-icon.svg';
import intercom from '../assets/intercom-icon.svg';
import wordpress from '../assets/wordpress-icon.svg';
import salesforce from '../assets/salesforce-icon.svg';
import monday from '../assets/monday-icon.svg';

const features = [
    {
        name: 'Gestão de Alunos',
        description: 'Tudo sobre seus alunos: perfil, histórico, progresso e pagamentos.',
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M5 4v2H4a2 2 0 00-2 2v2a2 2 0 002 2h1v4H4a2 2 0 00-2 2v2h3v-2h2v2h3v-2a2 2 0 00-2-2H7v-4h1a2 2 0 002-2V8a2 2 0 00-2-2H5z" className="stroke-primary" />
            </svg>
        ),
    },
    {
        name: 'Quizzes & Vocabulário com IA',
        description: 'Crie quizzes automáticos e listas com inteligência artificial.',
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M12 5a1 1 0 00-1 1v7H8l4 4 4-4h-3V6a1 1 0 00-1-1zm-1 13h2v2h-2v-2z" className="stroke-primary" />
            </svg>
        ),
    },
    {
        name: 'Controle de Tarefas',
        description: 'Visualize tarefas, lições e progresso dos alunos com clareza.',
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" className="stroke-primary stroke-2" />
            </svg>
        ),
    },
    {
        name: 'Pagamentos via Stripe',
        description: 'Recebimentos seguros e automatizados com Stripe integrado.',
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M6 4h6v16H6zM18 4h-6v16h6z" className="stroke-primary stroke-2" />
            </svg>
        ),
    },
];

const LandingPage: React.FC = () => {
    return (
        <div className="bg-white font-sans text-gray-900">
            <Navbar />

            {/* Hero */}
            <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
                {/* Imagem ocupando toda a área */}
                <img
                    src={heroImage}
                    alt="Ensino e gestão"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
                />

                {/* Conteúdo acima da imagem */}
                <div className="relative z-10 container">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                        O portal de idiomas que <span className="text-primary">normaliza sua gestão</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 mb-8">
                        Organize alunos, lições, quizzes e faturamento em um só lugar. Prático, minimalista e potente.
                    </p>
                    <a
                        href="/login"
                        className="inline-block px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-md transition"
                    >
                        Acessar Painel
                    </a>
                </div>
            </section>

            {/* Seção de confiança: logotipos */}
            <section className="py-12 bg-gray-50">
                <div className="container text-center">
                    <p className="text-sm text-gray-500 uppercase mb-4">Nosso produto Substitui outras ferramentas e CRMs como:</p>
                    <div className="flex justify-center items-center gap-6 flex-wrap">
                        <img src={hubspot} alt="HubSpot" className="h-12 max-h-12 object-contain opacity-70 hover:opacity-100 transition" />
                        <img src={chargebee} alt="Chargebee" className="h-12 max-h-12 object-contain opacity-70 hover:opacity-100 transition" />
                        <img src={zendesk} alt="Zendesk" className="h-12 max-h-12 object-contain opacity-70 hover:opacity-100 transition" />
                        <img src={intercom} alt="Intercom" className="h-12 max-h-12 object-contain opacity-70 hover:opacity-100 transition" />
                        <img src={wordpress} alt="Wordpress" className="h-12 max-h-12 object-contain opacity-70 hover:opacity-100 transition" />
                        <img src={salesforce} alt="Salesforce" className="h-12 max-h-12 object-contain opacity-70 hover:opacity-100 transition" />
                        <img src={monday} alt="Monday" className="h-12 max-h-12 object-contain opacity-70 hover:opacity-100 transition" />
                    </div>
                    <p className="mt-6 text-gray-500 text-sm">
                        Veja como nos posicionamos substituindo soluções fragmentadas por uma única plataforma.
                    </p>
                </div>
            </section>

            {/* Features Cards */}
            <section id="features" className="py-20 container">
                <h2 className="text-3xl font-semibold text-center mb-12">Funcionalidades</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition flex items-start space-x-4"
                        >
                            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-gray-800 mb-2">{feature.name}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Seção de Testemunho (social proof ideal na sequência de features) */}
            <section className="py-16 bg-white">
                <div className="container max-w-3xl mx-auto text-center space-y-6">
                    <blockquote className="text-xl italic font-medium text-gray-800">
                        “Poupar o tempo que eu gastava conciliando ferramentas é incrível. Hoje só tenho uma url e tudo está lá: alunos, lições, quizzes e pagamentos.”
                    </blockquote>
                    <p className="font-semibold text-gray-700">— Professor independente & usuário feliz</p>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-20 bg-gray-50 text-center">
                <h2 className="text-3xl font-semibold mb-4">Preço Transparente</h2>
                <p className="text-lg text-gray-700 mb-8">
                    Começe por <span className="text-primary font-semibold">R$ 2,99/mês por aluno ativo</span>. Nada escondido.
                </p>
                <div className="inline-block bg-white rounded-lg shadow-md px-12 py-10 mb-6">
                    <div className="text-5xl font-bold text-primary mb-2">R$ 2,99</div>
                    <div className="text-gray-700 mb-6">por aluno/mês</div>
                    <a
                        href="/login"
                        className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition"
                    >
                        Comece agora
                    </a>
                </div>
                <div className="inline-block bg-white rounded-lg shadow-md px-12 py-10 mb-6">
                    <div className="text-5xl font-bold text-primary mb-2">R$ 5,99</div>
                    <div className="text-gray-700 mb-6">por aluno/mês</div>
                    <a
                        href="/login"
                        className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition"
                    >
                        Comece agora
                    </a>
                </div>
                <div className="inline-block bg-white rounded-lg shadow-md px-12 py-10 mb-6">
                    <div className="text-5xl font-bold text-primary mb-2">R$ 10,99</div>
                    <div className="text-gray-700 mb-6">por aluno/mês</div>
                    <a
                        href="/login"
                        className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition"
                    >
                        Comece agora
                    </a>
                </div>
            </section>

            {/* Final CTA + Lead Capture */}
            <section id="support" className="py-20 bg-white">
                <div className="container max-w-lg mx-auto text-center space-y-6">
                    <h2 className="text-3xl font-semibold mb-2">Quer conversar com a gente?</h2>
                    <p className="text-lg text-gray-700">
                        Mande um e‑mail para <a href="mailto:suporte@mindrq.com" className="text-primary underline">suporte@mindrq.com</a> ou use o formulário abaixo.
                    </p>
                    <form className="grid gap-4">
                        <input
                            type="text"
                            placeholder="Seu nome"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                        <input
                            type="email"
                            placeholder="Seu e-mail"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                        <textarea
                            placeholder="Como podemos ajudar?"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            rows={4}
                        />
                        <button type="submit" className="button w-full">Enviar mensagem</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
