import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessGuideConfig, BusinessStore, BusinessProductService } from '../types';
import { BusinessDirectory } from '../components/business/BusinessDirectory';

interface BusinessGuidePageProps {
  config: BusinessGuideConfig;
  stores: BusinessStore[];
  products: BusinessProductService[];
}

export const BusinessGuidePage: React.FC<BusinessGuidePageProps> = ({
  config,
  stores,
  products,
}) => {
  const navigate = useNavigate();

  const handleSelectStore = (storeSlug: string) => {
    navigate(`/guia-empresarial/${storeSlug}`);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <BusinessDirectory
      config={config}
      stores={stores}
      products={products}
      onSelectStore={handleSelectStore}
      onOpenStore={handleSelectStore}
      onGoHome={handleGoHome}
    />
  );
};
