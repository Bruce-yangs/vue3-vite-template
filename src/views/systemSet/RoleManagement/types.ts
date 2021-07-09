export interface Item {
  aircraftModelId: string;
  aircraftModelName: string;
  aircraftNumber: string;
  aircraftPurposeId: number;
  aircraftPurposeName: string;
  aircraftTypeId: number;
  aircraftTypeName: string;
  capacity: string;
  dataFieldId: number;
  dataFieldName: string;
  flightRange: string;
  id: number;
  listenNumber: string;
  manufacturerId: number;
  manufacturerName: string;
  maxSpeed: string;
  speed: string;
  status: number;
  voyage: string;
  weight: string;
}

export interface Form {
  id: string;
  aircraftNumber: string;
  listenNumber: string;
  manufacturerId: string;
  manufacturerName: string;
  aircraftModelId: string;
  aircraftModelName: string;
  aircraftTypeId: string;
  aircraftTypeName: string;
  dataFieldId: number;
  dataFieldName: string;
  aircraftPurposeName: string;
  aircraftPurposeId: string;
  status: number;
  weight?: any;
  capacity?: any;
  speed?: any;
  maxSpeed?: any;
  voyage: any;
  flightRange?: any;
}

export interface ParamsOption {
  id: number;
  name: string;
}

export interface TableItem {
  aircraftModelName: string;
  aircraftNumber: string;
  aircraftPurposeName: string;
  aircraftTypeName: string;
  dataFieldName: string;
  id: number;
  listenNumber: string;
  manufacturerName: string;
  status: 1 | 2;
}

export interface TreeItem {
  id: number;
  name: string;
  children: TreeItem[];
}
export interface TreeItemDisabled {
  id: number;
  name: string;
  disabled: boolean;
  children: TreeItemDisabled[];
}