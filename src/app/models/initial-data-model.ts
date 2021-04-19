export class CSVData {
  address = ''
  timeInPoint = ''
  demand = ''
  phone = ''
  geolocation?
  description
  driver
  _index
}


export interface InitialDataModel {
  file?: File
  fileType?: string
  startPoint?: string
  startTime?: any
  csvRecords?: CSVData[]
  carload?: number
  cars?: any[]
  name?: string
  flags: any
  country?: string
}
