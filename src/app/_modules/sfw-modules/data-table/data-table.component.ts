import { DurationToTime } from './../../../_shared/pipes/duration2time/duration2time.pipe';
import { HttpClient } from '@angular/common/http';
import { SfwComponentsService } from './../sfw-components.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Input, OnChanges } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce } from 'ng-animate';
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

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  providers: [DurationToTime],
  animations: [
    trigger('bounce', [transition('* => *', useAnimation(bounce, {
      // Set the duration to 5seconds and delay to 2seconds
      params: { timing: 5, delay: 2 }
    }))])
  ],
})
export class DataTableComponent implements OnInit, AfterContentChecked, OnChanges, OnDestroy {
  // options
  @Input() tableData;
  @Input() tableSettings;

  @Input() conversion;

  computedTableData;
  displayedColumnsTitles;
  dataSource;
  machinesState;

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
  }

  ngOnChanges(): void {
    if(this.tableData) {
      this.displayedColumnsTitles = this.tableSettings.tableHeader.columns;

      if (this.conversion && this.conversion === 'machines2parameter') {
        this.tableData = this.sfwComponentsService.machines2Parameters(
          this.tableData,
          'machine'
        );
      }
      const data = this.getComputedData(this.tableData, this.tableSettings);
      if(data) {
        this.computedTableData = data.computedTableData;
        this.dataSource = data.dataSource;
      }
    }
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
    const tableRows = [];
    Object.keys(tableSettings.tableRows).forEach((element) => {
      tableSettings.tableRows[element].parameterName = element;
      tableRows.push(tableSettings.tableRows[element]);
    });
    // tableSettings.tableRows = tableRows;

    if (Object.keys(tableData).length > 0) {
      // this.machinesState = tableData.currentStatus;

      tableRows.forEach((row) => {
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
                console.log(tableData[operandKey][machine])
                if (
                  !exp[machine] &&
                  tableData[operandKey] &&
                  ((tableData[operandKey][machine] == 0) || tableData[operandKey][machine])
                ) {
                  exp[machine] = row.evaluate.formula;
                }
                console.log(operandKey, exp[machine]);
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
                  console.log(operandKey, exp);
                  exp[machine] = exp[machine].replace(
                    new RegExp(operandKey, 'gi'),
                    operandValue
                  );
                  console.log(operandKey, exp);
                  // console.log(operandValue);
                }
              }
            );
          });
          tableData[row.parameterName] = exp;
          console.log(exp);
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

      const dataSource = new MatTableDataSource(tableRows);
      return {
        displayedColumns,
        dataSource,
        computedTableData: tableData,
      };
    }
  }

  increaseThresholdCounter(parameterName, column): void {
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
