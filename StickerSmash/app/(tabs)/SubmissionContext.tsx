import React, { createContext, useContext, useState } from "react";
import { Submission } from "./_layout";

interface SubmissionContextType {
  submissions: Submission[];
  addOrUpdateSubmission: (submission: Omit<Submission, "id" | "grades"> & { subject: string; grade: string }) => void;
  deleteSubmission: (id: string) => void;
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

export function SubmissionProvider({ children }: { children: React.ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const addOrUpdateSubmission = (submission: Omit<Submission, "id" | "grades"> & { subject: string; grade: string }) => {
    setSubmissions((prev) => {
      const existingSubmission = prev.find((s) => s.name.toLowerCase() === submission.name.toLowerCase());
      if (existingSubmission) {
        return prev.map((s) =>
          s.name.toLowerCase() === submission.name.toLowerCase()
            ? {
                ...s,
                image: submission.image ?? s.image,
                grades: [...s.grades, { subject: submission.subject, grade: submission.grade }],
              }
            : s
        );
      }
      return [
        ...prev,
        {
          id: Math.random().toString(),
          image: submission.image,
          name: submission.name,
          grades: [{ subject: submission.subject, grade: submission.grade }],
        },
      ];
    });
  };

  const deleteSubmission = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <SubmissionContext.Provider value={{ submissions, addOrUpdateSubmission, deleteSubmission }}>
      {children}
    </SubmissionContext.Provider>
  );
}

export function useSubmissionContext() {
  const context = useContext(SubmissionContext);
  if (!context) {
    throw new Error("useSubmissionContext must be used within a SubmissionProvider");
  }
  return context;
}