export interface DeliveryAddress {
  id?: string
  index: number


  name: string
  // contactName: string
  contactComment: string
  contactPhoneNumber: string
  status: string // TODO: use real status
  // comment: string
  amountOfBoxes: number // demand
  // amountOfUnits: number
  // timeWindows: string
  address: string
  deliveryTime: number // in minutes
  // state: string
  // city: string
  // street: string
  // buildingNumber: string
  // apartment: string
  // floor: string
  firstETA: Date
  updatedETA: Date
  // Loading / unloading time Estimation
  // Loading / unloading time Real
  deleted?: boolean
  createdAt?: Date
  updatedAt?: Date

  orderId: string
}
