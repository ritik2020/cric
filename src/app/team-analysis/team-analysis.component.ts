import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'team-analysis',
  templateUrl: './team-analysis.component.html',
  styleUrls: ['./team-analysis.component.css']
})
export class TeamAnalysisComponent implements OnInit {
  @Input('matchesData') matchesData;
  @Input('selectedTeam') selectedTeam;
  constructor() { }

  ngOnInit(): void {
    console.log(this.matchesData);
  }

  formatDelivery(delivery){
    var d = Object.keys(delivery)[0];
    return `${d} ${delivery[d].batsman} - ${delivery[d].non_striker}
    ${delivery[d].bowler}`
  }

  findBowlers(startOver, endOver){
    console.log(this.matchesData);
  }

  saksham(){
    // 
  }

  ritik(){
    //
  }
}
