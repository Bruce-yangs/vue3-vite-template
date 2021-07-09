export interface Item {
  aircraftModelName: string
  aircraftPurposeId: number
  aircraftPurposeName: string
  aircraftTypeId: number
  aircraftTypeName: string
  capacity: string
  flightRange?: any
  id: number
  manufacturerId: number
  manufacturerName: string
  maxSpeed: string
  speed: string
  voyage?: any
  weight: string
}

export interface ParamsOption {
  key: string
  value: string
}

export interface Desc {
  supplement: string // 补充
  add: string
  edit: string
  copy: string
  detail: string // 详情
  examine: string // 审核
  check: string // 校验
}

export interface tree {
  id: number
  name: string
  children: tree[] | null
}
