import { render, screen } from '@testing-library/react';
import { ListingCard } from './ListingCard';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>
  }
});

describe('ListingCard', () => {
  const mockListing = {
    id: 'listing-123',
    gameDate: new Date('2024-12-25'),
    haveSection: '101',
    haveRow: 'A',
    haveSeat: '5',
    haveZone: 'Lower Bowl',
    faceValue: 150.00,
    wantZones: ['Upper Bowl', 'Club Level'],
    wantSections: ['201', '202'],
    status: 'ACTIVE',
    boosted: false,
    team: {
      id: 1,
      name: 'Lakers',
      slug: 'lakers',
      logoUrl: '/teams/lakers.png',
    },
    user: {
      id: 'user-456',
      profile: {
        firstName: 'John',
        lastInitial: 'D',
      },
    },
  };

  describe('Unauthenticated User', () => {
    it('shows sign-in button with correct callback URL', () => {
      render(<ListingCard listing={mockListing} isAuthenticated={false} />);

      const signInLink = screen.getByRole('link', { name: /sign in to message/i });
      expect(signInLink).toBeInTheDocument();

      // Check that the link contains the listing ID in the callbackUrl
      const href = signInLink.getAttribute('href');
      expect(href).toContain('callbackUrl');
      expect(href).toContain(`listingId=${mockListing.id}`);
      expect(href).toContain('/auth/signin');
    });

    it('hides exact seat location for unauthenticated users', () => {
      render(<ListingCard listing={mockListing} isAuthenticated={false} />);

      // Should show zone category instead of exact location
      expect(screen.getByText(/lower bowl/i)).toBeInTheDocument();
      expect(screen.getByText(/sign in to see exact location/i)).toBeInTheDocument();

      // Should NOT show exact section/row/seat
      expect(screen.queryByText(/section 101/i)).not.toBeInTheDocument();
    });

    it('does not show user profile for unauthenticated users', () => {
      render(<ListingCard listing={mockListing} isAuthenticated={false} />);

      expect(screen.queryByText(/listed by/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/john d\./i)).not.toBeInTheDocument();
    });
  });

  describe('Authenticated User', () => {
    it('shows message button for authenticated users', () => {
      const mockOnMessage = jest.fn();
      render(
        <ListingCard
          listing={mockListing}
          isAuthenticated={true}
          onMessage={mockOnMessage}
        />
      );

      expect(screen.getByRole('button', { name: /message owner/i })).toBeInTheDocument();
    });

    it('shows exact seat location for authenticated users', () => {
      render(<ListingCard listing={mockListing} isAuthenticated={true} />);

      expect(screen.getByText(/section 101, row a/i)).toBeInTheDocument();
      expect(screen.getByText(/seat 5 • lower bowl/i)).toBeInTheDocument();
    });

    it('shows user profile for authenticated users', () => {
      render(<ListingCard listing={mockListing} isAuthenticated={true} />);

      expect(screen.getByText(/listed by/i)).toBeInTheDocument();
      expect(screen.getByText(/john d\./i)).toBeInTheDocument();
    });

    it('calls onMessage when message button is clicked', async () => {
      const mockOnMessage = jest.fn();
      const user = (await import('@testing-library/user-event')).default;

      render(
        <ListingCard
          listing={mockListing}
          isAuthenticated={true}
          onMessage={mockOnMessage}
        />
      );

      const messageButton = screen.getByRole('button', { name: /message owner/i });
      await user.click(messageButton);

      expect(mockOnMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe('Boosted Listings', () => {
    it('displays boosted badge for boosted listings', () => {
      const boostedListing = {
        ...mockListing,
        boosted: true,
        boostedAt: new Date('2024-12-01'),
      };

      render(<ListingCard listing={boostedListing} isAuthenticated={true} />);

      expect(screen.getByText(/boosted/i)).toBeInTheDocument();
    });

    it('applies special styling to boosted listings', () => {
      const boostedListing = {
        ...mockListing,
        boosted: true,
      };

      const { container } = render(
        <ListingCard listing={boostedListing} isAuthenticated={true} />
      );

      // Check for boosted border class
      const card = container.querySelector('.border-amber-400');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Inactive Listings', () => {
    it('does not show message/sign-in button for inactive listings', () => {
      const inactiveListing = {
        ...mockListing,
        status: 'INACTIVE',
      };

      render(<ListingCard listing={inactiveListing} isAuthenticated={false} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('Listing Details', () => {
    it('displays team information correctly', () => {
      render(<ListingCard listing={mockListing} isAuthenticated={true} />);

      expect(screen.getByText('Lakers')).toBeInTheDocument();
      expect(screen.getByAltText(/lakers logo/i)).toBeInTheDocument();
    });

    it('displays game date correctly', () => {
      render(<ListingCard listing={mockListing} isAuthenticated={true} />);

      // Check that date is formatted and displayed
      const dateElement = screen.getByText(/dec/i);
      expect(dateElement).toBeInTheDocument();
    });

    it('displays face value correctly', () => {
      render(<ListingCard listing={mockListing} isAuthenticated={true} />);

      expect(screen.getByText(/\$150\.00/)).toBeInTheDocument();
    });

    it('displays want zones and sections', () => {
      render(<ListingCard listing={mockListing} isAuthenticated={true} />);

      expect(screen.getByText('Upper Bowl')).toBeInTheDocument();
      expect(screen.getByText('Club Level')).toBeInTheDocument();
      expect(screen.getByText(/section 201/i)).toBeInTheDocument();
      expect(screen.getByText(/section 202/i)).toBeInTheDocument();
    });
  });
});
