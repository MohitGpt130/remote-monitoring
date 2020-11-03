import { SfwComponentsService } from './../../../_modules/sfw-modules/sfw-components.service';
import { HttpClient } from '@angular/common/http';

import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Input } from '@angular/core';
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  AfterViewInit,
  AfterContentChecked,
  OnDestroy,
} from '@angular/core';

import { DurationToTime } from './../../../_shared/pipes/duration2time/duration2time.pipe';

@Component({
  selector: 'app-analysed-summary-data',
  templateUrl: './analysed-summary-data.component.html',
  styleUrls: ['./analysed-summary-data.component.scss'],
  providers: [
    DurationToTime,
  ]
})

export class AnalysedSummaryDataComponent
  implements OnInit, AfterContentChecked, OnDestroy {
  // options
  @Input() tableData;
  @Input() tableSettings;

  @Input() conversion;

  computedTableData;
  displayedColumnsTitles;
  dataSource;
  machinesState;

  threshHoldMatchCounter = {};

  expLoaded = {};

  thresholdMatchCounter = {};

  @ViewChildren('tdElements') tdElements: QueryList<ElementRef>;

  // @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private sfwComponentsService: SfwComponentsService,
    private httpClient: HttpClient
  ) {
    // Object.assign(this, { single: this.single });
  }

  ngOnInit(): void {
    this.displayedColumnsTitles = this.tableSettings.tableHeader.columns;

    // this.httpClient.get('http://15.206.146.128:3000/api/sku?line_id=5f0809fdc2b1ce30cc53eb8d').subscribe(data => {
    //   this.tableData = this.sfwComponentsService.machines2Parameters(data, 'machine');
    //   console.log(JSON.stringify(this.tableData));
    // });

    if (this.conversion && this.conversion === 'machines2parameter') {
      this.tableData = this.sfwComponentsService.machines2Parameters(
        this.tableData,
        'machine'
      );
    }

    const data = this.getComputedData(this.tableData, this.tableSettings);
    this.computedTableData = data.computedTableData;
    this.dataSource = data.dataSource;
  }

  ngOnDestroy(): void {}

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  load(x): void {
    // this.tdElements.forEach((td: ElementRef) => console.log(td.nativeElement));
  }

  expendCollapse(): void {}

  open(): void {
    // const dialogRef = this.dialog.open(OpenComponentComponent);
    // dialogRef.afterClosed().subscribe((result) => {});
  }

  onSelect(event): void {}

  getComputedData(tableData, tableSettings): any {
    const d = [];
    Object.keys(tableSettings.tableRows).forEach((element) => {
      tableSettings.tableRows[element].parameterName = element;
      d.push(tableSettings.tableRows[element]);
    });
    tableSettings.tableRows = d;

    if (Object.keys(tableData).length > 0) {
      // this.machinesState = tableData.currentStatus;

      tableSettings.tableRows.forEach((row) => {
        if (row.parameterPriorities) {
          for (const parameterPriority of row.parameterPriorities) {
            if (tableData[parameterPriority]) {
              tableData[row.parameterName] = tableData[parameterPriority];
              break;
            }
          }
        }

        if (
          row.conditionalParameter &&
          row.conditionalParameter.condition &&
          row.conditionalParameter.parameters
        ) {
          if (row.conditionalParameter) {
            const result = {};
            row.conditionalParameter.parameters.forEach((parameter) => {
              if (row.conditionalParameter.condition === 'greatest') {
                Object.keys(tableSettings.tableHeader.columns).forEach(
                  (machine) => {
                    if (!result[machine]) {
                      result[machine] = tableData[parameter][machine];
                    } else if (
                      tableData[parameter][machine] > result[machine]
                    ) {
                      result[machine] = tableData[parameter][machine];
                    }
                  }
                );
              }
              if (row.conditionalParameter.condition === 'smallest') {
                Object.keys(tableSettings.tableHeader.columns).forEach(
                  (machine) => {
                    if (!result[machine]) {
                      result[machine] = tableData[parameter][machine];
                    } else if (
                      tableData[parameter][machine] < result[machine]
                    ) {
                      result[machine] = tableData[parameter][machine];
                    }
                  }
                );
              }
            });
            tableData[row.parameterName] = result;
          }
        }

        if (row.evaluate && row.evaluate.operation && row.evaluate.operands) {
          row.evaluate.operands.forEach((operand) => {
            Object.keys(tableSettings.tableHeader.columns).forEach(
              (machine) => {
                if (tableData[operand][machine]) {
                  if (!tableData[row.parameterName]) {
                    tableData[row.parameterName] = {};
                  }
                  if (!tableData[row.parameterName][machine]) {
                    tableData[row.parameterName][machine] = 0;
                  }
                  if (row.evaluate.operation === 'sum') {
                    tableData[row.parameterName][machine] += Number(
                      tableData[operand][machine]
                    );
                  } else if (row.evaluate.operation === 'product') {
                    tableData[row.parameterName][machine] *= Number(
                      tableData[operand][machine]
                    );
                  } else if (row.evaluate.operation === 'addition') {
                    tableData[row.parameterName][machine] += Number(
                      tableData[operand][machine]
                    );
                  } else if (row.evaluate.operation === 'subtraction') {
                    tableData[row.parameterName][machine] -= Number(
                      tableData[operand][machine]
                    );
                  }
                }
              }
            );
            // tableData[operand]
          });
        } else if (row.evaluate && row.evaluate.formula) {
          const operands = row.evaluate.formula.match(/\w+/g);
          const operators = row.evaluate.formula.match(/[.*+\-?^${}()|[\]\\]/g);
          const exp: any = {};
          operands.forEach((operand) => {
            Object.keys(tableSettings.tableHeader.columns).forEach(
              (machine) => {
                let operandValue;
                const operandKey = operand.trim();
                if (
                  !exp[machine] &&
                  tableData[operandKey] &&
                  tableData[operandKey][machine]
                ) {
                  exp[machine] = row.evaluate.formula;
                }
                if (machine !== 'displayName' && exp[machine]) {
                  operandValue =
                    Number(operandKey) == operandKey
                      ? Number(operandKey)
                      : tableData[operandKey] && tableData[operandKey][machine]
                      ? Number(tableData[operandKey][machine])
                      : '0';
                  if (operandValue == '==') {
                    console.log(
                      'row.parameterName',
                      operands,
                      row.parameterName,
                      operandKey
                    );
                  }
                  exp[machine] = exp[machine].replace(
                    new RegExp(operandKey, 'gi'),
                    operandValue
                  );
                }
              }
            );
          });
          tableData[row.parameterName] = exp;
        }
      });
      // this.configTableRows = tableSettings.tableRows;
      // this.displayedColumns = Object.keys(
      //   this.displayedColumnsTitles
      // );
      // this.displayedColumns = Object.keys(tableData.displayName);
      let displayedColumns = Object.keys(
        tableSettings.tableHeader.columns
      ).filter((dc) => !tableSettings.hiddenColumns.includes(dc));

      displayedColumns = Object.keys(
        tableSettings.tableHeader.columns
      ).filter((dc) => displayedColumns.includes(dc));
      // tableSettings.hiddenColumns.forEach(hc => {
      //   if(this.machinesState[hc]) {
      //     delete this.machinesState[hc];
      //   }
      // });

      // data = data.filter(d => (d.parameterName !== 'Parameter' && d.parameterName !== 'currentStatus'));

      // const d = {};
      // tableSettings.tableRows.forEach(element => {
      //   d[element.parameterName] = element;
      // });
      // console.log(JSON.stringify(d));

      const dataSource = new MatTableDataSource(tableSettings.tableRows);
      return {
        displayedColumns,
        dataSource,
        computedTableData: tableData,
      };
    }
  }

  increaseThresholdCounter(parameterName, column): void {
    console.log(parameterName);
    if (!this.thresholdMatchCounter[parameterName]) {
      this.thresholdMatchCounter[parameterName] = {};
      this.thresholdMatchCounter[parameterName][column] = 1;
    } else if (
      this.thresholdMatchCounter[parameterName] &&
      !this.thresholdMatchCounter[parameterName][column]
    ) {
      this.thresholdMatchCounter[parameterName][column] = 1;
    } else {
      this.thresholdMatchCounter[parameterName][column]++;
    }
  }
}
