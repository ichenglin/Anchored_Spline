export class Matrix {

    private matrix: number[][];

    constructor(matrix: number[][]) {
        this.matrix = matrix;
    }

    public cramer_rule(column: number): number {
        const upper_matrix = this.matrix.map(matrix_row => matrix_row.slice(0, matrix_row.length - 1));
        const lower_matrix = this.matrix.map(matrix_row => matrix_row.slice(0, matrix_row.length - 1));
        for (let row_index = 0; row_index < this.matrix.length; row_index++) {
            upper_matrix[row_index][column] = this.matrix[row_index][this.matrix[0].length - 1];
        }
        const upper_sum = this.cramer_rule_diagonal(upper_matrix, "positive") - this.cramer_rule_diagonal(upper_matrix, "negative");
        const lower_sum = this.cramer_rule_diagonal(lower_matrix, "positive") - this.cramer_rule_diagonal(lower_matrix, "negative");
        return upper_sum / lower_sum;
    }

    private cramer_rule_diagonal(matrix: number[][], direction: "positive" | "negative"): number {
        const matrix_size = matrix.length;
        let matrix_sum = 0;
        for (let column_index = 0; column_index < matrix_size; column_index++) {
            let diagonal_product = 1;
            for (let row_index = 0; row_index < matrix_size; row_index++) {
                const column_offset = (direction === "positive" ? row_index : matrix_size - row_index - 1);
                const row_offset = (row_index + column_index) % 3;
                diagonal_product *= matrix[column_offset][row_offset];
            }
            matrix_sum += diagonal_product;
        }
        return matrix_sum;
    }

    public get_matrix() {
        return this.matrix;
    }

}