'use client';
import { useState, useRef } from 'react';
import { MeetingSummary } from '../types/index';
import { FiUpload, FiFileText, FiCheck, FiAlertCircle, FiDownload } from 'react-icons/fi';
import {
  Container,
  Header,
  Title,
  Subtitle,
  Content,
  InputSection,
  OutputSection,
  InputCard,
  InputHeader,
  InputTitle,
  ClearButton,
  UploadSection,
  UploadLabel,
  UploadArea,
  UploadText,
  UploadHint,
  SuccessMessage,
  FileName,
  FileSize,
  Divider,
  DividerLine,
  DividerText,
  TextInputSection,
  TextArea,
  CharCount,
  ErrorMessage,
  Spinner,
  SubmitButton,
  OutputHeader,
  OutputTitle,
  DownloadButton,
  SectionCard,
  SectionHeader,
  IconContainer,
  SectionTitle,
  DecisionList,
  DecisionItem,
  DecisionText,
  ProposedBy,
  ActionList,
  ActionItem,
  ActionText,
  Tags,
  Tag,
  TopicList,
  Topic,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
  FeatureList,
  Feature,
  FeatureDot,
  OutputCard,
  ScrollContainer,
} from './styles/styles'


export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!transcript.trim()) {
      setError('Please enter a transcript or upload a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      setSummary(data as MeetingSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to summarize transcript');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setFileName(file.name);
    setError('');

    if (!file.type.includes('pdf') && !file.type.includes('text') && !file.name.endsWith('.txt')) {
      setError('Please upload PDF or TXT files only');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/upload-file', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setTranscript(data.transcript);
      setFileName(data.filename);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const formatActionItem = (item: { task: string; speaker: string; deadline: string | null }) => {
    const task = item.task.toLowerCase().startsWith('to ')
      ? item.task.substring(3)
      : item.task.toLowerCase().startsWith('need to ')
      ? item.task.substring(8)
      : item.task;

    return `${item.speaker} ${task}`;
  };

  const downloadSummary = () => {
    if (!summary) return;

    const content = `
        Meeting Summary
        ===============

        Key Decisions:
        ${summary.key_decisions.map((d, i) => `${i + 1}. ${d.decision}${d.mover ? ` (Proposed by: ${d.mover})` : ''}`).join('\n')}

        Action Items:
        ${summary.action_items.map((item, i) => `${i + 1}. ${formatActionItem(item)}${item.deadline ? ` (Deadline: ${item.deadline})` : ''}`).join('\n')}

        Key Topics:
        ${summary.key_topics.map((topic, i) => `${i + 1}. ${topic}`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setTranscript('');
    setSummary(null);
    setUploadedFile(null);
    setFileName('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Container>
      <Header>
        <Title>AI Meeting Summarizer</Title>
        <Subtitle>Transform meeting transcripts into structured summaries</Subtitle>
      </Header>

      <Content>
        <InputSection>
          <InputCard>
            <InputHeader>
              <InputTitle>Input Meeting</InputTitle>
              <ClearButton onClick={clearAll}>Clear All</ClearButton>
            </InputHeader>

            <UploadSection>
              <UploadLabel>Upload PDF or TXT File</UploadLabel>
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.txt,application/pdf,text/plain"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <UploadArea onClick={triggerFileUpload}>
                <FiUpload style={{ fontSize: '24px', color: '#3b82f6', marginBottom: '12px' }} />
                <UploadText>Click to upload or drag & drop</UploadText>
                <UploadHint>PDF or TXT files only • Max 10MB</UploadHint>
              </UploadArea>

              {fileName && (
                <SuccessMessage>
                  <FiCheck style={{ color: '#10b981', marginRight: '12px' }} />
                  <div>
                    <FileName>{fileName}</FileName>
                    {uploadedFile && (
                      <FileSize>{(uploadedFile.size / 1024).toFixed(1)} KB</FileSize>
                    )}
                  </div>
                </SuccessMessage>
              )}
            </UploadSection>

            <Divider>
              <DividerLine />
              <DividerText>OR</DividerText>
              <DividerLine />
            </Divider>

            <TextInputSection>
              <UploadLabel>Paste Transcript</UploadLabel>
              <TextArea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste your meeting transcript here.."
                rows={8}
              />
              <CharCount>{transcript.length} characters</CharCount>
            </TextInputSection>

            {error && (
              <ErrorMessage>
                <FiAlertCircle style={{ marginRight: '8px' }} />
                {error}
              </ErrorMessage>
            )}

            <SubmitButton onClick={handleSubmit} disabled={loading || !transcript.trim()}>
              {loading ? (
                <>
                  <Spinner />
                  Processing...
                </>
              ) : (
                'Generate Summary'
              )}
            </SubmitButton>
          </InputCard>
        </InputSection>

        <OutputSection>
          {summary ? (
            <OutputCard>
              <OutputHeader>
                <OutputTitle>Meeting Summary</OutputTitle>
                <DownloadButton onClick={downloadSummary}>
                  <FiDownload style={{ marginRight: '8px' }} />
                  Download
                </DownloadButton>
              </OutputHeader>

              <ScrollContainer>
                <SectionCard>
                  <SectionHeader>
                    <IconContainer bg="#dbeafe" color="#1d4ed8">
                      <FiFileText style={{ fontSize: '20px' }} />
                    </IconContainer>
                    <SectionTitle>Key Decisions</SectionTitle>
                  </SectionHeader>
                  <DecisionList>
                    {summary.key_decisions.map((decision, index) => (
                      <DecisionItem key={index}>
                        <DecisionText>{decision.decision}</DecisionText>
                        {decision.mover && (
                          <ProposedBy>Proposed by: {decision.mover}</ProposedBy>
                        )}
                      </DecisionItem>
                    ))}
                  </DecisionList>
                </SectionCard>

                <SectionCard>
                  <SectionHeader>
                    <IconContainer bg="#d1fae5" color="#059669">
                      <FiCheck style={{ fontSize: '20px' }} />
                    </IconContainer>
                    <SectionTitle>Action Items</SectionTitle>
                  </SectionHeader>
                  <ActionList>
                    {summary.action_items.map((item, index) => (
                      <ActionItem key={index}>
                        <ActionText>{formatActionItem(item)}</ActionText>
                        <Tags>
                          <Tag bg="#d1fae5" color="#059669">
                            Speaker: {item.speaker}
                          </Tag>
                          {item.deadline && (
                            <Tag bg="#fef3c7" color="#d97706">
                              Deadline: {item.deadline}
                            </Tag>
                          )}
                        </Tags>
                      </ActionItem>
                    ))}
                  </ActionList>
                </SectionCard>

                <SectionCard>
                  <SectionHeader>
                    <IconContainer bg="#e9d5ff" color="#7c3aed">
                      <FiFileText style={{ fontSize: '20px' }} />
                    </IconContainer>
                    <SectionTitle>Key Topics</SectionTitle>
                  </SectionHeader>
                  <TopicList>
                    {summary.key_topics.map((topic, index) => (
                      <Topic key={index}>{topic}</Topic>
                    ))}
                  </TopicList>
                </SectionCard>
              </ScrollContainer>
            </OutputCard>
          ) : (
            <EmptyState>
              <EmptyIcon>
                <FiFileText style={{ fontSize: '48px', color: '#3b82f6' }} />
              </EmptyIcon>
              <EmptyTitle>No Summary Yet</EmptyTitle>
              <EmptyText>
                Upload a meeting transcript or paste text to generate a summary with action items, decisions, and topics
              </EmptyText>
              <FeatureList>
                <Feature>
                  <FeatureDot color="#3b82f6" />
                  PDF & TXT file upload support
                </Feature>
                <Feature>
                  <FeatureDot color="#10b981" />
                  Action items with speaker attribution
                </Feature>
                <Feature>
                  <FeatureDot color="#8b5cf6" />
                  Key decisions and topics extraction
                </Feature>
              </FeatureList>
            </EmptyState>
          )}
        </OutputSection>
      </Content>
    </Container>
  );
}
