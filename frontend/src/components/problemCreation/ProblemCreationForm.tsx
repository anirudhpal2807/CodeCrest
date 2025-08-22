import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ProblemFormData, ProblemCreationFormProps } from '../../types/problemCreation';
import { FormSection } from '../common/FormSection';
import { TestCaseCard } from './TestCaseCard';
import { CodeEditor } from './CodeEditor';
import { ProblemPreview } from './ProblemPreview';
import { ValidationMessage } from '../common/ValidationMessage';

// Icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
  borderRadius: '16px',
  border: `1px solid ${theme.palette.primary.main}40`,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
}));

// Zod schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

export const ProblemCreationForm: React.FC<ProblemCreationFormProps> = ({
  initialFormData,
  onSubmit,
  onPreview
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<ProblemFormData>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      ...initialFormData,
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const watchedData = watch();

  const handleFormSubmit = async (data: ProblemFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(data);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    onPreview(watchedData);
    setShowPreview(true);
  };

  return (
    <StyledContainer maxWidth="lg">
      <StyledHeader>
        <Typography variant="h3" fontWeight={700} color="text.primary" gutterBottom>
          Create New Problem
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Design coding challenges with modern tools and instant preview
        </Typography>
      </StyledHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={4}>
          {/* Basic Information */}
          <FormSection title="Basic Information" icon={<InfoOutlinedIcon color="primary" />}>
            <Stack spacing={3}>
              <div>
                <TextField
                  {...register('title')}
                  label="Problem Title"
                  fullWidth
                  variant="outlined"
                  error={!!errors.title}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                />
                <ValidationMessage message={errors.title?.message} />
              </div>

              <div>
                <TextField
                  {...register('description')}
                  label="Problem Description"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  error={!!errors.description}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                />
                <ValidationMessage message={errors.description?.message} />
              </div>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl fullWidth error={!!errors.difficulty}>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    {...register('difficulty')}
                    label="Difficulty"
                    defaultValue="easy"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                  <ValidationMessage message={errors.difficulty?.message} />
                </FormControl>

                <FormControl fullWidth error={!!errors.tags}>
                  <InputLabel>Tag</InputLabel>
                  <Select
                    {...register('tags')}
                    label="Tag"
                    defaultValue="array"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <MenuItem value="array">Array</MenuItem>
                    <MenuItem value="linkedList">Linked List</MenuItem>
                    <MenuItem value="graph">Graph</MenuItem>
                    <MenuItem value="dp">DP</MenuItem>
                  </Select>
                  <ValidationMessage message={errors.tags?.message} />
                </FormControl>
              </Stack>
            </Stack>
          </FormSection>

          {/* Test Cases */}
          <FormSection title="Test Cases" icon={<BugReportOutlinedIcon color="primary" />}>
            <Stack spacing={4}>
              {/* Visible Test Cases */}
              <div>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Visible Test Cases
                  </Typography>
                  <ActionButton
                    variant="outlined"
                    startIcon={<AddOutlinedIcon />}
                    onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                  >
                    Add Visible Case
                  </ActionButton>
                </Stack>
                
                <Stack spacing={2}>
                  {visibleFields.map((field, index) => (
                    <TestCaseCard
                      key={field.id}
                      index={index}
                      type="visible"
                      register={register}
                      errors={errors}
                      onRemove={() => removeVisible(index)}
                      showExplanation={true}
                    />
                  ))}
                </Stack>
              </div>

              {/* Hidden Test Cases */}
              <div>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Hidden Test Cases
                  </Typography>
                  <ActionButton
                    variant="outlined"
                    startIcon={<AddOutlinedIcon />}
                    onClick={() => appendHidden({ input: '', output: '' })}
                  >
                    Add Hidden Case
                  </ActionButton>
                </Stack>
                
                <Stack spacing={2}>
                  {hiddenFields.map((field, index) => (
                    <TestCaseCard
                      key={field.id}
                      index={index}
                      type="hidden"
                      register={register}
                      errors={errors}
                      onRemove={() => removeHidden(index)}
                    />
                  ))}
                </Stack>
              </div>
            </Stack>
          </FormSection>

          {/* Code Templates */}
          <FormSection title="Code Templates" icon={<CodeOutlinedIcon color="primary" />}>
            <Stack spacing={3}>
              {[0, 1, 2].map((index) => (
                <Stack key={index} spacing={2}>
                  <CodeEditor
                    language={['C++', 'Java', 'JavaScript'][index]}
                    index={index}
                    register={register}
                    errors={errors}
                    type="initial"
                  />
                  <CodeEditor
                    language={['C++', 'Java', 'JavaScript'][index]}
                    index={index}
                    register={register}
                    errors={errors}
                    type="reference"
                  />
                </Stack>
              ))}
            </Stack>
          </FormSection>

          {/* Error Display */}
          {submitError && (
            <Alert severity="error" sx={{ borderRadius: '12px' }}>
              {submitError}
            </Alert>
          )}

          {/* Action Buttons */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ pt: 2 }}>
            <ActionButton
              variant="outlined"
              startIcon={<VisibilityOutlinedIcon />}
              onClick={handlePreview}
              fullWidth
              size="large"
            >
              Preview Problem
            </ActionButton>
            
            <ActionButton
              type="submit"
              variant="contained"
              startIcon={<CheckOutlinedIcon />}
              disabled={!isValid || isSubmitting}
              fullWidth
              size="large"
            >
              {isSubmitting ? 'Creating Problem...' : 'Create Problem'}
            </ActionButton>
          </Stack>
        </Stack>
      </form>

      {/* Preview Dialog */}
      <ProblemPreview
        open={showPreview}
        onClose={() => setShowPreview(false)}
        problemData={watchedData}
      />
    </StyledContainer>
  );
};