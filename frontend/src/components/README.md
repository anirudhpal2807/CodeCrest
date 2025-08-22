# Header Component

The Header component is a comprehensive navigation bar that includes:

## Features

- **CodeCrest Branding**: Displays the CodeCrest logo and branding
- **Responsive Design**: Works on both desktop and mobile devices
- **Authentication**: Integrated login/signup modal with form validation
- **User Profile**: Profile menu with logout functionality
- **Search**: Search bar for problems
- **Navigation**: Links to Problems, Contest, Discuss, and Interview sections
- **Mobile Drawer**: Side drawer for mobile navigation

## Usage

```tsx
import Header from './components/Header';

function App() {
  return (
    <div>
      <Header />
      {/* Your app content */}
    </div>
  );
}
```

## Features

### Authentication
- Sign In/Sign Up buttons for unauthenticated users
- User avatar and profile menu for authenticated users
- Integrated AuthModal with form validation
- Automatic navigation after successful authentication

### Responsive Design
- Desktop: Full navigation bar with search and user actions
- Mobile: Hamburger menu with side drawer
- Adaptive layout based on screen size

### User Profile Menu
- User information display
- Profile link
- Admin panel access (for admin users)
- Logout functionality

### Search
- Search bar for problems
- Placeholder text and search icon
- Styled with glass morphism effect

## Dependencies

- Material-UI components
- Redux for state management
- React Router for navigation
- React Hook Form for form handling
- Zod for validation

## Styling

The component uses glass morphism design with:
- Semi-transparent backgrounds
- Backdrop blur effects
- Smooth hover animations
- Consistent with the CodeCrest theme

## Recent Fixes

### Navigation Throttling Issue (FIXED)
- **Problem**: Browser hanging due to rapid navigation attempts when clicking admin panel
- **Solution**: 
  - Created `useThrottledNavigation` utility hook
  - Implemented proper navigation throttling with timeout management
  - Added console logging for navigation debugging
  - Increased timeout to 1.5 seconds for better stability
  - Removed conflicting NavLink components that caused double navigation
  - Added proper cleanup on component unmount

### Search Functionality
- Implemented working search functionality for problems
- Search works across problem title, description, and tags
- Search results are displayed with clear indicators
- Search query is passed via URL parameters
- Mobile search support in drawer menu
- Search button is disabled when no query is entered

### Features Added
- **Search Bar**: Fully functional search with form submission
- **Navigation Links**: Working links to Problems, Contest, Discuss, Interview
- **Mobile Support**: Search and navigation in mobile drawer
- **URL Integration**: Search queries are reflected in URL
- **Loading States**: Proper loading indicators during navigation
