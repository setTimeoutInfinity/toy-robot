import { table, TableColumns } from 'table';
import { Placement, Direction } from '../types';

export interface ITable {
  drawTable(position: Placement): void;
  rows(): number;
  cols(): number;
}

class Table implements ITable {
  private _rows: number;
  private _columns: number;

  constructor(rows: number, columns: number) {
    this._rows = rows;
    this._columns = columns;
  }

  rows() {
    return this._rows;
  }

  cols() {
    return this._columns;
  }

  drawTable(position: Placement): void {
    const data = [];
    const columnsConfig: { [index: number]: TableColumns } = {};

    if (position.x > this._rows - 1) position.x = (this._rows - 1);
    else if (position.x < 0) position.x = 0;

    if (position.y > this._columns - 1) position.y = this._columns - 1;
    else if (position.y < 0) position.y = 0;

    for (let i = (this._rows - 1); i >= 0; i--) {
      let row = [];
      for (let j = 0; j < this._columns; j++) {
        columnsConfig[j] = { alignment: 'center' };
        if (i === position.y && j === position.x) row.push(this._drawRobot(position.direction));
        else row.push(' ');
      }
      data.push(row);
    }
    console.log(table(data, ));
  }

  private _drawRobot(direction: Direction) {
    switch (direction) {
      case 'NORTH': return '▲';
      case 'SOUTH': return '▼';
      case 'EAST': return '►';
      case 'WEST': return '◄';
      default: return '◆';
    }
  }
}

export default Table;