import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FileTree from '../../../src/components/FileTree';

describe('FileTree Component', () => {
  const mockFiles = [
    { id: 'f1', path: 'README.md', name: 'README.md', isDirectory: false },
    { id: 'd1', path: 'src', name: 'src', isDirectory: true },
    { id: 'f2', path: 'src/index.js', name: 'index.js', isDirectory: false },
  ];

  it('renders files and folder hierarchy', () => {
    render(
      <FileTree
        files={mockFiles}
        activeFileId="f1"
        onSelectFile={vi.fn()}
        onCreateFile={vi.fn()}
        onRenameFile={vi.fn()}
        onDeleteFile={vi.fn()}
        canEdit={true}
      />
    );

    expect(screen.getByText('README.md')).toBeInTheDocument();
    expect(screen.getByText('src')).toBeInTheDocument();
  });

  it('triggers onSelectFile when clicking a file node', () => {
    const handleSelect = vi.fn();
    render(
      <FileTree
        files={mockFiles}
        activeFileId="f2"
        onSelectFile={handleSelect}
        onCreateFile={vi.fn()}
        onRenameFile={vi.fn()}
        onDeleteFile={vi.fn()}
        canEdit={true}
      />
    );

    const readmeNode = screen.getByText('README.md');
    fireEvent.click(readmeNode);

    expect(handleSelect).toHaveBeenCalledWith('f1');
  });

  it('hides edit controls when canEdit is false (Viewer role)', () => {
    render(
      <FileTree
        files={mockFiles}
        activeFileId="f1"
        onSelectFile={vi.fn()}
        onCreateFile={vi.fn()}
        onRenameFile={vi.fn()}
        onDeleteFile={vi.fn()}
        canEdit={false}
      />
    );

    expect(screen.queryByTitle(/new file/i)).not.toBeInTheDocument();
    expect(screen.queryByTitle(/new folder/i)).not.toBeInTheDocument();
  });
});
