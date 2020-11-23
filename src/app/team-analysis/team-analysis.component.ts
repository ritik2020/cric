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
    this.wicketData = this.wicketsDetailOfAMatch(3);
    this.battingOrderOfAMatch(0);
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
        res.push(this.wicketsDetailOfAMatch(i));
      }
      if(this.matchesData[i].innings[1]["2nd innings"].team === this.selectedTeam){
        res.push(this.wicketsDetailOfAMatch(i));
      }
    }
    return res;
  }
  
  wicketsDetailOfAMatch(match){
    let inning = this.getBattingInnings(match);
    var deliveries;
    if(inning===0){
      deliveries = this.matchesData[match].innings[inning]["1st innings"].deliveries;
    }
    if(inning===1){
      deliveries = this.matchesData[match].innings[inning]["2nd innings"].deliveries;
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
  
  battingOrderOfAMatch(match){
    let wicketsData = this.wicketsDetailOfAMatch(match);
    let wicketDeliveries = [];
    let res = [];
    wicketsData.forEach(wicket=>{
      wicketDeliveries.push(wicket.delivery);
    });

    let openers = this.getDeliveryData(match,this.getBattingInnings(match),"0.1");
    let visitedBatsman = [];
    res.push({batsman: openers.batsman, over:"0.1"});
    visitedBatsman.push(openers.batsman);
    res.push({batsman: openers.non_striker, over:"0.1"});
    visitedBatsman.push(openers.non_striker);

    for(let i=0; i<wicketDeliveries.length; i++){
      let d = (Number(wicketDeliveries[i])+0.1).toFixed(1);
      let deliveryData= this.getDeliveryData(match,this.getBattingInnings(match),d);
      if(!visitedBatsman.includes(deliveryData.batsman)){
        res.push({batsman: deliveryData.batsman, over: d});
        visitedBatsman.push(deliveryData.batsman);
      }
      else{
        res.push({batsman: deliveryData.non_striker, over: d});
        visitedBatsman.push(deliveryData.non_striker);
      }
    }

    console.log(res);
  }

  getDate(match){
    return this.matchesData[match].info.dates[0];
  }

  getWinner(match){
    return this.matchesData[match].info.outcome.winner;
  }

  getPlayerOfAMatch(match){
    return this.matchesData[match].info.player_of_match;
  }

  getOpponent(match){
    let teams = this.matchesData[match].info.teams;
    if(teams[0]!=this.selectedTeam){
      return teams[0];
    }
    else{
      return teams[1];
    }
  }

  getVenue(match){
    return this.matchesData[match].info.venue;
  }

  getBattingInnings(match){
    if(this.matchesData[match].innings[0]["1st innings"].team === this.selectedTeam){
      return 0;
    }
    else{
      return 1;
    }
  }

  getDeliveryData(match,inning,delivery){
    let deliveries;
    if(inning===0){
      deliveries = this.matchesData[match].innings[inning]["1st innings"].deliveries;
    }
    else {
      deliveries = this.matchesData[match].innings[inning]["2nd innings"].deliveries;
    }

    for(let i=0; i<deliveries.length; i++){
      let del = Object.keys(deliveries[i])[0];
      if(del===delivery){
        return deliveries[i][del];
      }
    }
  }
}
