import { DurationToTime } from './../../../_shared/pipes/duration2time/duration2time.pipe';

import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Input, OnChanges } from '@angular/core';
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
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
  providers: [
    DurationToTime,
  ]
})
export class DataGridComponent implements OnInit, AfterContentChecked, OnChanges, OnDestroy {
  // options

  @Input() settings;
  @Input() data;

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
    this.data = this.getComputedData(this.data, this.settings);
  }

  ngOnChanges(): void {
    this.data = this.getComputedData(this.data, this.settings);
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

      Object.keys(settings.tiles).forEach((tile) => {
        if(data[settings.tiles[tile].title.value]) {
          data[tile] = data[settings.tiles[tile].title.value];
        }

        if(data[settings.tiles[tile].data.value] || data[settings.tiles[tile].data.value] == 0) {
          data[tile] = data[settings.tiles[tile].data.value];
        }

        if (settings.tiles[tile].parameterPriorities) {
          for (const parameterPriority of settings.tiles[tile].parameterPriorities) {
            if (data[parameterPriority]) {
              data[tile] = data[parameterPriority];
              break;
            }
          }
        }

        if (
          settings.tiles[tile].conditionalParameter &&
          settings.tiles[tile].conditionalParameter.condition &&
          settings.tiles[tile].conditionalParameter.parameters
        ) {
          if (settings.tiles[tile].conditionalParameter) {
            let result;
            settings.tiles[tile].conditionalParameter.parameters.forEach((parameter) => {
              if (settings.tiles[tile].conditionalParameter.condition === 'greatest') {
                if (!result) {
                  result = data[parameter];
                } else if (
                  data[parameter] > result
                ) {
                  result = data[parameter];
                }
              }
              if (settings.tiles[tile].conditionalParameter.condition === 'smallest') {
                if (!result) {
                  result = data[parameter];
                } else if (
                  data[parameter] < result
                ) {
                  result = data[parameter];
                }
              }
            });
            data[tile] = result;
          }
        }


        if (settings.tiles[tile].evaluate && settings.tiles[tile].evaluate.operation && settings.tiles[tile].evaluate.operands) {
          settings.tiles[tile].evaluate.operands.forEach((operand) => {
            if (data[operand]) {
              if (!data[tile]) {
                data[tile] = {};
              }
              if (!data[tile]) {
                data[tile] = 0;
              }
              if (settings.tiles[tile].evaluate.operation === 'sum') {
                data[tile] += Number(
                  data[operand]
                );
              } else if (settings.tiles[tile].evaluate.operation === 'product') {
                data[tile] *= Number(
                  data[operand]
                );
              } else if (settings.tiles[tile].evaluate.operation === 'addition') {
                data[tile] += Number(
                  data[operand]
                );
              } else if (settings.tiles[tile].evaluate.operation === 'subtraction') {
                data[tile] -= Number(
                  data[operand]
                );
              }
            }
            // data[operand]
          });
        } else if (settings.tiles[tile].evaluate && settings.tiles[tile].evaluate.formula) {
          const operands = settings.tiles[tile].evaluate.formula.match(/\w+/g);
          const operators = settings.tiles[tile].evaluate.formula.match(/[.*+\-?^${}()|[\]\\]/g);
          let exp;
          operands.forEach((operand) => {
            let operandValue;
            const operandKey = operand.trim();
            if (
              !exp &&
              data[operandKey] &&
              data[operandKey]
            ) {
              exp = settings.tiles[tile].evaluate.formula;
            }
            if (exp) {
              operandValue =
                Number(operandKey) == operandKey
                  ? Number(operandKey)
                  : data[operandKey] &&
                    data[operandKey]
                  ? Number(data[operandKey])
                  : '0';
              if (operandValue == '==') {
                console.log(
                  'tile',
                  operands,
                  tile,
                  operandKey
                );
              }
              exp = exp.replace(
                new RegExp(operandKey, 'gi'),
                operandValue
              );
            }
          });
          data[tile] = exp;
          this.expLoaded[tile] = true;
        }
      });

      return data;
    }
  }
}

