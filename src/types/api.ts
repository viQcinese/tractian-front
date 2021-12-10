export type Asset = {
  id: number;
  sensors: string[];
  model: string;
  status: 'inAlert' | 'inDowntime' | 'inOperation';
  healthscore: number;
  name: string;
  image: string;
  specifications: AssetSpecification;
  metrics: AssetMetrics;
  unitId: number;
  companyId: number;
};

export type AssetSpecification = {
  maxTemp?: number;
  power?: number;
  rpm?: number;
};

export type AssetMetrics = {
  totalCollectsUptime: number;
  totalUptime: number;
  lastUptimeAt: string;
};

export type Unit = {
  id: number;
  name: string;
  companyId: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  companyId: number;
  unitId: number;
};

export type Company = {
  id: number;
  name: string;
};
