// /src/types/bts.d.ts
declare module '@/data/btsData.json' {
  interface BTS {
    sl: number;
    site: string;
    latitude: number | string;
    longitude: number | string;
  }
  const data: BTS[];
  export default data;
}

declare module '@/data/villageData.json' {
  interface Village {
    sl: number;
    village_code: string;
    village_name: string;
    latitude: number | string;
    longitude: number | string;
  }
  const data: Village[];
  export default data;
}