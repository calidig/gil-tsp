export interface GeoPoint {
  lng: number
  lat: number
}

export interface RouteInfo {
  address: string
  description?: string
  eta: string
  phone: string
  geolocation: GeoPoint
  break: string
  checked: boolean
  boxes: number | string
  id?: string
  status?: string
  comment?: string
}

export interface RouteModel {
  id?: string
  name: string
  owner?: string
  user?: string
  data?: any
  algorithm: string
  info: string
  status: string
  createdAt: Date
  startTime: Date
  total_boxes: 7
  updatedAt: Date
}

export interface RouteStatusModel {
  id: string
  name: string
  status: string
  createdAt: Date
}
