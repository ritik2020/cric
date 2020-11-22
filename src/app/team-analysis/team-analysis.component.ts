import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'team-analysis',
  templateUrl: './team-analysis.component.html',
  styleUrls: ['./team-analysis.component.css']
})
export class TeamAnalysisComponent implements OnInit {
  @Input('matchesData') matchesData;
  @Input('selectedTeam') selectedTeam:string;
  wicketData;
  constructor() { }

  ngOnInit(): void {
    this.wicketData = this.wicketsDetailOfAMatch(3,2);
    this.wicketDetailsOfAllMatch();
  }

  formatDelivery(delivery){
    var d = Object.keys(delivery)[0];
    return `${d} ${delivery[d].batsman} - ${delivery[d].non_striker}
    ${delivery[d].bowler}`
  }

  wicketDetailsOfAllMatch(){
    let res = [];
    for(let i=0; i<this.matchesData.length; i++){
      if(this.matchesData[i].innings[0]["1st innings"].team === this.selectedTeam){
        res.push(this.wicketsDetailOfAMatch(i+1,1));
      }
      if(this.matchesData[i].innings[1]["2nd innings"].team === this.selectedTeam){
        res.push(this.wicketsDetailOfAMatch(i+1,2));
      }
    }
    console.log(res);
  }
  
  wicketsDetailOfAMatch(match, inning){
    var deliveries;
    if(inning===1){
      deliveries = this.matchesData[match-1].innings[inning-1]["1st innings"].deliveries;
    }
    if(inning===2){
      deliveries = this.matchesData[match-1].innings[inning-1]["2nd innings"].deliveries;
    }
    var res = [];
    for(let i=0; i<deliveries.length; i++){
      let d = Object.keys(deliveries[i])[0];
      let deliveryData =deliveries[i][d];
      if(deliveryData["wicket"]!=undefined){
        let data = {
          delivery: d,
          batsman: deliveryData["wicket"]["player_out"],
          kind: deliveryData["wicket"]["kind"],
          bowler: deliveryData.bowler
        }
        res.push(data);
      }
    }
    return res;
  }
  
}
