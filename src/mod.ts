import { Wall, Vec3, ColorType,Vec2, worldToWall } from "https://deno.land/x/remapper@3.1.2/src/mod.ts"

export class wallGrid {
    // Individual wall properties
    time: number
    duration: number
    color: ColorType = [1,1,1,1]
    secondaryColor?: ColorType;
    wallScale: Vec2 = [1,1] // X, Z | Height is calculated by the bounds
    interactable?: boolean = false
    track?: string;

    // Effect properties
    grid: Vec2 = [5,5] // X,Y
    position: Vec3 = [0,0,0] // "Offset"
    bounds: Vec2 = [25,25] // X, Y


    constructor(time: number, duration: number) {
        this.time = time;
        this.duration = duration;
    }

    private addVector(vec1: Vec3, vec2: Vec3) { // For offsetting position
        return [vec1[0] + vec2[0], vec1[1] + vec2[1], vec1[2] + vec2[2]]
    }

    push(fake: boolean = true) {
        const xInc = this.bounds[0] / this.grid[0];
        const yInc = this.bounds[1] / this.grid[1];


        const wallX = (-(this.bounds[0]/2))
            for (let x = 0; x < this.grid[0]+1; x++) {
                const wall = new Wall(this.time, this.duration)
                const wtw = worldToWall([wallX+(xInc*x),0,0],[0,0,0],[this.wallScale[0],this.bounds[1], this.wallScale[1]],false)
                wall.position = [0,0];
                wall.animation.definitePosition = this.addVector(wtw.pos,this.position)
                wall.scale = wtw.scale;
                this.track ? wall.track.value = this.track : undefined;
                wall.color = this.color
                wall.push(fake)
            }
            for (let y = 0; y < this.grid[1]+1; y++) {
                const wall = new Wall(this.time, this.duration)
                const wtw = worldToWall([wallX,0+(yInc*y),0],[0,0,0],[this.wallScale[0], this.bounds[0], this.wallScale[1]],false)
                wall.position = [0,0];
                wall.animation.definitePosition = this.addVector(wtw.pos,this.position)
                wall.scale = wtw.scale;
                this.track ? wall.track.value = this.track : undefined;
                wall.localRotation = [0,0,-90]
                this.secondaryColor ? wall.color = this.secondaryColor : wall.color = this.color;
                wall.push(fake)
            }
        }
}