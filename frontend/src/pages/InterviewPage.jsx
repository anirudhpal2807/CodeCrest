import { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from '../components/Header';
import { INTERVIEW_FAQS } from '../data/interviewFaqs';

export default function InterviewPage() {
  const [query, setQuery] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const categories = useMemo(() => {
    const set = new Set(INTERVIEW_FAQS.map((f) => f.category));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return INTERVIEW_FAQS;
    return INTERVIEW_FAQS.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--cc-bg-primary)' }}>
      <Header />
      <Box sx={{ pt: '88px', pb: 8 }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.03em',
              mb: 1,
              fontSize: { xs: '1.6rem', sm: '2rem' },
            }}
          >
            Interview prep — 100 FAQs
          </Typography>
          <Typography sx={{ color: '#64748b', mb: 3, fontSize: '0.95rem', maxWidth: 640 }}>
            Quick answers spanning data structures, system design lite, JS/React, behavioral STAR
            framing, and more. Use search to narrow topics.
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Search questions, answers, or categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                background: 'rgba(30,41,59,0.7)',
                borderRadius: '12px',
                color: '#e2e8f0',
                '& fieldset': { borderColor: 'rgba(148,163,184,0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(148,163,184,0.35)' },
                '&.Mui-focused fieldset': { borderColor: '#6366f1' },
              },
              '& .MuiInputBase-input::placeholder': { color: '#64748b', opacity: 1 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#64748b', fontSize: 22 }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {categories.slice(0, 12).map((c) => (
              <Chip
                key={c}
                size="small"
                label={c}
                onClick={() => setQuery(c)}
                sx={{
                  background: 'rgba(99,102,241,0.12)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99,102,241,0.25)',
                  cursor: 'pointer',
                  '&:hover': { background: 'rgba(99,102,241,0.2)' },
                }}
              />
            ))}
          </Box>

          <Typography sx={{ color: '#64748b', fontSize: '0.8rem', mb: 2 }}>
            Showing <strong style={{ color: '#94a3b8' }}>{filtered.length}</strong> / {INTERVIEW_FAQS.length}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {filtered.map((faq) => (
              <Accordion
                key={faq.id}
                disableGutters
                elevation={0}
                sx={{
                  background: 'rgba(15,21,36,0.95)',
                  border: '1px solid rgba(148,163,184,0.1)',
                  borderRadius: '12px !important',
                  '&:before': { display: 'none' },
                  mb: 1,
                  overflow: 'hidden',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#64748b' }} />}
                  sx={{
                    '& .MuiAccordionSummary-content': { my: 1.25, alignItems: 'flex-start', gap: 1.5 },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: '#6366f1',
                      letterSpacing: '0.06em',
                      minWidth: 28,
                      pt: 0.35,
                    }}
                  >
                    {faq.id}
                  </Typography>
                  <Box>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0', lineHeight: 1.45 }}>
                      {faq.question}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#475569', mt: 0.35 }}>{faq.category}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2, pl: { xs: 2, sm: 7 }, pr: 2 }}>
                  <Typography sx={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.65 }}>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          {filtered.length === 0 && (
            <Typography sx={{ color: '#64748b', textAlign: 'center', py: 6 }}>No matches — try another keyword.</Typography>
          )}
        </Container>
      </Box>
    </div>
  );
}
