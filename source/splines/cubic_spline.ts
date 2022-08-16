import { Coordinates } from "../objects/coordinates";
import { Matrix } from "../objects/matrix";

export class CubicSpline {

    private coordinates: Coordinates[];
    private cache_m: number[];

    constructor(coordinates: Coordinates[]) {
        this.coordinates = coordinates;
        this.cache_m = [];
    }

    public get_point(x_coordinate: number) {
        if (this.cache_m.length <= 0) {
            this.cache_m = this.get_m();
        }
        const coordinate_bound = this.get_bound(x_coordinate);
        const upper_coordinates = this.coordinates[coordinate_bound.upper];
        const lower_coordinates = this.coordinates[coordinate_bound.lower];
        const h_notation = upper_coordinates.get_x() - lower_coordinates.get_x();
        const first_notation = Math.pow(upper_coordinates.get_x() - x_coordinate, 3) / (6 * h_notation) * this.cache_m[coordinate_bound.lower];
        const second_notation = Math.pow(x_coordinate - lower_coordinates.get_x(), 3) / (6 * h_notation) * this.cache_m[coordinate_bound.upper];
        const third_notation = (upper_coordinates.get_x() - x_coordinate) / h_notation * (lower_coordinates.get_y() - (Math.pow(h_notation, 2) / 6 * this.cache_m[coordinate_bound.lower]));
        const fourth_notation = (x_coordinate - lower_coordinates.get_x()) / h_notation * (upper_coordinates.get_y() - (Math.pow(h_notation, 2) / 6 * this.cache_m[coordinate_bound.upper]));
        return first_notation + second_notation + third_notation + fourth_notation;
    }

    private get_bound(x_coordinate: number): {upper: number, lower: number} {
        for (let coordinate_index = 0; coordinate_index < (this.coordinates.length - 1); coordinate_index++) {
            const lower_bound = this.coordinates[coordinate_index];
            const upper_bound = this.coordinates[coordinate_index + 1];
            if (lower_bound.get_x() > x_coordinate || upper_bound.get_x() < x_coordinate) {
                continue;
            }
            return {upper: coordinate_index + 1, lower: coordinate_index};
        }
        throw Error("Access x coordinate out of bounds");
    }

    private get_m() {
        const m_equations = this.get_m_equations();
        const m_matrix = new Matrix(m_equations);
        const m_values = [];
        for (let m_index = 0; m_index < m_equations.length; m_index++) {
            m_values.push(m_matrix.cramer_rule(m_index));
        }
        return [0, ...m_values, 0];
    }

    private get_m_equations() {
        let m_matrix: number[][] = [];
        const spline_amount = this.coordinates.length - 2;
        for (let spline_index = 0; spline_index < spline_amount; spline_index++) {
            const anchor_offset = spline_index;
            const h_notation = this.coordinates[anchor_offset + 1].get_x() - this.coordinates[anchor_offset].get_x();
            const y_sum = this.coordinates[anchor_offset].get_y() - (2 * this.coordinates[anchor_offset + 1].get_y()) + this.coordinates[anchor_offset + 2].get_y();
            const y_notation = (6 / Math.pow(h_notation, 2)) * y_sum;
            const zero_fill = Math.max(spline_amount - spline_index - 2, 0);
            const main_equation = [...Array(spline_index).fill(0), (spline_index <= 0 ? 0 : 1), 4, (spline_index >= this.coordinates.length - 3 ? 0 : 1), ...Array(zero_fill).fill(0)];
            m_matrix.push([...main_equation.slice(1, spline_amount + 1), y_notation]);
        }
        return m_matrix;
    }

}