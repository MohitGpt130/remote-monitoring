import { DurationToTime } from './../../../_shared/pipes/duration2time/duration2time.pipe';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
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

@Component({
  selector: 'app-shift-summary-data',
  templateUrl: './shift-summary-data.component.html',
  styleUrls: ['./shift-summary-data.component.scss'],
  providers: [
    DurationToTime,
  ]
})
export class ShiftSummaryDataComponent implements OnInit, AfterContentChecked, OnDestroy {
  // options

  @Input() settings;
  @Input() data;

  computedTableData;
  displayedColumnsTitles;
  dataSource;
  machinesState;
  expLoaded = {};

  thresholdMatchCounter = {};

  @ViewChildren('tdElements') tdElements: QueryList<ElementRef>;

  // @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
  ) {
    // Object.assign(this, { single: this.single });
  }

  ngOnInit(): void {
    const data = this.getComputedData(this.data, this.settings);
    this.computedTableData = data.computedData;
    this.dataSource = data.dataSource;
  }

  ngOnDestroy(): void {
  }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  load(x): void {
    this.tdElements.forEach((td: ElementRef) => console.log(td.nativeElement));
  }

  expendCollapse(): void {}

  open(): void {
    // const dialogRef = this.dialog.open(OpenComponentComponent);
    // dialogRef.afterClosed().subscribe((result) => {});
  }

  onSelect(event): void {}

  getComputedData(data, settings): any {
    if (Object.keys(data).length > 0) {
      // this.machinesState = data.currentStatus;

      settings.tiles.forEach((row) => {
        if (row.parameterPriorities) {
          for (const parameterPriority of row.parameterPriorities) {
            if (data[parameterPriority]) {
              data[row.parameterName] = data[
                parameterPriority
              ];
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
                Object.keys(settings.tableHeader.columns).forEach(
                  (machine) => {
                    if (!result[machine]) {
                      result[machine] = data[parameter][machine];
                    } else if (
                      data[parameter][machine] > result[machine]
                    ) {
                      result[machine] = data[parameter][machine];
                    }
                  }
                );
              }
              if (row.conditionalParameter.condition === 'smallest') {
                Object.keys(settings.tableHeader.columns).forEach(
                  (machine) => {
                    if (!result[machine]) {
                      result[machine] = data[parameter][machine];
                    } else if (
                      data[parameter][machine] < result[machine]
                    ) {
                      result[machine] = data[parameter][machine];
                    }
                  }
                );
              }
            });
            data[row.parameterName] = result;
          }
        }

        if (row.evaluate && row.evaluate.operation && row.evaluate.operands) {
          row.evaluate.operands.forEach((operand) => {
            Object.keys(settings.tableHeader.columns).forEach(
              (machine) => {
                if (data[operand][machine]) {
                  if (!data[row.parameterName]) {
                    data[row.parameterName] = {};
                  }
                  if (!data[row.parameterName][machine]) {
                    data[row.parameterName][machine] = 0;
                  }
                  if (row.evaluate.operation === 'sum') {
                    data[row.parameterName][machine] += Number(
                      data[operand][machine]
                    );
                  } else if (row.evaluate.operation === 'product') {
                    data[row.parameterName][machine] *= Number(
                      data[operand][machine]
                    );
                  } else if (row.evaluate.operation === 'addition') {
                    data[row.parameterName][machine] += Number(
                      data[operand][machine]
                    );
                  } else if (row.evaluate.operation === 'subtraction') {
                    data[row.parameterName][machine] -= Number(
                      data[operand][machine]
                    );
                  }
                }
              }
            );
            // data[operand]
          });
        } else if (row.evaluate && row.evaluate.formula) {
          const operands = row.evaluate.formula.match(/\w+/g);
          const operators = row.evaluate.formula.match(/[.*+\-?^${}()|[\]\\]/g);
          const exp: any = {};
          operands.forEach((operand) => {
            Object.keys(settings.tableHeader.columns).forEach(
              (machine) => {
                let operandValue;
                const operandKey = operand.trim();
                if (
                  !exp[machine] &&
                  data[operandKey] &&
                  data[operandKey][machine]
                ) {
                  exp[machine] = row.evaluate.formula;
                }
                if (machine !== 'displayName' && exp[machine]) {
                  operandValue =
                    Number(operandKey) == operandKey
                      ? Number(operandKey)
                      : data[operandKey] &&
                        data[operandKey][machine]
                      ? Number(data[operandKey][machine])
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
          data[row.parameterName] = exp;
          // this.expLoaded[row.parameterName] = true;

          // operators.forEach(operator => {
          //   if(['*', '/', '%'].includes(operator)) {
          //     Object.keys(settings.tableHeader.columns).forEach(machine => {
          //       let operand1, operand2;
          //       const operand1Key = operands[operators.indexOf(operator)].trim();
          //       const operand2Key = operands[operators.indexOf(operator)+1].trim();

          //       if(machine !== 'displayName') {
          //         if (!data[row.parameterName]) {
          //           data[row.parameterName] = {};
          //         }
          //         if (!data[row.parameterName][machine]) {
          //           data[row.parameterName][machine] = 0;
          //         }

          //         operand1 = Number(operand1Key) == operand1Key ? Number(operand1Key) : data[operand1Key] && data[operand1Key][machine] ? Number(data[operand1Key][machine]) : 0;
          //         operand2 = Number(operand2Key) == operand2Key ? Number(operand2Key) : data[operand2Key] && data[operand2Key][machine] ? Number(data[operand2Key][machine]) : 0;

          //         if(operand1 && operand2) {
          //           if(operator === '*') evalu[machine] *= (operand1 * operand2);
          //           if(operator === '/') evalu[machine] *= (operand1 / operand2);
          //           if(operator === '%') evalu[machine] *= (operand1 % operand2);
          //         }
          //         console.log('multiplicationpart', evalu[machine]);
          //       }
          //     });
          //   }
          // });
          // operators.forEach(operator => {
          //   if(['+', '-'].includes(operator)) {
          //     Object.keys(settings.tableHeader.columns).forEach(machine => {
          //       let operand1, operand2;
          //       const operand1Key = operands[operators.indexOf(operator)].trim();
          //       const operand2Key = operands[operators.indexOf(operator)+1].trim();

          //       if(machine !== 'displayName') {
          //         if (!data[row.parameterName]) {
          //           data[row.parameterName] = {};
          //         }
          //         if (!data[row.parameterName][machine]) {
          //           data[row.parameterName][machine] = 0;
          //         }

          //         operand1 = Number(operand1Key) == operand1Key ? Number(operand1Key) : data[operand1Key] && data[operand1Key][machine] ? Number(data[operand1Key][machine]) : 0;
          //         operand2 = Number(operand2Key) == operand2Key ? Number(operand2Key) : data[operand2Key] && data[operand2Key][machine] ? Number(data[operand2Key][machine]) : 0;

          //         console.log(operand1, operand2, operand1Key, operand2Key);
          //         console.log('additionpart', evalu);
          //         if(operand1 && operand2) {
          //           if(operator === '+') evalu[machine] += (operand1 + operand2);
          //           if(operator === '-') evalu[machine] += (operand1 - operand2);
          //         }
          //         console.log('additionpart', evalu[machine]);
          //       }
          //     });
          //   }
          // });
          // data[row.parameterName] = evalu;
        }
      });
      // this.configTableRows = settings.tableRows;
      // this.displayedColumns = Object.keys(
      //   this.displayedColumnsTitles
      // );
      // this.displayedColumns = Object.keys(data.displayName);
      let displayedColumns = Object.keys(settings.tableHeader.columns).filter(
        (dc) => !settings.hiddenColumns.includes(dc)
      );

      displayedColumns = Object.keys(settings.tableHeader.columns).filter((dc) => displayedColumns.includes(dc));
      // settings.hiddenColumns.forEach(hc => {
      //   if(this.machinesState[hc]) {
      //     delete this.machinesState[hc];
      //   }
      // });

      // data = data.filter(d => (d.parameterName !== 'Parameter' && d.parameterName !== 'currentStatus'));
      return {
        computedData: data
      };
    }
  }

  increasethresholdCounter(parameterName, column): void {
    console.log(parameterName);
    if (!this.thresholdMatchCounter[parameterName]) {
      this.thresholdMatchCounter[parameterName] = {};
      this.thresholdMatchCounter[parameterName][column] = 1;
    } else if (this.thresholdMatchCounter[parameterName] && !this.thresholdMatchCounter[parameterName][column]){
      this.thresholdMatchCounter[parameterName][column] = 1;
    } else {
      this.thresholdMatchCounter[parameterName][column]++;
    }
  }
}
