import { Vec3, ColorType,Vec2, Geometry } from "https://deno.land/x/remapper@3.1.2/src/mod.ts"

export class geoGrid {
    time: number
    duration: number
    material: GeometryMaterial
    secondaryColor?: ColorType;
    scale: Vec2 = [1,1] // X/Y, Z | Height is calculated by the bounds
    lightID?: number;
    lightType? : number;
    track?: string;
    track2?:string;

    // Effect properties
    grid: Vec2 = [5,5] // X,Y
    position: Vec3 = [0,0,0] // "Offset"
    bounds: Vec2 = [25,25] // X, Y
    string: any;


    constructor(time: number, duration: number, material: GeometryMaterial) {
        this.time = time;
        this.duration = duration;
        this.material = material
    }



    private addVector(vec1: Vec3, vec2: Vec3): Vec3 { // For offsetting position
        return [vec1[0] + vec2[0], vec1[1] + vec2[1], vec1[2] + vec2[2]]
    }

    push() {
        const xInc = this.bounds[0] / this.grid[0];
        const yInc = this.bounds[1] / this.grid[1];

        
        for(let x = 0; x < this.grid[0]+1; x++) {
            const geo = new Geometry("Cube",this.material)
            const geoCenter = this.addVector([0,0+(yInc*x),0],[0,-this.bounds[1]/2,0])
            geo.position = this.addVector(this.position,geoCenter)
            geo.scale = [this.bounds[0],this.scale[0],this.scale[1]]
            this.track ? geo.track.value = this.track : undefined
            this.lightID ? geo.lightID = this.lightID : undefined
            this.lightType ? geo.lightType = this.lightType : undefined
            geo.push()
        }
        for(let y = 0; y < this.grid[1]+1; y++) {
            const geo = new Geometry("Cube",this.material)
            const geoCenter = this.addVector([-(this.bounds[0]/2)+(xInc*y),(this.bounds[1]/2),0],[0,-this.bounds[1]/2,0])
            geo.position = this.addVector(this.position,geoCenter)
            geo.scale = [this.scale[0],this.bounds[1],this.scale[1]]
            if(this.track2) {
                geo.track.value = this.track2
            } else if(this.track) {
                geo.track.value = this.track;
            }
            this.lightID ? geo.lightID = this.lightID : undefined
            this.lightType ? geo.lightType = this.lightType : undefined
            geo.push()
        }
    }
}

export const ROT_X_360: KeyframesVec3 = [ // Starts on X
    [0,0,0,0],[90,0,0,0.25],[180,0,0,0.5],[270,0,0,0.75],[360,0,0,1]
]

export const ROT_Y_360: KeyframesVec3 = [ // Starts on X
    [0,0,0,0],[0,90,0,0.25],[0,180,0,0.5],[0,270,0,0.75],[0,360,0,1]
]

export const ROT_Z_360: KeyframesVec3 = [ // Starts on X
    [0,0,0,0],[0,0,90,0.25],[0,0,180,0.5],[0,0,270,0.75],[0,0,360,1]
]

type materialAlt = [string, RawGeometryMaterial][] // Name, Data
export function appendMaterials(materials: materialAlt){ // Ex: materials = [["red",{color:[1,0,0]}],["blue",{color:[0,1,0]}]] 
materials.forEach(mat => {
    map.geoMaterials[mat[0]] = mat[1]
})
}
