import React, { createContext, useContext, useState } from "react";
import { Submission } from "./_layout";

interface SubmissionContextType {
  submissions: Submission[];
  addOrUpdateSubmission: (data: {
    name: string;
    subject: string;
    grade: string;
    image?: string | null;
    yearLevel?: string;
    course?: string;
  }) => void;
  updateSubmission: (submission: Submission) => void;
  deleteSubmission: (id: string) => void;
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

export const SubmissionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Original function that works with your index.tsx
  const addOrUpdateSubmission = ({
    name,
    subject,
    grade,
    image,
    yearLevel,
    course,
  }: {
    name: string;
    subject: string;
    grade: string;
    image?: string | null;
    yearLevel?: string;
    course?: string;
  }) => {
    setSubmissions((prev) => {
      const existingSubmission = prev.find((s) => s.name === name);
      if (existingSubmission) {
        return prev.map((s) =>
          s.name === name
            ? {
                ...s,
                image: image !== undefined ? image : s.image,
                grades: [...s.grades, { subject, grade }],
                yearLevel: yearLevel !== undefined ? yearLevel : s.yearLevel,
                course: course !== undefined ? course : s.course,
              }
            : s
        );
      }
      return [
        ...prev,
        {
          id: Math.random().toString(),
          image: image ?? null,
          name,
          grades: [{ subject, grade }],
          yearLevel: yearLevel ?? "N/A",
          course: course ?? "N/A",
        },
      ];
    });
  };

  // New function for updating complete submissions (used in Submission.tsx)
  const updateSubmission = (submission: Submission) => {
    setSubmissions((prev) => {
      return prev.map((s) => 
        s.id === submission.id ? submission : s
      );
    });
  };

  const deleteSubmission = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <SubmissionContext.Provider
      value={{ submissions, addOrUpdateSubmission, updateSubmission, deleteSubmission }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};

export const useSubmissionContext = () => {
  const context = useContext(SubmissionContext);
  if (!context) {
    throw new Error("useSubmissionContext must be used within a SubmissionProvider");
  }
  return context;
};