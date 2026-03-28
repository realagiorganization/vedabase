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
    expect(screen.getByText(/YouTube Reciter/i)).toBeInTheDocument();
    expect(screen.getByText(/Karaoke Hymn Viewer/i)).toBeInTheDocument();
    expect(screen.getByText(/Underword Translator/i)).toBeInTheDocument();
    expect(screen.getByText(/Generative Murti Viewer/i)).toBeInTheDocument();
    expect(screen.getAllByText(/BDD scenarios/i).length).toBeGreaterThan(0);
  });
});
