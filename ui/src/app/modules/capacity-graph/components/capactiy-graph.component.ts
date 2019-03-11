import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CapacityGraphService } from '../services/capacity-graph.service';

const STATUS_WAIT = 'WAIT',
    STATUS_READY = 'READY',
    STATUS_NODATA = 'NO_DATA';

@Component({
    selector: 'app-capactiy-graph',
    templateUrl: './capactiy-graph.component.html',
    styleUrls: ['./capactiy-graph.component.scss']
})


export class CapactiyGraphComponent implements OnInit {

    gaugeWidth = 700;
    gaugeHeight = 200;
    public gaugeType = 'cluster';

    public cpuGaugeData = [];
    public cpuAllocated = 100.0;
    public cpuCapacity = 100.0;
    cpuRedFrom = 0.75*this.cpuCapacity;
    cpuRedTo = this.cpuCapacity;
    cpuYellowFrom = 0.50*this.cpuCapacity;
    cpuYellowTo = 0.75*this.cpuCapacity;
    public cpuGaugeOptions = {
        width: this.gaugeWidth, height: this.gaugeHeight,
        redFrom: this.cpuRedFrom, redTo: this.cpuRedTo,
        yellowFrom: this.cpuYellowFrom, yellowTo: this.cpuYellowTo,
        minorTicks: 5, max: this.cpuCapacity,
    };

    public memoryGaugeData = [];
    public memoryAllocated = 100.0;
    public memoryCapacity = 100.0;
    memoryRedFrom = 0.75*this.memoryCapacity;
    memoryRedTo = this.memoryCapacity;
    memoryYellowFrom = 0.50*this.memoryCapacity;
    memoryYellowTo = 0.75*this.memoryCapacity;
    public memoryGaugeOptions = {
        width: this.gaugeWidth, height: this.gaugeHeight,
        redFrom: this.memoryRedFrom, redTo: this.memoryRedTo,
        yellowFrom: this.memoryYellowFrom, yellowTo: this.memoryYellowTo,
        minorTicks: 5, max: this.memoryCapacity,
    };

    public storageGaugeData = [];
    public storageAllocated = 100.0;
    public storageCapacity = 100.0;
    storageRedFrom = 0.75*this.storageCapacity;
    storageRedTo = this.storageCapacity;
    storageYellowFrom = 0.50*this.storageCapacity;
    storageYellowTo = 0.75*this.storageCapacity;
    public storageGaugeOptions = {
        width: this.gaugeWidth, height: this.gaugeHeight,
        redFrom: this.storageRedFrom, redTo: this.storageRedTo,
        yellowFrom: this.storageYellowFrom, yellowTo: this.storageYellowTo,
        minorTicks: 5, max: this.storageCapacity,
    };

    private setGauges(capaData) {
        let data = JSON.parse(JSON.stringify(capaData));
        this.setCPUGauge(data)
        this.setMemoryGauge(data)
        this.setStorageGauge(data)
    }

    private setCPUGauge(data) {
        if (data.type === 'node') {
            this.gaugeType = 'Node'
        } else {
            if (data.type === 'pv') {
                this.gaugeType = 'PersistentVolume'
            } else {
                this.gaugeType = 'Cluster'
            }
        }
        this.cpuCapacity = data.cpuCapacity
        this.cpuAllocated = data.cpuAllocated

        this.cpuGaugeData = [];
        let eachRow = ['CPU', this.cpuAllocated];
        this.cpuGaugeData.push(eachRow);
        this.cpuRedFrom = 0.75*this.cpuCapacity;
        this.cpuRedTo = this.cpuCapacity;
        this.cpuYellowFrom = 0.50*this.cpuCapacity;
        this.cpuYellowTo = 0.75*this.cpuCapacity;
        this.cpuGaugeOptions = {
            width: this.gaugeWidth, height: this.gaugeHeight,
            redFrom: this.cpuRedFrom, redTo: this.cpuRedTo,
            yellowFrom: this.cpuYellowFrom, yellowTo: this.cpuYellowTo,
            minorTicks: 5, max: this.cpuCapacity,
        };
    }

    private setMemoryGauge(data) {
        this.memoryCapacity = data.memoryCapacity
        this.memoryAllocated = data.memoryAllocated

        this.memoryGaugeData = [];
        let eachRow = ['Memory', this.memoryAllocated];
        this.memoryGaugeData.push(eachRow);
        this.memoryRedFrom = 0.75*this.memoryCapacity;
        this.memoryRedTo = this.memoryCapacity;
        this.memoryYellowFrom = 0.50*this.memoryCapacity;
        this.memoryYellowTo = 0.75*this.memoryCapacity;
        this.memoryGaugeOptions = {
            width: this.gaugeWidth, height: this.gaugeHeight,
            redFrom: this.memoryRedFrom, redTo: this.memoryRedTo,
            yellowFrom: this.memoryYellowFrom, yellowTo: this.memoryYellowTo,
            minorTicks: 5, max: this.memoryCapacity,
        };
    }

    private setStorageGauge(data) {
        this.storageCapacity = data.storageCapacity
        this.storageAllocated = data.storageAllocated

        this.storageGaugeData = [];
        let eachRow = ['Storage', this.storageAllocated];
        this.storageGaugeData.push(eachRow);
        this.storageRedFrom = 0.75*this.storageCapacity;
        this.storageRedTo = this.storageCapacity;
        this.storageYellowFrom = 0.50*this.storageCapacity;
        this.storageYellowTo = 0.75*this.storageCapacity;
        this.storageGaugeOptions = {
            width: this.gaugeWidth, height: this.gaugeHeight,
            redFrom: this.storageRedFrom, redTo: this.storageRedTo,
            yellowFrom: this.storageYellowFrom, yellowTo: this.storageYellowTo,
            minorTicks: 5, max: this.storageCapacity,
        };
    }

    //PUBLIC
    public CAPA_STATUS = STATUS_WAIT;
    public graphData = [];
    public colNames = ['Child', 'Parent', 'Metrics'];
    public chartOptions = {
        nodeClass: 'customNode',
        allowHtml: true,
        animation: {
            startup: true,
            duration: 1000,
            easing: 'out',
        },
        minColor: '#009688',
        midColor: '#f7f7f7',
        maxColor: '#ee8100',
        headerHeight: 40,
    };
    public selectedMetric: string = 'cpu';
    public metricOptions: any = [
        { displayValue: 'CPU', value: 'cpu', units: 'vCPU' },
        { displayValue: 'Memory', value: 'memory', units: 'GB' },
        { displayValue: 'Storage', value: 'storage', units: 'GB' }
        //{ displayValue: 'Network', value: 'network' }
    ];
    public physicalView: boolean = false;
    public rootItem: any = {};
    public filterItems: any = [];
    public selectedFilterItem: string = 'select';

    //PRIVATE
    private orgCapaData: any = {};
    private capaData: any = {};
    private keysToConsider: any = ['service', 'pod', 'container', 'process', 'cluster', 'namespace', 'deployment', 'replicaset', 'node', 'daemonset', 'job', 'statefulset', 'children', 'pv', 'pvc'];
    private uniqNames: any = [];

    constructor(private router: Router, private capacityGraphService: CapacityGraphService) { }

    private getCapacityData() {
        let observableEntity: Observable<any> = this.capacityGraphService.getCapacityData(this.physicalView);
        this.CAPA_STATUS = STATUS_WAIT;
        observableEntity.subscribe((response) => {
            if (!response) {
                return;
            }
            this.capaData = response && response.data || {};
            this.orgCapaData = JSON.parse(JSON.stringify(this.capaData));
            //console.log(this.capaData);
            this.constructData(this.capaData);
            this.setGauges(this.capaData);
        }, (err) => {
            this.CAPA_STATUS = STATUS_NODATA;
        });
    }

    private constructRoot(capaData) {
        this.rootItem = capaData;
        let eachRow = [];
        let rootName = capaData && capaData.name;
        let metricValue = capaData[this.selectedMetric] || 0;
        let metricCostValue = capaData[this.selectedMetric + 'Cost'] || 0;
        if (rootName) {
            eachRow.push({ v: rootName, f: rootName + ', ' + this.selectedMetric + ': ' + metricValue.toFixed(2) + ', ' + this.selectedMetric + ' cost: ' + metricCostValue.toFixed(2) });
            eachRow.push(null);
            eachRow.push(0);
            if (this.uniqNames.indexOf(rootName) === -1) {
                this.graphData.push(eachRow);
                this.uniqNames.push(rootName);
            }
        }
    }

    private pushToGraphData(item, parent) {
        let eachRow = [];
        let parentName = item.name === parent.name ? parent.type : parent.name;
        let metricValue = item[this.selectedMetric] || 0;
        let metricCostValue = item[this.selectedMetric + 'Cost'] || 0;
        eachRow.push({ v: item.name, f: item.name + ', ' + this.selectedMetric + ': ' + metricValue.toFixed(2) + ', ' + this.selectedMetric + ' cost: ' + metricCostValue.toFixed(2), t: item.type });
        eachRow.push(parentName);
        eachRow.push(metricValue);
        if (this.uniqNames.indexOf(item.name) === -1) {
            this.graphData.push(eachRow);
            this.uniqNames.push(item.name);
        }
    }

    private collectFilterItems(item) {
        this.filterItems.push(item.name);
    }

    private constructData(capaData) {
        this.selectedFilterItem = 'select';
        this.graphData = [];
        this.uniqNames = [];
        this.constructRoot(capaData);
        let data = JSON.parse(JSON.stringify(capaData));
        for (let key in data) {
            if (this.keysToConsider.indexOf(key) > -1) {
                this.filterItems = [];
                for (let item of data[key]) {
                    this.collectFilterItems(item);
                    this.pushToGraphData(item, data);
                }
            }
        }

        this.CAPA_STATUS = STATUS_READY;
        //console.log(this.graphData);
    }

    public onSelect(element) {
        if (!element) {
            return;
        }
        if (!element[0]) {
            return;
        }
        let row = element[0].row;
        let selectedItem = this.graphData[row];
        this.getAdditionalData(selectedItem);
    }

    private getAdditionalData(item) {
        let selectedItem = item;
        if (item && item[0] && item[0].v && item[0].t) {
            let name = item[0].v;
            let type = item[0].t;
            let observableEntity: Observable<any> = this.capacityGraphService.getCapacityData(this.physicalView, type, name);
            this.CAPA_STATUS = STATUS_WAIT;
            observableEntity.subscribe((response) => {
                if (!response) {
                    return;
                }
                let capaData = response && response.data || {};
                this.constructData(capaData);
            }, (err) => {
                this.CAPA_STATUS = STATUS_NODATA;
            });
        } else {
            return;
        }
    }

    public filterItemChange(evt) {
        for (let item of this.graphData) {
            for (let subItem of item) {
                if (subItem && subItem.v && subItem.v === this.selectedFilterItem) {
                    this.getAdditionalData(item);
                }
            }
        }
    }

    public metricChange(evt) {
        this.constructData(this.orgCapaData);
    }

    public reset() {
        this.CAPA_STATUS = STATUS_WAIT;
        this.graphData = [];
        this.uniqNames = [];
        this.constructData(this.orgCapaData);
    }

    public viewChange() {
        this.getCapacityData()
    }

    ngOnInit() {
        this.getCapacityData();
    }

}
