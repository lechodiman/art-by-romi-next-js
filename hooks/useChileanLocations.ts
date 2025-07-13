import { useState, useEffect } from 'react';
import { getComunasByRegion, getDefaultRegion } from '@/lib/chile-locations';

export function useChileanLocations(initialRegion?: string) {
  const [selectedRegion, setSelectedRegion] = useState(initialRegion || getDefaultRegion());
  const [availableComunas, setAvailableComunas] = useState<string[]>([]);

  useEffect(() => {
    const comunas = getComunasByRegion(selectedRegion);
    setAvailableComunas(comunas);
  }, [selectedRegion]);

  return {
    selectedRegion,
    setSelectedRegion,
    availableComunas
  };
}