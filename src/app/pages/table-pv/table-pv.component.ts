import { Component, OnInit } from '@angular/core'
import { AdminService } from '../../services/admin.service'
import { SnackService } from '../../services/snack.service'
import { InputTable, TableActions, TableField, TableUtils } from '../../components/input-table/input-table.component'

@Component({
  templateUrl: './table-pv.component.html',
  styleUrls: ['./table-pv.component.scss']
})
export class TablePVComponent implements OnInit {

  data: InputTable

  constructor(public admin: AdminService, private snack: SnackService) {
  }

  ngOnInit(): void {
    this.admin.getSettings().subscribe(settings => {
      this.data = {
        headers: [
          {
            name: 'Name',
            index: 'name',
            onClick: TableUtils.sort,
            fields: {
              type: 'input',
              onBlur: () => {
              },
              inputType: 'text'
            }
          },
          {
            name: 'Type',
            index: 'type',
            onClick: TableUtils.sort,
            fields: {
              type: 'input',
              onBlur: () => {
              },
              inputType: 'text'
            }
          },
          {
            name: 'Value',
            index: 'value',
            onClick: TableUtils.sort,
            fields: {
              type: 'input',
              onBlur: () => {
              },
              inputType: 'text'
            }
          },
          {
            name: 'Last update',
            index: 'updatedAt',
            onClick: TableUtils.sort,
            fields: {
              type: 'input',
              onBlur: () => {
              },
              inputType: 'text'
            }
          },
          {
            name: 'Action',
            index: 'action',
            fields: {
              type: 'actions'
            }
          }
        ],
        entities: settings.map((s: TableField) => {
          s.action = [
            TableActions.remove
          ]
          return s
        })
      }
    })
  }

}
