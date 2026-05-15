import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Code2, FileText, FlaskConical } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useToast } from './Toast';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
        explanation: z.string().min(1, 'Explanation is required'),
      })
    )
    .min(1, 'At least one visible test case required'),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
      })
    )
    .min(1, 'At least one hidden test case required'),
  startCode: z
    .array(
      z.object({
        language: z.enum(['C++', 'Java', 'JavaScript']),
        initialCode: z.string().min(1, 'Initial code is required'),
      })
    )
    .length(3, 'All three languages required'),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(['C++', 'Java', 'JavaScript']),
        completeCode: z.string().min(1, 'Complete code is required'),
      })
    )
    .length(3, 'All three languages required'),
});

const LANGUAGES = ['C++', 'Java', 'JavaScript'];

function AdminPanel() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' },
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' },
      ],
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({ control, name: 'visibleTestCases' });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({ control, name: 'hiddenTestCases' });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      showToast('Problem created successfully!', 'success');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.response?.data || error.message;
      if (
        error.response?.status === 401 &&
        errorMessage.includes('Admin')
      ) {
        showToast(`Access Denied: ${errorMessage}`, 'error', 5000);
      } else {
        showToast(`Error: ${errorMessage}`, 'error', 4000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cc-bg-primary)]">
      <ToastContainer />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <NavLink
          to="/admin"
          className="inline-flex items-center gap-2 text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Admin</span>
        </NavLink>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[var(--cc-text-primary)] mb-2">
            Create New Problem
          </h1>
          <p className="text-[var(--cc-text-secondary)]">
            Fill in all sections to add a new coding problem
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <section className="cc-card p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <FileText size={20} className="text-[var(--cc-primary-light)]" />
              <h2 className="text-lg font-semibold text-[var(--cc-text-primary)]">
                Basic Information
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-1.5">
                  Title
                </label>
                <input
                  {...register('title')}
                  className={`cc-input w-full ${errors.title ? 'border-[var(--cc-error)]!' : ''}`}
                  placeholder="e.g. Two Sum"
                />
                {errors.title && (
                  <p className="mt-1.5 text-sm text-[var(--cc-error)]">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-1.5">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={5}
                  className={`cc-input w-full resize-y ${errors.description ? 'border-[var(--cc-error)]!' : ''}`}
                  placeholder="Describe the problem statement..."
                />
                {errors.description && (
                  <p className="mt-1.5 text-sm text-[var(--cc-error)]">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-1.5">
                    Difficulty
                  </label>
                  <select
                    {...register('difficulty')}
                    className={`cc-input w-full ${errors.difficulty ? 'border-[var(--cc-error)]!' : ''}`}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-1.5">
                    Tag
                  </label>
                  <select
                    {...register('tags')}
                    className={`cc-input w-full ${errors.tags ? 'border-[var(--cc-error)]!' : ''}`}
                  >
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">DP</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Test Cases */}
          <section className="cc-card p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <FlaskConical size={20} className="text-[var(--cc-primary-light)]" />
              <h2 className="text-lg font-semibold text-[var(--cc-text-primary)]">
                Test Cases
              </h2>
            </div>

            {/* Visible Test Cases */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--cc-text-secondary)] uppercase tracking-wider">
                  Visible Test Cases
                </h3>
                <button
                  type="button"
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                  className="cc-btn-ghost inline-flex items-center gap-1.5 text-sm !py-1.5 !px-3"
                >
                  <Plus size={15} /> Add
                </button>
              </div>

              {visibleFields.length === 0 && (
                <p className="text-sm text-[var(--cc-text-dimmed)] italic">
                  No visible test cases yet. Add at least one.
                </p>
              )}

              <div className="space-y-4">
                {visibleFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--cc-text-muted)] uppercase tracking-wider">
                        Case {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVisible(index)}
                        className="p-1 rounded-lg text-[var(--cc-text-muted)] hover:text-[var(--cc-error)] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <input
                      {...register(`visibleTestCases.${index}.input`)}
                      placeholder="Input"
                      className="cc-input w-full"
                    />
                    <input
                      {...register(`visibleTestCases.${index}.output`)}
                      placeholder="Output"
                      className="cc-input w-full"
                    />
                    <textarea
                      {...register(`visibleTestCases.${index}.explanation`)}
                      placeholder="Explanation"
                      rows={2}
                      className="cc-input w-full resize-y"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden Test Cases */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--cc-text-secondary)] uppercase tracking-wider">
                  Hidden Test Cases
                </h3>
                <button
                  type="button"
                  onClick={() => appendHidden({ input: '', output: '' })}
                  className="cc-btn-ghost inline-flex items-center gap-1.5 text-sm !py-1.5 !px-3"
                >
                  <Plus size={15} /> Add
                </button>
              </div>

              {hiddenFields.length === 0 && (
                <p className="text-sm text-[var(--cc-text-dimmed)] italic">
                  No hidden test cases yet. Add at least one.
                </p>
              )}

              <div className="space-y-4">
                {hiddenFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--cc-text-muted)] uppercase tracking-wider">
                        Case {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeHidden(index)}
                        className="p-1 rounded-lg text-[var(--cc-text-muted)] hover:text-[var(--cc-error)] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <input
                      {...register(`hiddenTestCases.${index}.input`)}
                      placeholder="Input"
                      className="cc-input w-full"
                    />
                    <input
                      {...register(`hiddenTestCases.${index}.output`)}
                      placeholder="Output"
                      className="cc-input w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Code Templates */}
          <section className="cc-card p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <Code2 size={20} className="text-[var(--cc-primary-light)]" />
              <h2 className="text-lg font-semibold text-[var(--cc-text-primary)]">
                Code Templates
              </h2>
            </div>

            <div className="space-y-8">
              {[0, 1, 2].map((index) => (
                <div key={index}>
                  <h3 className="text-sm font-semibold text-[var(--cc-primary-light)] mb-4 uppercase tracking-wider">
                    {LANGUAGES[index]}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-1.5">
                        Initial Code (Starter Template)
                      </label>
                      <textarea
                        {...register(`startCode.${index}.initialCode`)}
                        rows={6}
                        className="cc-input w-full font-mono text-sm resize-y"
                        placeholder={`// ${LANGUAGES[index]} starter code...`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-1.5">
                        Reference Solution
                      </label>
                      <textarea
                        {...register(`referenceSolution.${index}.completeCode`)}
                        rows={6}
                        className="cc-input w-full font-mono text-sm resize-y"
                        placeholder={`// ${LANGUAGES[index]} complete solution...`}
                      />
                    </div>
                  </div>

                  {index < 2 && <hr className="cc-divider mt-8" />}
                </div>
              ))}
            </div>
          </section>

          {/* Submit */}
          <button type="submit" className="cc-btn-primary w-full text-base py-3">
            Create Problem
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
