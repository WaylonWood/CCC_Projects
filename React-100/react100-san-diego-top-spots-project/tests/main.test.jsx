import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor, act, within } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from '../src/App';
import topspots from './topspots.json';

const mock = new MockAdapter(axios);

describe('Top Spots', () => {
    beforeEach(async () => {
        mock.onGet('https://ccc.helloworldbox.com/items/top_spots').reply(200, topspots);
        await act(async () => {
            render(<App />);
        });
    });

    afterEach(() => {
        cleanup();
        mock.reset();
    });

    it('should show a title of "San Diego Top Spots"', async () => {
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /San Diego Top Spots/i })).toBeInTheDocument();
        });
    });

    it('should show a tagline of "A list of the top 30 places to see in San Diego, California" in a <p> tag', async () => {
        await waitFor(() => {
            expect(screen.getByText(/A list of the top 30 places to see in San Diego, California/i)).toBeInTheDocument();
        });
    });

    it('should have a TopSpots Container component with "data-testid" of "topspots"', async () => {
        await waitFor(() => {
            expect(screen.getByTestId('topspots')).toBeInTheDocument();
        });
    });

    it('should show a list of 30 topspot components, each one with a "data-test-id" of "topspot"', async () => {
        await waitFor(() => {
            const topspotsContainer = screen.getByTestId('topspots');
            const topspots = within(topspotsContainer).getAllByTestId('topspot');
            expect(topspots.length).toBe(30);
        });
    });

    it('should show the spot name in each TopSpot component using a <h4> element', async () => {
        await waitFor(() => {
            const titles = screen.getAllByRole('heading', { level: 4 }).map(el => el.textContent);
            expect(titles.length).toBe(topspots.data.length);
            titles.forEach((title, i) => {
                const matchingSpot = topspots.data.find(topspot => topspot.name === title);
                expect(matchingSpot).not.toBeUndefined();
                expect(title).toBe(matchingSpot.name);
            });
        });
    });

    it('should show TopSpot description in each TopSpot component using a <p> element', async () => {
        await waitFor(() => {
            const descriptions = screen.getAllByTestId('topspot').map(el => el.querySelector('p').textContent);
            expect(descriptions.length).toBe(topspots.data.length);
            descriptions.forEach((description, i) => {
                const matchingSpot = topspots.data.find(topspot => topspot.description === description);
                expect(matchingSpot).not.toBeUndefined();
                expect(description).toBe(matchingSpot.description);
            });
        });
    });

    it('should show a total of 30 links', async () => {
        await waitFor(() => {
            const links = screen.getAllByRole('link').map(el => el.getAttribute('href'));
            expect(links.length).toBe(topspots.data.length);
        },);
    });

    it('should show a link in each TopSpot component using an <a> element styled with a class "btn"', async () => {
        await waitFor(() => {
            const spots = screen.getAllByTestId('topspot');
            const links = spots.map(well => within(well).getByRole('link'));
            const hrefs = links.map(link => link.getAttribute('href'));
            const expectedLinks = [
                'https://maps.google.com/?q=33.09745,-116.99572',
                'https://maps.google.com/?q=32.767874,-117.166531',
                'https://maps.google.com/?q=32.743886,-117.160621',
                'https://maps.google.com/?q=32.70648,-117.16614',
                'https://maps.google.com/?q=32.712614,-117.160163',
            ];
            expectedLinks.forEach(expectedLink => {
                expect(hrefs).toContain(expectedLink);
            });
            links.forEach(link => {
                expect(link).toHaveClass('btn');
            });
        });
    });
});
