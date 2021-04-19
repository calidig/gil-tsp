import { Component, Input, OnInit } from '@angular/core'


export interface ITableHeader {
  name: string
  index: string
  onClick?: (...params) => void
  fields: {
    type?: 'input' | 'actions' | null
    inputType?: string
    onBlur?: (...params) => void
    onChange?: (...params) => void
  }
}


export class TableHeader implements ITableHeader {
  public fields = {
    onBlur: () => {
    },
    onChange: () => {
    }
  }

  public name
  public index

  constructor(name, index, fields) {
    this.name = name
    this.index = index
    Object.assign(this.fields, fields)
  }

  onClick = () => {
  }
}

export interface TableAction {
  type: 'button' | 'link'
  href?: string
  do?: (entities, entityIndex, entityField) => void
  color: string
  name: string
}

export interface TableField {
  [key: string]: any | TableAction[]
}

export interface InputTable {
  headers: ITableHeader[]
  entities: TableField[]
  sortKey?: string,
  sortDirection?: number
}


export const TableActions: {
  [key: string]: TableAction
} = {
  remove: {
    color: 'red',
    do: (arr: any[], e: number, f: string) => {
      arr.splice(e, 1)
    },
    name: 'delete',
    type: 'button'
  }
}

export const TableUtils = {
  sort(data: InputTable, key: string): void {
    if (data.sortKey === key) {
      data.sortDirection *= -1
    } else {
      data.sortDirection = 1
    }
    data.sortKey = key

    console.log(data, key, this._lastSortIndex, this)

    data.entities.sort((a, b) => {
      if (a[key]?.toLocaleLowerCase() < b[key]?.toLowerCase()) {
        return data.sortDirection
      }
      if (a[key]?.toLocaleLowerCase() > b[key]?.toLocaleLowerCase()) {
        return -1 * data.sortDirection
      }
      return 0
    })
  },
  void(): void {
  }
}

@Component({
  selector: 'app-input-table',
  templateUrl: './input-table.component.html',
  styleUrls: ['./input-table.component.scss']
})
export class InputTableComponent implements OnInit {
  @Input() set data(value: InputTable) {
    console.log('value data: ')
    console.log(value)
    this._data = value
  }

  public _data: InputTable

  constructor() {
  }

  ngOnInit(): void {
  }

}
