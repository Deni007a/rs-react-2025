import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

const mockPerson = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  homeworld: 'https://swapi.dev/api/planets/1/',
  films: ['https://swapi.dev/api/films/1/'],
  species: [],
  vehicles: ['https://swapi.dev/api/vehicles/14/'],
  starships: ['https://swapi.dev/api/starships/12/'],
  created: '2014-12-09T13:50:51.644000Z',
  edited: '2014-12-20T21:17:56.891000Z',
  url: 'https://swapi.dev/api/people/1/',
};

const mockResponse = {
  count: 1,
  next: null,
  previous: null,
  results: [mockPerson],
};

const mockEmptyResponse = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};

describe('App Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as jest.Mock;
    (global.fetch as jest.Mock).mockImplementation((url) => {
      // Return empty response for initial load
      if (url.includes('page=1') && !url.includes('search')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockEmptyResponse,
        });
      }
      // Return mock response for search
      if (url.includes('search=Luke')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockResponse,
        });
      }
      // Default fallback
      return Promise.resolve({
        ok: true,
        json: async () => mockEmptyResponse,
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and display character data when search is performed', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
    });

    // Initial fetch should happen on mount
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Simulate user input
    const input = screen.getByPlaceholderText(/введите имя/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Luke' } });
    });

    // Find and click search button
    const searchButton = screen.getByRole('button', { name: /search/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // Verify fetch was called with search parameter
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=Luke')
      );
    });

    // Wait for and verify the character data is displayed in the card
    const characterName = await screen.findByRole('heading', {
      name: /luke skywalker/i,
    });
    expect(characterName).toBeInTheDocument();

    // Verify additional character details
    const birthYear = screen.getByText(/birth year:.*19BBY/i);
    expect(birthYear).toBeInTheDocument();

    const gender = screen.getByText(/gender:.*male/i);
    expect(gender).toBeInTheDocument();

    // Verify the count of found characters
    const countText = screen.getByText(/найдено персонажей:.*1/i);
    expect(countText).toBeInTheDocument();
  });
});
