import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'team-analysis',
  templateUrl: './team-analysis.component.html',
  styleUrls: ['./team-analysis.component.css']
})
export class TeamAnalysisComponent implements OnInit {
  @Input('matchesData') matchesData;
  @Input('selectedTeam') selectedTeam:string;
  battingOrder;
  constructor() { }

  ngOnInit(): void {
    this.battingOrder = this.battingOrderOfAllMatches();
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

  battingOrderOfAllMatches(){
    let res = [];
    for(let i=0; i<this.matchesData.length;i++){
      res.push(this.battingOrderOfAMatch(i));
    }
    return res;
  }
  

  battingOrderOfAMatch(match){
    let matchData = this.matchesData[match];
    let battingInning  =  this.getBattingInnings(match);

    let deliveries;
    if(battingInning===0){
      deliveries = matchData.innings[0]["1st innings"].deliveries;
    }
    else{
      deliveries = matchData.innings[1]["2nd innings"].deliveries;
    }
    let res = [];
    let set = new Set();

    for(let i=0; i<deliveries.length; i++)
    {
      let d = Object.keys(deliveries[i])[0];
      if(i===0){
        
        let deliveryData = deliveries[i][d];
        res.push({batsman:deliveryData.batsman,over:d});
        set.add(deliveryData.batsman);
        res.push({batsman:deliveryData.non_striker,over:d});
        set.add(deliveryData.non_striker);
        continue;
      }
      if(deliveries[i][d].wicket!==undefined){
        if(i===deliveries.length-1){
        
          break;
        }
        
        let nextDelivery = deliveries[i+1][Object.keys(deliveries[i+1])[0]];
        if(!set.has(nextDelivery.batsman)){
          res.push({batsman:nextDelivery.batsman,over:Object.keys(deliveries[i+1])[0]});
          set.add(nextDelivery.batsman);
        }
        else{
          res.push({batsman:nextDelivery.non_striker,over:Object.keys(deliveries[i+1])[0]});
          set.add(nextDelivery.non_striker);
        }
        

      }
    }
    return res;
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
