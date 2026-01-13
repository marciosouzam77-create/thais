
import React, { useState, useCallback } from 'react';
import { organizeMaintenancePlan } from './services/geminiService';
import type { OrganizedPlan } from './types';
import { MaintenanceCard } from './components/MaintenanceCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { CalendarIcon, ClipboardListIcon, UsersIcon, ShieldCheckIcon, WrenchScrewdriverIcon, DocumentTextIcon, HardHatIcon } from './components/icons';

const initialText = `*Manutenção Programada*
Data: 17/01
Horário: 8h
Serviços: Troca de forros do salão principal e sala B, retiradas das buchas e fechamento dos buracos e limpeza de filtros de ar condicionado.

*Planejamento*
Escada:
Andaime: 🟢
Aluguel do andaime: 🟢
Responsável aluguel andaime: Eduardo 

*DC-85*
* Preparação: Jonatas
* Data de envio limite para o TM : 12/01
* Responsável da segurança: Jonatas

*Voluntários*
Ricardo, Jonatas, Jessica, Danilson, Larissa 

*Documentos necessários para todos os voluntários*
* DC-82 (ter seu exemplar pessoal e seguir as orientações dele).

*Equipamentos de proteção individual (EPIs) obrigatórios*
                  1 Calçado de segurança com certificado de aprovação (CA), de acordo com a atividade;
                  2 Capacete;
                  3 Óculos de proteção;
                  4 Camiseta (sem lemas ou propagandas);
                  5 Calça comprida (jeans);
                  6  Colete refletivo ou camisa de alta visibilidade;
                  7  Protetor auricular
                  8  Luvas tricotada ou vaqueta`;

export default function App() {
  const [inputText, setInputText] = useState<string>(initialText);
  const [organizedPlan, setOrganizedPlan] = useState<OrganizedPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrganize = useCallback(async () => {
    if (!inputText.trim()) {
      setError("Please paste the maintenance plan text.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setOrganizedPlan(null);
    try {
      const result = await organizeMaintenancePlan(inputText);
      setOrganizedPlan(result);
    } catch (e) {
      console.error(e);
      setError("Failed to organize the plan. The AI model might be busy or the input format is unexpected. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'concluído':
      case 'ok':
        return <span className="text-green-500">✔</span>;
      case 'pending':
      case 'pendente':
        return <span className="text-yellow-500">●</span>;
      case 'not started':
      case 'não iniciado':
        return <span className="text-gray-400">○</span>;
      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Maintenance Plan Organizer</h1>
          <p className="text-lg text-gray-600 mt-2">Transform unstructured maintenance notes into a clear, actionable plan with AI.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">1. Paste Your Plan</h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your maintenance plan text here..."
              className="w-full h-96 flex-grow p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none"
            />
            <button
              onClick={handleOrganize}
              disabled={isLoading}
              className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Organizing...</span>
                </>
              ) : (
                'Organize Plan'
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">2. View Organized Plan</h2>
            <div className="h-[32rem] overflow-y-auto pr-2 space-y-4">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <LoadingSpinner />
                  <p className="mt-4 text-lg">AI is structuring your plan...</p>
                </div>
              )}
              {error && (
                <div className="flex items-center justify-center h-full text-red-600 bg-red-50 p-4 rounded-lg">
                  <p>{error}</p>
                </div>
              )}
              {!isLoading && !error && !organizedPlan && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
                    <ClipboardListIcon className="w-16 h-16 mb-4"/>
                    <p className="text-lg">Your organized plan will appear here.</p>
                </div>
              )}
              {organizedPlan && (
                <div className="space-y-6">
                  <MaintenanceCard title="Scheduled Maintenance" icon={<CalendarIcon />}>
                    <p><strong>Date:</strong> {organizedPlan.eventDetails.date}</p>
                    <p><strong>Time:</strong> {organizedPlan.eventDetails.time}</p>
                    <p className="mt-2"><strong>Services:</strong> {organizedPlan.eventDetails.services}</p>
                  </MaintenanceCard>
                  
                  <MaintenanceCard title="Planning & Logistics" icon={<WrenchScrewdriverIcon />}>
                    <ul className="space-y-2">
                      {organizedPlan.planning.map((item, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span className="flex items-center">
                            {getStatusIcon(item.status)}
                            <span className="ml-2">{item.task}</span>
                          </span>
                          {item.responsible && (
                            <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{item.responsible}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </MaintenanceCard>

                  <MaintenanceCard title="Safety Documentation (DC-85)" icon={<ShieldCheckIcon />}>
                     <p><strong>Preparation:</strong> {organizedPlan.safety.dc85.preparationBy}</p>
                     <p><strong>Submission Deadline:</strong> {organizedPlan.safety.dc85.deadline}</p>
                     <p><strong>Safety Officer:</strong> {organizedPlan.safety.dc85.safetyResponsible}</p>
                  </MaintenanceCard>

                   <MaintenanceCard title="Volunteer Documents" icon={<DocumentTextIcon />}>
                     <ul className="list-disc list-inside">
                       {organizedPlan.documents.map((doc, index) => <li key={index}>{doc}</li>)}
                     </ul>
                   </MaintenanceCard>
                  
                  <MaintenanceCard title="Volunteers" icon={<UsersIcon />}>
                    <div className="flex flex-wrap gap-2">
                      {organizedPlan.volunteers.map((name, index) => (
                        <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">{name}</span>
                      ))}
                    </div>
                  </MaintenanceCard>

                  <MaintenanceCard title="Required PPE" icon={<HardHatIcon />}>
                    <ul className="list-decimal list-inside space-y-1">
                      {organizedPlan.ppe.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </MaintenanceCard>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
