import { activeDiffGet, AnimatedObjectInput, ColorType, Geometry, GeometryMaterial, KeyframesVec3, ModelScene, RawGeometryMaterial, Text, Vec2 } from "https://deno.land/x/remapper@3.1.2/src/mod.ts";

export const ROT_X_360: KeyframesVec3 = [
	// Starts on X
	[0, 0, 0, 0],
	[90, 0, 0, 0.25],
	[180, 0, 0, 0.5],
	[270, 0, 0, 0.75],
	[360, 0, 0, 1]
];

export const ROT_Y_360: KeyframesVec3 = [
	// Starts on X
	[0, 0, 0, 0],
	[0, 90, 0, 0.25],
	[0, 180, 0, 0.5],
	[0, 270, 0, 0.75],
	[0, 360, 0, 1]
];

export const ROT_Z_360: KeyframesVec3 = [
	// Starts on X
	[0, 0, 0, 0],
	[0, 0, 90, 0.25],
	[0, 0, 180, 0.5],
	[0, 0, 270, 0.75],
	[0, 0, 360, 1]
];

type materialAlt = [string, RawGeometryMaterial][]; // Name, Data
export function appendMaterials(materials: materialAlt) {
	// Ex: materials = [["red",{color:[1,0,0]}],["blue",{color:[0,1,0]}]]
	materials.forEach(mat => {
		activeDiffGet().geoMaterials[mat[0]] = mat[1];
	});
}
// BookmarksToText (Lyrics)
export interface bookmarkObject {
	b?: number; // Beat
	n?: string; // Name
	c?: ColorType; // Color
}
type returnBookmark = "beat" | "name" | "both";

export function getBookmarks(returnType: returnBookmark): bookmarkObject[] {
	const bookmarks: bookmarkObject[] = activeDiffGet().customData["bookmarks"];
	const returnArray: bookmarkObject[] = [];

	switch (returnType) {
		case "beat":
			bookmarks.forEach(x => {
				if (x.b !== undefined) {
					returnArray.push({ b: x.b });
				}
			});
			break;
		case "name":
			bookmarks.forEach(x => {
				if (x.n !== undefined) {
					returnArray.push({ n: x.n });
				}
			});
			break;
		case "both":
			bookmarks.forEach(x => {
				if (x.n !== undefined) {
					returnArray.push({ b: x.b, n: x.n });
				}
			});
			break;
	}

	return returnArray;
}

/**
 * Read bookmarks from map and automate text corresponding to it
 * @param font | The font you are using for the text
 * @param textObject | Text properties; Ex: ```bookmarkText.textObject = (x=> {x.position = [69,69,69]})```
 * @param keyword | A keyword (in the beginning of the bookmark name) that can be used to filter between other bookmarks. Ex: "LYRIC_"
 * @param material | The material of the text; Works the same way when you are declaring geometry.
 * @param screenTime | The screenTime lyrics will be visible, unless there is another bookmark before this time offset.
 */
export class bookmarkText {
	textObject?: (text: Text) => void;
	material?: GeometryMaterial;
	screenTime?: number = 10;
	private range?: Vec2;

	constructor(public font: string, public keyword?: string) {}
    /**
	* Push the text objects to the difficulty.
	* @param range | The beat range of the bookmarks youd like to add to text in beats. Ex: Bookmarks between beat 0-50: ```.push([0,50]);```
 	*/
	push(range?: Vec2) {
		this.range = range;

		const bookmarks = getBookmarks("both");
		const lyrics: bookmarkObject[] = [];
        if(bookmarks.length > 0) {
            if (this.keyword) {
                bookmarks.forEach(x => {
                    if (x.n?.includes(this.keyword as string)) {
                        x.n.slice(this.keyword?.length);
                        lyrics.push(x) as bookmarkObject;
                    }
                });
            } else {
                bookmarks.forEach(x=> {
                    lyrics.push(x) as bookmarkObject;
                })
            }
        }
		

		const text = new Text(this.font);
		if (this.textObject) {
			this.textObject(text);
		}

		const switches: [AnimatedObjectInput, number][] = [[[], 0]];

		for (let i = 0; i < lyrics.length; i++) {
			const name = lyrics[i].n;
			const beat = lyrics[i].b;
			if (name && beat) {
				if (this.range) if (beat < this.range[0] || beat > this.range[1]) return;
				switches.push([text.toObjects(name), beat]);
                if(this.screenTime) {
                    if (!lyrics[i + 1] || lyrics[i+1].b > beat + this.screenTime) {
                        switches.push([[], beat + this.screenTime]); // Automatically switch to a blank scene if there isnt another textmark, or if the next one isnt called at beat x.
                    }
                }
			}
		}

		const lyricsScene = new ModelScene(new Geometry("Cube", this.material ? this.material : undefined));
		lyricsScene.animate(switches);
	}
}
