import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { BusinessStore, BusinessProductService } from '../types';
import { BusinessMinisite } from '../components/business/BusinessMinisite';

interface BusinessStorePageProps {
  stores: BusinessStore[];
  products: BusinessProductService[];
}

export const BusinessStorePage: React.FC<BusinessStorePageProps> = ({
  stores,
  products,
}) => {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const navigate = useNavigate();

  const currentStore = stores.find(
    (s) => s.slug === storeSlug || s.id === storeSlug
  );

  const handleBackToGuide = () => {
    navigate('/guia-empresarial');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (!currentStore) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 my-8 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Store className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Empresa não encontrada</h2>
        <p className="text-sm text-slate-500">
          Não localizamos o minisite solicitado ({storeSlug}). O estabelecimento pode ter alterado seu link ou foi desativado.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/guia-empresarial"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Ver Todas as Empresas do Guia
          </Link>
          <Link
            to="/"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Ir para a Home
          </Link>
        </div>
      </div>
    );
  }

  const storeProducts = products.filter((p) => p.businessId === currentStore.id);

  return (
    <BusinessMinisite
      store={currentStore}
      products={storeProducts}
      onBackToGuide={handleBackToGuide}
      onGoHome={handleGoHome}
    />
  );
};
