import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

type HymnCardProps = {
  title: string;
  verse: string;
};

function HymnCard({ title, verse }: HymnCardProps) {
  return (
    <article aria-label="hymn-card">
      <h2>{title}</h2>
      <p>{verse}</p>
    </article>
  );
}

describe('HymnCard', () => {
  it('renders title and verse content', () => {
    render(
      <HymnCard
        title="Srimad Bhagavatam 1.1.1"
        verse="Om namo bhagavate vasudevaya."
      />,
    );

    const heading = screen.getByRole('heading', { level: 2 }) as {
      textContent?: string;
    };
    const verse = screen.getByText('Om namo bhagavate vasudevaya.') as unknown;

    expect(heading.textContent).toBe('Srimad Bhagavatam 1.1.1');
    expect(Boolean(verse)).toBe(true);
  });
});
