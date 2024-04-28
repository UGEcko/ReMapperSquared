import { Vec3, ColorType,Vec2, Geometry } from "https://deno.land/x/remapper@3.1.2/src/mod.ts"

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
