import React from 'react';
import { TextField, Typography, Stack, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProblemFormData } from '../../types/problemCreation';
import { ValidationMessage } from '../common/ValidationMessage';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';

const StyledCodeEditor = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[900],
  border: `1px solid ${theme.palette.grey[700]}`,
  borderRadius: '12px',
  '& .MuiTextField-root': {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      fontFamily: '"JetBrains Mono", "Fira Code", "Monaco", monospace',
      fontSize: '14px',
      lineHeight: 1.5,
      '& textarea': {
        resize: 'vertical',
      }
    }
  }
}));

const LanguageHeader = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.primary.main + '20',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.primary.main}40`,
}));

interface CodeEditorProps {
  language: string;
  index: number;
  register: UseFormRegister<ProblemFormData>;
  errors: FieldErrors<ProblemFormData>;
  type: 'initial' | 'reference';
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  index,
  register,
  errors,
  type
}) => {
  const fieldName = type === 'initial' ? 'startCode' : 'referenceSolution';
  const codeField = type === 'initial' ? 'initialCode' : 'completeCode';
  const label = type === 'initial' ? 'Initial Code' : 'Reference Solution';

  return (
    <StyledCodeEditor elevation={1}>
      <LanguageHeader direction="row" alignItems="center" spacing={1}>
        <CodeOutlinedIcon color="primary" />
        <Typography variant="h6" color="primary" fontWeight={600}>
          {language}
        </Typography>
      </LanguageHeader>
      
      <Stack spacing={2}>
        <div>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            {label}
          </Typography>
          <TextField
            {...register(`${fieldName}.${index}.${codeField}` as any)}
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            placeholder={`Enter ${language} code here...`}
          />
          <ValidationMessage 
            message={errors[fieldName as keyof ProblemFormData]?.[index]?.[codeField as keyof any]?.message} 
          />
        </div>
      </Stack>
    </StyledCodeEditor>
  );
};