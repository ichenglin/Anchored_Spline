export class Coordinates {

    private coordinates: number[];

    constructor(x_coordinates: number, y_coordinates: number) {
        this.coordinates = [x_coordinates, y_coordinates];
    }

    public get_x() {
        return this.coordinates[0];
    }

    public get_y() {
        return this.coordinates[1];
    }

}