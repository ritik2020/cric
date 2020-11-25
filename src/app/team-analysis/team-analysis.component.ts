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

  inningsNameArray = ["1st innings","2nd innings"];
  ngOnInit(): void {
    this.battingOrder = this.battingOrderOfAllMatches();
    // console.log(this.wicketTakenByAllBowlersInAMatch(0));
    // console.log(this.matchesData[5]);
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
    let inning = this.getBowlingInnings(match);
    var deliveries = this.matchesData[match].innings[inning][this.inningsNameArray[inning]].deliveries;
  
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
    let res = [];
    let battingInning  =  this.getBattingInnings(match);
    if(battingInning===-1){
      return [];
    }
    let deliveries;
    if(battingInning===0){
      deliveries = matchData.innings[0]["1st innings"].deliveries;
    }
    else{
      deliveries = matchData.innings[1]["2nd innings"].deliveries;
    }
    
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
    let inningsLength = this.matchesData[match].innings.length;
    if(inningsLength===0){
      return -1;
    }

    if(this.matchesData[match].innings[0]["1st innings"].team === this.selectedTeam){
      return 0;
    }

    if(inningsLength===1){
      return -1;
    }

    
    return 1;
    
  }

  getBowlingInnings(match){
    let inningsLength = this.matchesData[match].innings.length;
    if(inningsLength===0){
      return -1;
    }

    if(this.matchesData[match].innings[0]["1st innings"].team !==this.selectedTeam){
      return 0;
    }

    if(inningsLength===1){
      return -1;
    }

    return 1;
    
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
  runScoredByBatsman(batsman,match){
    let inning = this.getBattingInnings(match);
    let inn = ["1st innings","2nd innings"];
    let deliveries = this.matchesData[match].innings[inning][inn[inning]].deliveries;
    
    let run = 0;
    let found = false;

    for(let i=0;i<deliveries.length;i++){
      let d = Object.keys(deliveries[i])[0];
      if(deliveries[i][d].batsman===batsman){
        run+=deliveries[i][d].runs.batsman;
        found = true;
      }
    }
    if(found){
      return run;
    }
    return -1;
  }

  runScoredByBatsmenInAMatch(match){
    let bo = this.battingOrderOfAMatch(match);
    let res = new Map();
    for(let i=0;i<bo.length;i++){
      res.set(bo[i].batsman,this.runScoredByBatsman(bo[i].batsman,match));

    }
    return res;
  }
  runsScoredByBatsmenInAllMatches(){
    let res = [];
    for(let i=0;i<this.matchesData.length;i++){
      res.push(this.runScoredByBatsmenInAMatch(i));
    }
    return res;
  }
  
  wicketsTakenByBowler(bowler,match){
    let m = this.matchesData[match];
    let inn = this.getBowlingInnings(match);
    let wicket = 0;
    let deliveries = m.innings[inn][this.inningsNameArray[inn]].deliveries;
    for(let i=0;i<deliveries.length;i++){
      let d = Object.keys(deliveries[i])[0];
      if(deliveries[i][d].wicket!==undefined){
        if(deliveries[i][d].wicket.kind!=="run out" && deliveries[i][d].bowler==bowler){
          wicket++;
        }
      }
    }
    return wicket;
  }
  
  wicketTakenByAllBowlersInAMatch(match){
    let wicketData = this.wicketsDetailOfAMatch(match);
    let res = new Map();
    for(let i=0; i<wicketData.length; i++){
      if(wicketData[i].kind!="run out"){
        if(res.has(wicketData[i].bowler)){
          let currentWkt = res.get(wicketData[i].bowler);
          res.set(wicketData[i].bowler,currentWkt+1);
        } 
        else {
          res.set(wicketData[i].bowler, 1);
        }
      }
    }

    return res;
  }

}
  
