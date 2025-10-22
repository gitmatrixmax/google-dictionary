import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import App from '../App';

// Mock axios
vi.mock('axios');

describe('App Component', () => {
  it('renders the initial UI correctly', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /dictionary/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search for a word/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a word above/i)).toBeInTheDocument();
  });

  it('fetches and displays dictionary and image data on search', async () => {
    const word = 'hello';
    const dictionaryResponse = {
      data: {
        word: 'hello',
        phonetic: '/həˈləʊ/',
        meanings: [{
          partOfSpeech: 'exclamation',
          definitions: [{ definition: 'Used as a greeting.' }]
        }]
      }
    };
    const imagesResponse = {
      data: {
        images: [{
          id: '1',
          url: 'http://example.com/hello.jpg',
          thumbnail: 'http://example.com/hello_thumb.jpg',
          alt: 'A greeting',
          photographer: 'Tester',
          source: 'Test'
        }]
      }
    };

    // Mock both API calls
    axios.post.mockResolvedValueOnce(dictionaryResponse); // First call for dictionary
    axios.post.mockResolvedValueOnce(imagesResponse);     // Second call for images

    render(<App />);

    // Simulate user input and form submission
    const input = screen.getByPlaceholderText(/search for a word/i);
    const submitButton = screen.getByRole('button', { name: '🔍' });
    fireEvent.change(input, { target: { value: word } });
    fireEvent.click(submitButton);

    // Wait for the dictionary results to appear
    expect(await screen.findByText('/həˈləʊ/')).toBeInTheDocument();
    expect(screen.getByText('Used as a greeting.')).toBeInTheDocument();

    // Wait for the image results to appear
    const image = await screen.findByAltText('A greeting');
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('hello_thumb.jpg');
  });

  it('handles API errors gracefully', async () => {
    const word = 'errorword';
    const errorMessage = 'No definition found';

    // Mock a failed dictionary API call
    axios.post.mockRejectedValueOnce({
      response: { data: { error: errorMessage } }
    });

    render(<App />);

    const input = screen.getByPlaceholderText(/search for a word/i);
    const submitButton = screen.getByRole('button', { name: '🔍' });
    fireEvent.change(input, { target: { value: word } });
    fireEvent.click(submitButton);

    // Check that the error message is displayed
    expect(await screen.findByText(`❌ ${errorMessage}`)).toBeInTheDocument();
  });
});
