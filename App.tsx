import React, { useState, Component, ReactNode } from 'react';
import { GridMenu } from './components/GridMenu';
import { DifficultyMenu } from './components/DifficultyMenu';
import { LiveGame } from './components/LiveGame';
import { CategoryType } from './types';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="flex items-center justify-center h-screen bg-black text-white p-6">界面加载失败，请刷新</div>;
    }
    return this.props.children;
  }
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const handleCategorySelect = (cat: CategoryType) => {
    setSelectedCategory(cat);
    setSelectedDifficulty(null);
  };

  const handleDifficultySelect = (diff: string) => {
    setSelectedDifficulty(diff);
  };

  const handleBackToMenu = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
  };

  const handleExitGame = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
  };

  return (
    <ErrorBoundary>
      <div className="w-full h-screen bg-black text-white">
        {!selectedCategory ? (
          <GridMenu onSelectCategory={handleCategorySelect} />
        ) : !selectedDifficulty ? (
          <DifficultyMenu 
            category={selectedCategory} 
            onSelectDifficulty={handleDifficultySelect} 
            onBack={handleBackToMenu}
          />
        ) : (
          <LiveGame 
            category={selectedCategory} 
            difficulty={selectedDifficulty}
            onExit={handleExitGame} 
          />
        )}
      </div>
    </ErrorBoundary>
  );
}