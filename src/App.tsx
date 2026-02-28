import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Ingredients } from './pages/Ingredients';
import { Recipes } from './pages/Recipes';
import { Converter } from './pages/Converter';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'ingredients':
        return <Ingredients />;
      case 'recipes':
        return <Recipes />;
      case 'converter':
        return <Converter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <StoreProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </StoreProvider>
  );
}
