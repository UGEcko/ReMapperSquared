import { Wall, Vec3, ColorType,Vec2, worldToWall } from "https://deno.land/x/remapper@3.1.2/src/mod.ts"

export class wallGrid {
    // Individual wall properties
    time: number
    duration: number
    color: ColorType = [1,1,1,1]
    secondaryColor?: ColorType;
    wallScale: Vec2 = [1,1] // X, Z | Height is calculated by the bounds
    interactable: boolean = false
    track?: string;

    // Effect properties
    grid: Vec2 = [5,5] // X,Y
    position: Vec3 = [0,0,0] // "Offset"
    bounds: Vec2 = [25,25] // X, Y


    constructor(time: number, duration: number) {
        this.time = time;
        this.duration = duration;
    }

    private addVector(vec1: Vec3, vec2: Vec3): Vec3 { // For offsetting position
        return [vec1[0] + vec2[0], vec1[1] + vec2[1], vec1[2] + vec2[2]]
    }

    push(fake: boolean = true) {
        const xInc = this.bounds[0] / this.grid[0];
        const yInc = this.bounds[1] / this.grid[1];

        const wallX = (-(this.bounds[0]/2))
            for (let x = 0; x < this.grid[0]+1; x++) {
                const wall = new Wall(this.time, this.duration)
                const info = worldToWall([wallX+(xInc*x),this.bounds[1]/2,0],[0,0,0],[this.wallScale[0],this.bounds[1],this.wallScale[1]],false)
                wall.position = [0,0]
                wall.animate.definitePosition = this.addVector(info.pos, this.position)
                wall.scale = info.scale
                wall.color = this.color
                wall.interactable = this.interactable
                this.track ? wall.track.value = this.track : undefined;
                wall.push(fake)
            }  
            for (let y = 0; y < this.grid[1]+1; y++) {
                const wall = new Wall(this.time, this.duration)
                const info = worldToWall([0,0+(yInc*y),0],[0,0,0],[this.bounds[0],this.wallScale[0],this.wallScale[1]], false)
                wall.position = [0,0]
                wall.animate.definitePosition = this.addVector(info.pos, this.position)
                wall.scale = info.scale
                wall.color = this.color
                wall.interactable = this.interactable
                this.secondaryColor ? wall.color = this.secondaryColor : wall.color = this.color;
                this.track ? wall.track.value = this.track : undefined;
                wall.push(fake)
            }
        }
}
