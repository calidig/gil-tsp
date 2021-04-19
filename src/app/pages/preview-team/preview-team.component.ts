import { Component, OnInit } from '@angular/core'
import { LanguageService } from '../../services/language.service'
import { TeamService } from '../../services/team.service'
import { Router } from '@angular/router'
import { TeamUserModel } from '../../models/team-user-model'


interface CustomTeamUserModel extends TeamUserModel {
  isAvailable?: boolean
}


@Component({
  selector: 'app-preview-team',
  templateUrl: './preview-team.component.html',
  styleUrls: ['./preview-team.component.scss']
})
export class PreviewTeamComponent implements OnInit {
  loading = true
  team: CustomTeamUserModel[] = []
  data

  constructor(public  teamService: TeamService,
              private router: Router,
              public language: LanguageService) {
    this.data = this.router.getCurrentNavigation().extras.state?.data

  }

  ngOnInit(): void {
    this.teamService.getCars()
      .subscribe((team: CustomTeamUserModel[]) => {
        console.log(team)
        this.team = team.map(t => ({
          ...t,
          max_distance: parseFloat((t.max_distance / 1000).toFixed(2)),
          max_time: parseFloat((t.max_time / 3600).toFixed(2)),
          isAvailable: true
        }))
        console.log('=======')
        console.log(this.team)
        this.loading = false
      })
  }

  async next(): Promise<void> {
    const cars = this.team.filter(t => t.isAvailable).map(t => ({
      home: t.home,
      carload: t.carload,
      max_distance: Math.round(t.max_distance * 1000),
      max_time: Math.round(t.max_time * 3600),
      id: t.id
    }))

    const data = {
      ...this.data,
      cars
    }
    await this.router.navigate(['new-route', 'preview'], {
      state: { data }
    })
  }
}
