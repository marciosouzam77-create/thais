
export interface OrganizedPlan {
  eventDetails: {
    date: string;
    time: string;
    services: string;
  };
  planning: {
    task: string;
    status: string;
    responsible?: string | null;
  }[];
  safety: {
    dc85: {
        preparationBy: string;
        deadline: string;
        safetyResponsible: string;
    }
  };
  volunteers: string[];
  documents: string[];
  ppe: string[];
}
