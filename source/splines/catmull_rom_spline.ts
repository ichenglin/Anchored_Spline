import { Coordinates } from "../objects/coordinates";

export class CatmullRomSpline {

    private coordinates: Coordinates[];

    private INFLUENCE: number[][] = [
        // ^0 ^1 ^2 ^3
        [0, -0.5, 1, -0.5],
        [1, 0, -2.5, 1.5],
        [0, 0.5, 2, -1.5],
        [0, 0, -0.5, 0.5]
    ];

    constructor(coordinates: Coordinates[]) {
        this.coordinates = coordinates;
    }

    /*
    
    https://blog.csdn.net/i_dovelemon/article/details/47984241
    https://www.mvps.org/directx/articles/catmull/

    Output_point = 
    P0 * (-0.5*t*t*t + t*t – 0.5*t) +
    P1 * (1.5*t*t*t - 2.5*t*t + 1.0) +
    P2 * (-1.5*t*t*t + 2.0*t*t + 0.5*t) +
    P3 * (0.5*t*t*t – 0.5*t*t);

    q(t) = 0.5 * (
        (2 * P1) +
        (-P0 + P2) * t +
        (2*P0 - 5*P1 + 4*P2 - P3) * t2 +
        (-P0 + 3*P1- 3*P2 + P3) * t3
    )

    */

    public get_point(coordinate_offset: number, progress: number): Coordinates {
        const x_coordinate = this.get_coordinate(coordinate_offset, "x", progress);
        const y_coordinate = this.get_coordinate(coordinate_offset, "y", progress);
        return new Coordinates(x_coordinate, y_coordinate);
    }

    private get_coordinate(coordinate_offset: number, coordinate_type: "x" | "y", progress: number) {
        const coordinate_specified: number[] = [];
        for (let coordinate_index = 0; coordinate_index < 4; coordinate_index++) {
            const loop_coordinate = this.coordinates[coordinate_offset + coordinate_index];
            coordinate_specified.push(coordinate_type === "x" ? loop_coordinate.get_x() : loop_coordinate.get_y());
        }
        let coordinate_sum = 0;
        for (let influence_index = 0; influence_index < 4; influence_index++) {
            coordinate_sum += coordinate_specified[influence_index] * this.apply_influence(influence_index, progress);
        }
        return coordinate_sum;
    }

    private apply_influence(influence_offset: number, progress: number): number {
        let degree_sum = 0;
        for (let degree_index = 0; degree_index < 4; degree_index++) {
            degree_sum += this.INFLUENCE[influence_offset][degree_index] * Math.pow(progress, degree_index);
        }
        return degree_sum;
    }

}