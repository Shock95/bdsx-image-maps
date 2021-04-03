export class Color {

    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r: number, g: number, b: number, a: number = 0xff) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    static fromARGB(code: number): Color {
        return new Color((code >> 16) & 0xff, (code >> 8) & 0xff, code & 0xff, (code >> 24) & 0xff);
    }

    static fromABGR(code: number): Color {
        return new Color(code & 0xff, (code >> 8) & 0xff, (code >> 16) & 0xff, (code >> 24) & 0xff);
    }

    static fromRGB(code: number): Color {
        return new Color((code >> 16) & 0xff, (code >> 8) & 0xff, code & 0xff, 0);
    }

    toABGR(): number {
        return (this.a << 24) | (this.b << 16) | (this.g << 8) | this.r;
    }

    toARGB(): number {
        return (this.a << 24) | (this.r << 16) | (this.g << 8) | this.b;
    }
}