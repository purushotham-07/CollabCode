import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import WorkspaceHeader from '../../../src/components/WorkspaceHeader';

describe('WorkspaceHeader Component', () => {
  const mockWorkspace = {
    id: 'ws_1',
    name: 'Distributed Algo Lab',
    members: [
      { userId: 'u1', displayName: 'Alice', role: 'OWNER' },
      { userId: 'u2', displayName: 'Bob', role: 'EDITOR' },
    ],
  };

  it('renders workspace title and role badge', () => {
    render(
      <BrowserRouter>
        <WorkspaceHeader
          workspace={mockWorkspace}
          myRole="OWNER"
          onOpenInvite={vi.fn()}
          onDeleteWorkspace={vi.fn()}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Distributed Algo Lab')).toBeInTheDocument();
    expect(screen.getByText(/owner/i)).toBeInTheDocument();
    expect(screen.getByText(/2 online/i)).toBeInTheDocument();
  });

  it('shows invite button and delete button for Owner', () => {
    const handleInvite = vi.fn();
    render(
      <BrowserRouter>
        <WorkspaceHeader
          workspace={mockWorkspace}
          myRole="OWNER"
          onOpenInvite={handleInvite}
          onDeleteWorkspace={vi.fn()}
        />
      </BrowserRouter>
    );

    const inviteBtn = screen.getByRole('button', { name: /invite/i });
    expect(inviteBtn).toBeInTheDocument();
    fireEvent.click(inviteBtn);
    expect(handleInvite).toHaveBeenCalled();

    expect(screen.getByTitle(/delete workspace/i)).toBeInTheDocument();
  });

  it('hides delete button and invite button for Viewer', () => {
    render(
      <BrowserRouter>
        <WorkspaceHeader
          workspace={mockWorkspace}
          myRole="VIEWER"
          onOpenInvite={vi.fn()}
          onDeleteWorkspace={vi.fn()}
        />
      </BrowserRouter>
    );

    expect(screen.queryByRole('button', { name: /invite/i })).not.toBeInTheDocument();
    expect(screen.queryByTitle(/delete workspace/i)).not.toBeInTheDocument();
  });
});
