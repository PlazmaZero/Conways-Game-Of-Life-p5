var grid;
var isPaused = false;
var fps = 30;

var pauseButton, clearButton, randomizeButton;
var addFrameButton, subtractFrameButton, add5FrameButton, subtract5FrameButton;

function setup () {
  frameRate(fps);
  createCanvas(800,400);
  
  grid = new Grid(10);
  grid.randomize();
  
  pauseButton = new Button("Pause", 400, 50, 120, 40);
  clearButton = new Button("Clear", 560, 50, 120, 40);
  randomizeButton = new Button("Randomize", 400, 130, 120,40);
  
  add5FrameButton = new SpecialButton("+5", 540, 180, 25, 20, 2, 15);
  addFrameButton = new SpecialButton("+1", 570, 180, 25, 20, 2, 15);
  subtractFrameButton = new SpecialButton("-1", 600, 180, 25, 20, 2, 15);
  subtract5FrameButton = new SpecialButton("-5", 630, 180, 25, 20, 2, 15);
}

function mousePressed() {
  if(pauseButton.checkForMouse())
    isPaused = !isPaused;
  
  if(clearButton.checkForMouse())
    grid.clear();
    
  if(randomizeButton.checkForMouse())
    grid.randomize();
    
  if(addFrameButton.checkForMouse()){
    if(fps < 60)
      fps++;
    frameRate(fps);
  }
  
  if(subtractFrameButton.checkForMouse()){
    if(fps > 1)
      fps--;
    frameRate(fps);
  }
    
  if(add5FrameButton.checkForMouse()){
    if(fps <= 55)
      fps += 5;
    else
      fps = 60;
    frameRate(fps);
  }
    
  if(subtract5FrameButton.checkForMouse()){
    if(fps >= 6)
      fps -= 5;
    else
      fps = 1;
    frameRate(fps);
  }
  
  if(isPaused){
    var cellColumn = floor(mouseX/grid.cellSize);
    var cellRow = floor(mouseY/grid.cellSize);
    if(grid.isValidPosition(cellColumn,cellRow)){
      grid.cells[cellColumn][cellRow].isAlive = !grid.cells[cellColumn][cellRow].isAlive;
    }
    
  }
}

function draw () {
  background(250);
  
  if(!isPaused){
    grid.updateNeighborCounts();
    grid.updatePopulation();
  }
  
  grid.draw();
  fill(238,130,238);
  textSize(20);
  text("Live Count: " + grid.liveCellCount , 400, 0, 400, 20);
  text("# of Generations: " + grid.genNumber , 400, 20, 400, 20);
  text("Pause to Paint Cells", 400, 100, 400, 20);
  text("Frame Rate " + fps, 400, 180, 400, 20);
  
  pauseButton.draw();
  clearButton.draw();
  randomizeButton.draw();
  
  add5FrameButton.draw();
  addFrameButton.draw();
  subtractFrameButton.draw();
  subtract5FrameButton.draw();
}

class Button {
  constructor(buttonText, xPos, yPos, width, height){
    this.buttonText = buttonText;
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.border = 4;
  }

  checkForMouse(){
    return mouseX > this.xPos && mouseX < this.xPos + this.width && mouseY > this.yPos && mouseY < this.yPos + this.height;
  }
  
  draw(){
    if(this.checkForMouse())
      fill(255, 102, 255);
    else
      fill(255,153,255);
    rect(this.xPos, this.yPos, this.width, this.height);
    fill(255, 204, 255);
    rect(this.xPos + this.border, this.yPos + this.border, this.width - 2*this.border, this.height - 2*this.border);
    
    if(this.checkForMouse())
      fill(255, 102, 255);
    else
      fill(255,153,255);
    textSize(20);
    text(this.buttonText, this.xPos + this.border, this.yPos + this.border, this.width - 2*this.border, this.height - 2*this.border);
  }
}

class SpecialButton extends Button{
  constructor(buttonText, xPos, yPos, width, height, border, textSize){
    super(buttonText, xPos, yPos, width, height);
    this.border = border;
    this.textSize = textSize;
  }
  
  draw(){
    if(this.checkForMouse())
      fill(255, 102, 255);
    else
      fill(255,153,255);
    rect(this.xPos, this.yPos, this.width, this.height);
    fill(255, 204, 255);
    rect(this.xPos + this.border, this.yPos + this.border, this.width - 2*this.border, this.height - 2*this.border);
    
    if(this.checkForMouse())
      fill(255, 102, 255);
    else
      fill(255,153,255);
    textSize(this.textSize);
    text(this.buttonText, this.xPos + this.border, this.yPos + this.border, this.width - 2*this.border, this.height - 2*this.border);
  }
}

class Grid {
  constructor (cellSize) {
    // update the contructor to take cellSize as a parameter
    this.cellSize  = cellSize;
    // use cellSize to calculate and assign values for numberOfColumns and numberOfRows
    this.numberOfColumns = 400/cellSize;
    this.numberOfRows    = 400/cellSize;
  
    //Creates a new array called cells
    this.cells = new Array(this.numberOfColumns);
    
    //Iterates through the cells array to assign each index another array (making the 2D array)
    for (var i = 0; i < this.cells.length; i++){
      this.cells[i] = new Array(this.numberOfRows);
    }
    
    for(var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row ++) {
       this.cells[column][row]= new Cell(column, row, this.cellSize);
      }
    }
    
    this.liveCellCount = 0;
    this.genNumber = 0;
  }
  
  isValidPosition (column, row) {
    if (column >= 0 && column < this.numberOfColumns && row >= 0 && row < this.numberOfRows) 
      return true;
      return false;
  }
 
  updateNeighborCounts() {
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for(var row = 0; row < this.numberOfRows; row ++) {

        this.cells[column][row].liveNeighborCount = 0;

        var cellNeighbors = this.getNeighbors(this.cells[column][row]);

        for (var i = 0; i < cellNeighbors.length; i++) {

          if (cellNeighbors[i].isAlive) {
            this.cells[column][row].liveNeighborCount ++;
          }

        }

        //print(this.cells[column][row].column + " " + this.cells[column][row].row + " " + this.cells[column][row].isAlive + " " + this.cells[column][row].liveNeighborCount);
      }
    }
  }
  
  getNeighbors(currentCell) {
    var neighbors = [];
    for (var xOffset = -1; xOffset <= 1; xOffset++) {
      for (var yOffset = -1; yOffset <= 1; yOffset++) {

        var neighborColumn = currentCell.column + xOffset;
        var neighborRow = currentCell.row + yOffset;

        if (this.isValidPosition(neighborColumn, neighborRow) && !(currentCell.column == neighborColumn && currentCell.row == neighborRow)) {
          neighbors.push(this.cells[neighborColumn][neighborRow]);
        }
        
      }
    }
  return neighbors;
  }
  
  updatePopulation() {
    this.genNumber++;
    for(var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row ++) {
        this.cells[column][row].liveOrDie();
        //print(this.cells[column][row].column + " " + this.cells[column][row].row + " " + this.cells[column][row].liveNeighborCount);
      }
    }
  }
  
  randomize() {
    this.genNumber = 1;
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        this.cells[column][row].setIsAlive(floor(random(2)) == 1);
        //this.cells[column][row].setIsAlive(true);
      }
    }
  }
  
  clear() {
    isPaused = true;
    this.genNumber = 1;
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        this.cells[column][row].setIsAlive(false);
      }
    }
  }
  
  draw() {
    this.liveCellCount = 0;
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        this.liveCellCount += this.cells[column][row].draw();
      }
    }
  } 
}


class Cell {
  constructor (column, row, cellSize) {
    this.column = column;
    this.cellSize = cellSize;
    this.row = row;
    this.isAlive = false;
    this.liveNeighborCount = 0;
  }
  
  setIsAlive(on) {
    this.isAlive = on;
  }  
  
  liveOrDie() {
    switch(this.liveNeighborCount) {
      case 3:
        this.isAlive = true;
        break;
      case 2:
        break;
      default:
      this.isAlive = false;
    }
  }
  
  draw () {
    if (this.isAlive) {
      //fill(200,0,200);
      //fill(random(255), random(255), random(255));
      fill(0 , this.row * this.cellSize / 2 + 55 , this.column * this.cellSize / 2 + 55);
      fill(this.row * this.cellSize / 2 + 55 +(this.column * this.cellSize / 2 + 55) , /*this.row * this.cellSize / 2 + 55*/0 , this.column * this.cellSize / 2 + 55);
    } else {
      fill(240);
    }
    
    noStroke();
    rect(this.column * this.cellSize + 1,
      this.row * this.cellSize + 1,
      this.cellSize - 1,
      this.cellSize - 1);
      
    return this.isAlive ? 1 : 0;
  }
}