import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LogicalGroupService } from '../services/logical-group.service';

const STATUS_WAIT = 'WAIT',
    STATUS_READY = 'READY',
    STATUS_NODATA = 'NO_DATA';

@Component({
  selector: 'app-logical-group',
  templateUrl: './logical-group.component.html',
  styleUrls: ['./logical-group.component.css']
})
export class LogicalGroupComponent implements OnInit {

  public gaugeData = [];
  public load:boolean = false;
//     ['Label', 'Value'],
//     ['Memory', 80],
//     ['CPU', 55],
//     ['Network', 68]
// ];

public gaugeOptions = {
    width: 400, height: 120,
    redFrom: 90, redTo: 100,
    yellowFrom:75, yellowTo: 90,
    minorTicks: 5
};

  title = 'my-app';
  groups: Object[];
  public GROUP_STATUS = STATUS_WAIT;

  constructor(private router: Router, private capacityGraphService: LogicalGroupService) { }

    private getLogicalGroupData() {
        let observableEntity: Observable<any> = this.capacityGraphService.getLogicalGroupData();
        this.GROUP_STATUS = STATUS_WAIT;
        observableEntity.subscribe((response) => {
            if (!response) {
              console.log("empty response")
                return;
            }
            this.groups = JSON.parse(JSON.stringify(response));
            console.log(this.groups)
        }, (err) => {
            this.GROUP_STATUS = STATUS_NODATA;
        });
    }

  ngOnInit() {
    this.getLogicalGroupData()
    let eachRow = [];
    eachRow.push({v: 'CPU', f: 60});
    this.gaugeData.push(eachRow);
    eachRow = [];
    eachRow.push({v: 'Memory', f: 80});
    // eachRow.push(null);
    // eachRow.push(0);
    this.gaugeData.push(eachRow);
    console.log(this.gaugeData);
    this.load = true;

  }

}
