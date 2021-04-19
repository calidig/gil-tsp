import { Component, OnInit } from '@angular/core'
import { TeamService } from '../../services/team.service'
import { Router } from '@angular/router'
import { LanguageService } from '../../services/language.service'
import { tap } from 'rxjs/operators'
import { MapViewService } from '../../services/map-view.service'

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.scss']
})
export class MyTeamComponent implements OnInit {

  team
  constructor(public  teamService: TeamService,
              private router: Router,
              public language: LanguageService) {

  }

  ngOnInit(): void {
    this.teamService.getAll().pipe(tap(t => console.log(t))).subscribe(t => this.team = t)
  }

}
