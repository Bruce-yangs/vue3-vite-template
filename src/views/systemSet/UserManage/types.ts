export interface Item {
  name: string;
  loginName: string;
  address: string;
  roleName: string;
  id: number;
  roleId: number;
  tel: number;
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