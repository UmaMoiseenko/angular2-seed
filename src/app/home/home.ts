import {Component, Input, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'home',
  styleUrls: ['./home.css'],
  templateUrl: './home.html'
})
export class Home {
	private context: CanvasRenderingContext2D;
	private isMouseDown: boolean = false;
	private isWithinXY: boolean = false;
	private isDragging: boolean = false;
	private left: boolean;
    private right: boolean;
    private top: boolean;
    private bottom: boolean;
	public cursor: string;
	
	@Input() offset: Object;

    // get the element with the #chessCanvas on it
    @ViewChild("jsCropper") chessCanvas: ElementRef; 

    constructor(){
		this.offset = { x: 20, y: 20, width: 50, height: 50 };
    }

    ngAfterViewInit() { // wait for the view to init before using the element
		this.context = this.chessCanvas.nativeElement.getContext("2d");
		this.context.fillStyle = 'rgba(255, 255, 255, .5)';
		this.context.fillRect(0, 0, 300, 300);
		this.context.clearRect(this.offset['x'], this.offset['y'], this.offset['width'], this.offset['height']);
		this.context.strokeRect(this.offset['x'] - 2, this.offset['y'], this.offset['width'] + 1, this.offset['height']);
    }

    redrawRectangle() {
		this.context.clearRect(0, 0, 300, 300);
		this.context.fillRect(0, 0, 300, 300);

    	this.context.clearRect(this.offset['x'], this.offset['y'], this.offset['width'], this.offset['height']);
		this.context.strokeRect(this.offset['x'] -2, this.offset['y'], this.offset['width'] + 1, this.offset['height']);
    }

    isWithinTarget(x, y) {
    	let withinX = ( (x <= this.offset['x'] + this.offset['width']) && x >= this.offset['x']);
    	let withinY = ( (y <= this.offset['y'] + this.offset['height']) && y >= this.offset['y']);

    	return withinX && withinY;
    }

    isNearBorder() {
    	return this.left || this.right || this.top || this.bottom;
    }

    setActiveBorders(x, y) {
    	let outdent = 5;

		this.left = ( this.offset['x'] - outdent < x && x < this.offset['x'] + outdent);
		this.right = ( this.offset['x'] + this.offset['width'] - outdent < x && x < this.offset['x'] + this.offset['width'] + outdent);
		this.top = ( this.offset['y'] - outdent < y && y < this.offset['y'] + outdent );
		this.bottom = ( this.offset['y'] + this.offset['height'] - outdent < y && y < this.offset['y'] + this.offset['height'] + outdent);
    }

    updateOffset(x, y) {
    	if (this.top) { 
    		// console.log('update top');
    		this.offset['height'] += this.offset['y'] - y;
    		this.offset['y'] = y; 
    	
    	}  
    	if (this.bottom) { 
    		// console.log('update bottom');
    		this.offset['height'] = y - this.offset['y']; 
    	}
    	
    	if (this.left) { 
    		// console.log('update left');
    		this.offset['width'] += this.offset['x'] - x;
    		this.offset['x'] = x; 
    	}
    	
    	if (this.right) { 
    		// console.log('update right');
    		this.offset['width'] = x - this.offset['x']; 
    	}
    }

    onMouseDown(event) {
    	let mouseX = event.offsetX;
		let mouseY = event.offsetY;
    	this.isMouseDown = true;
    }

    onMouseMove(event) {
		let mouseX = event.offsetX;
		let mouseY = event.offsetY;

    	if (!this.isMouseDown) { 
    		this.isWithinXY = this.isWithinTarget(mouseX, mouseY);
			this.setActiveBorders(mouseX, mouseY);
    		return;
    	}

    	if (this.isWithinXY || this.isMouseDown && this.isNearBorder()) {
    		this.isDragging = true;
    		this.updateOffset(mouseX, mouseY);
    		this.redrawRectangle();
    	} 

    }

    reset() {
    	this.isMouseDown = false;
    	this.isDragging = false;
    }

    onMouseUp() {
    	this.reset();

    }

    onMouseOut() {
    	this.cursor = '';
    	this.reset();
    	this.top = false;
    	this.right = false;
    	this.bottom = false;
    	this.left = false;
    }

}
