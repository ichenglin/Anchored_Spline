import { Coordinates } from "./objects/coordinates";
import { CubicSpline } from "./objects/cubic_spline";

const anchors: Coordinates[] = [
    new Coordinates(1, 1),
    new Coordinates(2, 2),
    new Coordinates(3, 5),
    new Coordinates(4, 20),
    new Coordinates(5, 10)
]

const cubic_spline = new CubicSpline(anchors);
//const y_coordinates = [];
for (let x_coordinate = 1; x_coordinate <= 5; x_coordinate+=0.1) {
    //y_coordinates.push(cubic_spline.get_point(x_coordinate));
    console.log("=".repeat(Math.floor(cubic_spline.get_point(x_coordinate) * 5)));
}