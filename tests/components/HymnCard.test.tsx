import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { HymnCard } from '@/components/HymnCard';

describe('HymnCard', () => {
  it('renders hymn metadata from the real component', () => {
    render(
      <HymnCard
        hymn={{
          id: 'bg-4-7',
          title: 'Bhagavad-gita 4.7',
          verseCount: 1,
          deity: 'Krishna',
        }}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Open hymn Bhagavad-gita 4.7' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Bhagavad-gita 4.7')).toBeInTheDocument();
    expect(screen.getByLabelText('Verse count')).toHaveTextContent('1 verses');
    expect(screen.getByLabelText('Deity association')).toHaveTextContent(
      'Krishna association',
    );
  });

  it('invokes onSelect for click and keyboard activation', () => {
    const onSelect = vi.fn();

    render(
      <HymnCard
        hymn={{
          id: 'gayatri-mantra',
          title: 'Gayatri Mantra',
          verseCount: 24,
          deity: 'Savitar',
        }}
        onSelect={onSelect}
      />,
    );

    const card = screen.getByRole('button', { name: 'Open hymn Gayatri Mantra' });

    fireEvent.click(card);
    fireEvent.keyDown(card, { key: 'Enter' });

    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenNthCalledWith(1, 'gayatri-mantra');
    expect(onSelect).toHaveBeenNthCalledWith(2, 'gayatri-mantra');
  });
});
