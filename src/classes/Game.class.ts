import readline, { Interface } from 'readline';
import {table} from 'table';

import Robot, { IRobot } from './Robot.class';
import Table, { ITable } from './Table.class';

import {HELP_DATA} from '../constants';
import {Command, Placement} from '../types';

interface IGame {
  start(): void;
}

class Game implements IGame {
  private _RL: Interface;
  private _Robot: IRobot | null = null;
  private _Table: ITable | null = null;
  private _Error: string | null = null;
  private _Command: string | null;
  private _Question: string | undefined;
  private _Handler: ((s: string) => void) | undefined;
  private _NewPlacement: Placement | undefined;
  private _Help: boolean = false;
  private _Report: boolean = false;

  constructor() {
    this._Command = Command.INIT;

    this._RL = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this._RL.on('close', this._onExit);

    this._Table = new Table(5, 5);

    this._onListen = this._onListen.bind(this);
    this._handleCommand = this._handleCommand.bind(this);
    this._displayError = this._displayError.bind(this);
    this._createRobot = this._createRobot.bind(this);
    this._handleInput = this._handleInput.bind(this);
    this._requestPlacement = this._requestPlacement.bind(this);
    this._handlePlacementXInput = this._handlePlacementXInput.bind(this);
    this._handlePlacementYInput = this._handlePlacementYInput.bind(this);
    this._handlePlacementDirectionInput = this._handlePlacementDirectionInput.bind(this);
  }

  public start(): void {
    this._onListen();
  }

  private _onExit(): void {
    console.clear();
    console.log('Thank you for playing Toy Robot\nBye Bye 👋');
    process.exit(0);
  }

  private _onListen(): void {
    this._handleCommand();
    this._displayOutput()
  }

  private _handleCommand(): void {
    if (this._Command === null) this._requestCommand();
    else if (this._Command === Command.INIT) this._reset();
    else if(this._Command === Command.UP) this._Robot?.switchDirection(Command.UP);
    else if(this._Command === Command.DOWN) this._Robot?.switchDirection(Command.DOWN);
    else if(this._Command === Command.LEFT) this._Robot?.switchDirection(Command.LEFT);
    else if(this._Command === Command.RIGHT) this._Robot?.switchDirection(Command.RIGHT);
    else if (this._Command === Command.MOVE) this._moveRobot();
    else if (this._Command === Command.PLACE) this._requestPlacement();
    else if (this._Command === Command.HELP) this._Help = !this._Help;
    else if (this._Command === Command.REPORT) this._Report = !this._Report;
    else if (this._Command === Command.EXIT) this._RL.close();
    else this._Error = `Command '${this._Command}' is not supported!`;
  }

  private _reset(): void {
    this._Robot = null;
    this._NewPlacement = undefined;
    this._Question = '⚜️ Welcome to Toy Robot ⚜️\n';
    this._Question += 'Please Name your robot: ';
    this._Handler = this._createRobot;
  }

  private _createRobot(name: string): void {
    if (name.length === 0) this._Error = 'Invalid Name.';
    else {
      this._Robot = new Robot(name);
      this._Command = null;
    }
    this._onListen();
  }

  private _moveRobot(): void {
    if (this._Robot) {
      this._Robot?.move();
    } else this._oopsError();
  }
  
  private _requestCommand(): void {
    this._Question = 'ℹ️  Type HELP for help.\n';
    this._Question += 'Waiting for your command: ';
    this._Handler = this._handleInput;
  }

  private _handleInput(input: string): void {
    this._Command = input;
    this._onListen();
  }

  private _requestPlacement(): void {
    if (!this._NewPlacement) this._NewPlacement = { x: -1, y: -1, direction: 'NORTH' };

    if (this._NewPlacement.x === -1) {
      this._Question = 'Placement - X is? ';
      this._Handler = this._handlePlacementXInput;
    } else if (this._NewPlacement.y === -1) {
      this._Question = 'Placement - Y is? ';
      this._Handler = this._handlePlacementYInput;
    } else {
      this._Question = 'Placement - Direction is? ';
      this._Handler = this._handlePlacementDirectionInput;
    }
  }

  private _handlePlacementXInput(val: string) {
    if (this._Table && this._NewPlacement) {
      if (isNaN(Number(val))) this._Error = `Invalid X input!`;
      else if (Number(val) > this._Table.rows() - 1) this._Error = `X must be less than ${this._Table.rows() - 1}!`;
      else if (Number(val) < 0) this._Error = 'X must be greater than 0!';
      else this._NewPlacement.x = Number(val);
      this._onListen();
    } else this._oopsError();
  }

  private _handlePlacementYInput(val: string) {
    if (this._Table && this._NewPlacement) {
      if (isNaN(Number(val))) this._Error = `Invalid Y input!`;
      else if (Number(val) > this._Table.cols() - 1) this._Error = `Y must be less than ${this._Table.cols() - 1}!`;
      else if (Number(val) < 0) this._Error = 'Y must be greater than 0!';
      else this._NewPlacement.y = Number(val);
      this._onListen();
    } else this._oopsError();
  }

  private _handlePlacementDirectionInput(val: string) {
    if (this._Robot && this._NewPlacement) {
      if (val === 'NORTH' || val === 'SOUTH' || val === 'EAST' || val === 'WEST') {
        this._NewPlacement.direction = val;
        this._Robot.location = this._NewPlacement;
        this._NewPlacement = undefined;
        this._Command = null;
      } else this._Error = `Valid directions are NORTH, SOUTH, EAST & WEST!`;
      this._onListen();
    } else this._oopsError();
  }

  private _displayOutput(): void {
    console.clear();

    if (this._Table && this._Robot) {
      this._Robot.displayInfo();
      this._Table.drawTable(this._Robot.location);
    }

    if (this._Help) this._displayHelp();

    if (this._Report) this._displayRobotLocation();

    this._displayError();

    if (!this._Question || typeof this._Handler !== 'function') this._oopsError();
    else this._RL.question(this._Question, this._Handler);
  }

  private _displayError(): void {
    if (this._Error) {
      console.log('⛔️' + this._Error);
      this._Error = null;
    }
  }

  private _displayHelp(): void {
    console.log(table(HELP_DATA, {
      // singleLine: true,
      drawHorizontalLine: (index, size) => index === 1 || index === size || index === 0 
    }));
  }

  private _displayRobotLocation(): void {
    if (this._Robot) {
      const { x, y, direction } = this._Robot.location;
      console.log(`📍 ${this._Robot.name}'s location is ${x},${y} facing ${direction}`);
    }
  }

  private _oopsError(): void {
    console.clear();
    console.log('Oops, a big 🐛\n\nPlease reset the app 😥')
  }
}

export default Game;