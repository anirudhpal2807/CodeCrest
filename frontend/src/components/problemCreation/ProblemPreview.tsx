import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Stack, 
  Chip, 
  Paper, 
  Tabs, 
  Tab, 
  Box,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ProblemFormData } from '../../types/problemCreation';
import { formatDifficulty, formatTag } from '../../utils/stringFormatters';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.default,
    maxWidth: '900px',
    width: '90vw',
    maxHeight: '90vh',
  }
}));

const PreviewContent = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px',
  marginBottom: theme.spacing(2),
}));

const CodeBlock = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[900],
  borderRadius: '8px',
  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
  fontSize: '14px',
  overflow: 'auto',
  '& pre': {
    margin: 0,
    whiteSpace: 'pre-wrap',
  }
}));

interface ProblemPreviewProps {
  open: boolean;
  onClose: () => void;
  problemData: ProblemFormData;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export const ProblemPreview: React.FC<ProblemPreviewProps> = ({
  open,
  onClose,
  problemData
}) => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={600}>
            Problem Preview
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3}>
          {/* Problem Header */}
          <PreviewContent elevation={2}>
            <Stack spacing={2}>
              <Typography variant="h4" fontWeight={700} color="text.primary">
                {problemData.title}
              </Typography>
              
              <Stack direction="row" spacing={2}>
                <Chip 
                  label={formatDifficulty(problemData.difficulty as any)}
                  color={getDifficultyColor(problemData.difficulty) as any}
                  size="small"
                />
                <Chip 
                  label={formatTag(problemData.tags as any)}
                  variant="outlined"
                  size="small"
                />
              </Stack>
              
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {problemData.description}
              </Typography>
            </Stack>
          </PreviewContent>

          {/* Test Cases */}
          <PreviewContent elevation={2}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Examples
            </Typography>
            
            <Stack spacing={2}>
              {problemData.visibleTestCases?.map((testCase, index) => (
                <Paper key={index} sx={{ p: 2, backgroundColor: 'grey.900' }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    Example {index + 1}:
                  </Typography>
                  
                  <Stack spacing={1}>
                    <div>
                      <Typography variant="body2" fontWeight={600}>Input:</Typography>
                      <CodeBlock elevation={0}>
                        <pre>{testCase.input}</pre>
                      </CodeBlock>
                    </div>
                    
                    <div>
                      <Typography variant="body2" fontWeight={600}>Output:</Typography>
                      <CodeBlock elevation={0}>
                        <pre>{testCase.output}</pre>
                      </CodeBlock>
                    </div>
                    
                    {testCase.explanation && (
                      <div>
                        <Typography variant="body2" fontWeight={600}>Explanation:</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testCase.explanation}
                        </Typography>
                      </div>
                    )}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </PreviewContent>

          {/* Code Templates */}
          <PreviewContent elevation={2}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Code Templates
            </Typography>
            
            <Tabs value={tabValue} onChange={handleTabChange}>
              {problemData.startCode?.map((code, index) => (
                <Tab key={index} label={code.language} />
              ))}
            </Tabs>
            
            {problemData.startCode?.map((code, index) => (
              <TabPanel key={index} value={tabValue} index={index}>
                <CodeBlock elevation={1}>
                  <pre>{code.initialCode}</pre>
                </CodeBlock>
              </TabPanel>
            ))}
          </PreviewContent>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Close Preview
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};