import React from 'react';
import { Paper, TextField, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProblemFormData } from '../../types/problemCreation';
import { ValidationMessage } from '../common/ValidationMessage';

const StyledTestCaseCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[900],
  border: `1px solid ${theme.palette.grey[700]}`,
  borderRadius: '12px',
  position: 'relative',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[3],
  }
}));

const RemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  color: theme.palette.error.main,
  '&:hover': {
    backgroundColor: theme.palette.error.main + '20',
  }
}));

interface TestCaseCardProps {
  index: number;
  type: 'visible' | 'hidden';
  register: UseFormRegister<ProblemFormData>;
  errors: FieldErrors<ProblemFormData>;
  onRemove: () => void;
  showExplanation?: boolean;
}

export const TestCaseCard: React.FC<TestCaseCardProps> = ({
  index,
  type,
  register,
  errors,
  onRemove,
  showExplanation = false
}) => {
  const fieldPrefix = type === 'visible' ? 'visibleTestCases' : 'hiddenTestCases';
  
  return (
    <StyledTestCaseCard elevation={1}>
      <RemoveButton onClick={onRemove} size="small">
        <DeleteOutlinedIcon fontSize="small" />
      </RemoveButton>
      
      <Stack spacing={2} sx={{ mt: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Test Case {index + 1}
        </Typography>
        
        <Stack spacing={2}>
          <div>
            <TextField
              {...register(`${fieldPrefix}.${index}.input` as any)}
              label="Input"
              multiline
              rows={2}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  fontFamily: 'monospace',
                }
              }}
            />
            <ValidationMessage 
              message={errors[fieldPrefix as keyof ProblemFormData]?.[index]?.input?.message} 
            />
          </div>
          
          <div>
            <TextField
              {...register(`${fieldPrefix}.${index}.output` as any)}
              label="Expected Output"
              multiline
              rows={2}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  fontFamily: 'monospace',
                }
              }}
            />
            <ValidationMessage 
              message={errors[fieldPrefix as keyof ProblemFormData]?.[index]?.output?.message} 
            />
          </div>
          
          {showExplanation && (
            <div>
              <TextField
                {...register(`visibleTestCases.${index}.explanation` as any)}
                label="Explanation"
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              />
              <ValidationMessage 
                message={errors.visibleTestCases?.[index]?.explanation?.message} 
              />
            </div>
          )}
        </Stack>
      </Stack>
    </StyledTestCaseCard>
  );
};