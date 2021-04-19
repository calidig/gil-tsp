export interface ProfileModel {
  id?: string
  email?: string
  username?: string
  firstName?: string
  lastName?: string
  created?: Date
  car_size?: 'small' | 'medium' | 'large'
  home?: string
  is_driver?: boolean
  phone?: boolean
  max_distance?: number
  max_time?: number
}
