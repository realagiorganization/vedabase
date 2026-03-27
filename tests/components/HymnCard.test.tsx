import { render, screen } from '@testing-library/react';
import React from 'react';
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

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Srimad Bhagavatam 1.1.1',
    );
    expect(screen.getByText('Om namo bhagavate vasudevaya.')).toBeInTheDocument();
  });
});
