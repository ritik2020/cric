import { Component, OnInit } from '@angular/core';
import bbl2019Matches from '../assets/bbl2019.json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  teamAllMatches = [];
  selectedTeam:string;
  ngOnInit(){
    this.selectTeam("Sydney Sixers");

  }

  selectTeam(team:string){
   this.selectedTeam = team;
   this.teamAllMatches =  bbl2019Matches.filter(match=>match.info.teams.includes(team));
  }
}
