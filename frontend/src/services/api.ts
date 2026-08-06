import axios from 'axios';
import type { UploadResponse, AnalysisResponse, Suggestion, TailorRequest, TailorResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
});

export const uploadResume = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getAnalysis = async (id: string): Promise<AnalysisResponse> => {
  const response = await api.get(`/api/analysis/${id}`);
  return response.data;
};

export const getAISuggestions = async (id: string): Promise<{suggestions: Suggestion[]}> => {
  const response = await api.post(`/api/analysis/${id}/suggestions`);
  return response.data;
};

export const tailorResume = async (req: TailorRequest): Promise<TailorResponse> => {
  const response = await api.post('/api/tailor', req);
  return response.data;
};

export const downloadResume = async (id: string, format: string): Promise<void> => {
  const response = await api.get(`/api/download/${id}?format=${format}`, {
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `tailored_resume.${format}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
