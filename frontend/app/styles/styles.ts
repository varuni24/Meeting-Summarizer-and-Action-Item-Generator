import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #fdf2f8 50%, #f5f3ff 100%);
  padding: 32px 16px;

  @media (min-width: 768px) {
    padding: 32px;
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
  padding-top: 32px;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    font-size: 40px;
  }
`;

export const Subtitle = styled.p`
  font-size: 18px;
  color: #4b5563;
  max-width: 600px;
  margin: 0 auto 24px;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 32px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const InputSection = styled.div`
  height: 100%;
`;

export const OutputSection = styled.div`
  height: 100%;
`;

export const InputCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
`;

export const InputHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const InputTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
`;

export const ClearButton = styled.button`
  padding: 8px 16px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e5e7eb;
  }
`;

export const UploadSection = styled.div`
  margin-bottom: 24px;
`;

export const UploadLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

export const UploadArea = styled.div`
  border: 2px dashed #93c5fd;
  border-radius: 12px;
  padding: 40px 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }
`;

export const UploadText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

export const UploadHint = styled.p`
  font-size: 14px;
  color: #6b7280;
`;

export const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  border-radius: 12px;
  margin-top: 16px;
`;

export const FileName = styled.p`
  font-weight: 600;
  color: #064e3b;
  margin-bottom: 2px;
`;

export const FileSize = styled.p`
  font-size: 12px;
  color: #059669;
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
`;

export const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #e5e7eb;
`;

export const DividerText = styled.span`
  padding: 0 16px;
  color: #9ca3af;
  font-size: 14px;
`;

export const TextInputSection = styled.div`
  margin-bottom: 24px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 16px;
  border: 2px solid #d1d5db;
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  min-height: 200px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const CharCount = styled.p`
  text-align: right;
  font-size: 14px;
  color: #6b7280;
  margin-top: 8px;
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #dc2626;
  margin-bottom: 24px;
  font-weight: 500;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 1s linear infinite;
  margin-right: 12px;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const OutputHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const OutputTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
`;

export const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

export const SectionCard = styled.div`
  background: #f9fafb;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

export const IconContainer = styled.div<{ bg: string; color: string }>`
  width: 40px;
  height: 40px;
  background: ${(props) => props.bg};
  color: ${(props) => props.color};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 12px;
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

export const DecisionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DecisionItem = styled.div`
  padding: 12px;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 10px;
`;

export const DecisionText = styled.p`
  font-weight: 500;
  color: #1e40af;
  margin-bottom: 6px;
  font-size: 15px;
`;

export const ProposedBy = styled.p`
  font-size: 13px;
  color: #3b82f6;
`;

export const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ActionItem = styled.div`
  padding: 12px;
  background: #f0fdf4;
  border: 1px solid #d1fae5;
  border-radius: 10px;
`;

export const ActionText = styled.p`
  font-weight: 500;
  color: #065f46;
  margin-bottom: 10px;
  font-size: 15px;
`;

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const Tag = styled.span<{ bg: string; color: string }>`
  padding: 5px 10px;
  background: ${(props) => props.bg};
  color: ${(props) => props.color};
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
`;

export const TopicList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Topic = styled.span`
  padding: 8px 16px;
  background: #f5f3ff;
  color: #7c3aed;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
`;

export const EmptyState = styled.div`
  background: white;
  border-radius: 20px;
  padding: 48px 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  text-align: center;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const EmptyIcon = styled.div`
  margin-bottom: 24px;
`;

export const EmptyTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
`;

export const EmptyText = styled.p`
  color: #6b7280;
  margin-bottom: 32px;
  max-width: 400px;
  line-height: 1.5;
`;

export const FeatureList = styled.div`
  text-align: left;
  width: 100%;
  max-width: 300px;
`;

export const Feature = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: #374151;
`;

export const FeatureDot = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  background: ${(props) => props.color};
  border-radius: 50%;
  margin-right: 12px;
`;


export const OutputCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 600px;
  max-height: 600px;
`;

export const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
`;
