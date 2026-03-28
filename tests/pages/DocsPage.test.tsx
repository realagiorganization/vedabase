import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DocsPage } from '../../src/pages/DocsPage';

describe('DocsPage', () => {
  it('renders generated functionality and BDD sections', () => {
    render(
      <MemoryRouter>
        <DocsPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /Vedabase functionality and BDD documentation site/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: /^YouTube Reciter$/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('heading', { name: /^Karaoke Hymn Viewer$/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('heading', { name: /^Underword Translator$/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('heading', { name: /^Generative Murti Viewer$/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/Build Nintendo DS homebrew hymn ROMs/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Pseudographic screenshots/i })).toBeInTheDocument();
    expect(screen.getAllByText(/BDD scenarios/i).length).toBeGreaterThan(0);
  });
});
