import type React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../../src/pages/HomePage';
import { HymnPage } from '../../src/pages/HymnPage';
import { MurtiPage } from '../../src/pages/MurtiPage';
import { TranslatorPage } from '../../src/pages/TranslatorPage';

function renderWithRouter(element: React.ReactElement) {
  return render(<MemoryRouter>{element}</MemoryRouter>);
}

describe('feature pages', () => {
  it('renders synchronized hymn and youtube search surfaces on the home page', async () => {
    renderWithRouter(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/Vedabase dump/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Status: fresh \/ complete: true/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: 'Featured Hymns' })).toBeInTheDocument();
    expect(screen.getByText(/Cached YouTube Reciter Search/i)).toBeInTheDocument();
  });

  it('renders hymn page with recorder and karaoke content', async () => {
    renderWithRouter(<HymnPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Gayatri Mantra' }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole('heading', { name: 'Gayatri Mantra Reciter' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Seed synchronized Vedabase corpus/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Karaoke Recitation' }),
    ).toBeInTheDocument();
  });

  it('renders translator metrics from the typed mock flow', async () => {
    renderWithRouter(<TranslatorPage />);

    await waitFor(() => {
      expect(screen.getByText(/92% confidence/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Underwords: 7/i)).toBeInTheDocument();
    expect(screen.getByText(/Pronunciation:/i)).toBeInTheDocument();
  });

  it('renders murti metadata and generated prompt summary', async () => {
    renderWithRouter(<MurtiPage />);

    await waitFor(() => {
      expect(screen.getByText(/Featured prompt:/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/temple dawn meditation/i)).toBeInTheDocument();
    expect(screen.getByText(/transformation \/ stillness/i)).toBeInTheDocument();
    expect(screen.getByText(/protection \/ courage/i)).toBeInTheDocument();
  });
});
