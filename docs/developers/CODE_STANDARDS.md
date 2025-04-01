# Code Standards

This document outlines the coding standards and best practices to be followed when contributing to the Risk-Reward Simulator project.

## General Guidelines

- Write clean, readable, and self-documenting code
- Follow the Single Responsibility Principle
- Keep functions and components small and focused
- Use meaningful variable and function names
- Add appropriate comments for complex logic
- Write tests for critical functionality

## TypeScript

- Use TypeScript for all new code
- Define explicit types for function parameters and return values
- Use interfaces for object shapes
- Use union types for variables that can have multiple types
- Avoid using `any` type when possible

### Type Definitions

- Place shared types in `src/types/index.ts`
- Use descriptive names for types and interfaces
- Export types that are used in multiple files

Example:
```typescript
// Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// Avoid
interface Data {
  i: string;
  n: string;
  e: string;
}
```

## React Components

### Functional Components

- Use functional components with hooks
- Use TypeScript's `React.FC` type for components
- Add JSDoc comments to describe the component purpose
- Use destructuring for props

Example:
```typescript
/**
 * Displays a user profile card
 */
const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit }) => {
  // Component logic
  return (
    // JSX
  );
};
```

### Component Structure

- Group related state variables together
- Define helper functions after state declarations
- Place effect hooks after helper functions
- Return JSX at the end of the component

Example:
```typescript
const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit }) => {
  // 1. State declarations
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user.name });

  // 2. Helper functions
  const handleSubmit = () => {
    // Submit logic
  };

  // 3. Effect hooks
  useEffect(() => {
    // Effect logic
  }, [user.id]);

  // 4. JSX
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};
```

### Props

- Define prop types using interfaces
- Use optional props with default values where appropriate
- Include JSDoc comments for props

Example:
```typescript
/**
 * Props for the UserProfile component
 */
interface UserProfileProps {
  /** User data to display */
  user: UserData;
  /** Called when the user edits their profile */
  onEdit?: (updatedUser: UserData) => void;
  /** Whether to show the edit button */
  showEditButton?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  onEdit, 
  showEditButton = true 
}) => {
  // Component logic
};
```

## Context Usage

- Keep context providers focused on a specific domain
- Provide meaningful default values for context
- Use the custom hook pattern for consuming context

Example:
```typescript
// Context definition
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Provider logic
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook for using the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
```

## Styling with Tailwind CSS

- Use Tailwind's utility classes directly in components
- Create reusable component styles with consistent patterns
- Use the `className` prop for conditional styling
- Extract common styling patterns to shared components

Example:
```typescript
const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium',
  children,
  onClick 
}) => {
  const baseClasses = 'rounded font-semibold focus:outline-none';
  
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };
  
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

## File Organization

- One component per file
- Use PascalCase for component files
- Use camelCase for utility files
- Group related components in directories
- Use index files to simplify imports

Example:
```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── UserProfile/
│   │   ├── UserProfile.tsx
│   │   ├── UserProfile.test.tsx
│   │   └── index.ts
│   └── index.ts
```

## Documentation

- Use JSDoc for components, functions, and types
- Document props, return values, and side effects
- Add code examples where helpful
- Keep documentation up-to-date when code changes

Example:
```typescript
/**
 * Calculates the expected value of a bet
 * 
 * @param betAmount - Amount being bet
 * @param multiplier - Win multiplier
 * @param probability - Probability of winning (0-1)
 * @returns Expected value of the bet
 * 
 * @example
 * // Returns 0.5
 * calculateExpectedValue(10, 2.0, 0.5);
 */
export const calculateExpectedValue = (
  betAmount: number,
  multiplier: number,
  probability: number
): number => {
  return (probability * betAmount * (multiplier - 1)) - ((1 - probability) * betAmount);
};
```

## Testing

- Write tests for critical functionality
- Use Jest and React Testing Library
- Focus on testing behavior, not implementation
- Write tests that mirror user interactions
- Keep tests independent and isolated

Example:
```typescript
describe('Button', () => {
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('should apply the correct classes for different variants', () => {
    const { rerender } = render(<Button variant="primary">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('bg-blue-500');
    
    rerender(<Button variant="secondary">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('bg-gray-200');
  });
});
```

## Pull Request Guidelines

- Keep PRs focused on a single change
- Include tests for new functionality
- Ensure all tests pass
- Update documentation as needed
- Follow the code review process
- Address code review feedback promptly 