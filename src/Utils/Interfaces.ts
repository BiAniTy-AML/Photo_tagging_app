import { Dispatch, SetStateAction } from "react";

interface StagesInterface {
    1: Stage;
}

interface Stage {
    name: string;
    targets: Target[];
    bg_img: {
        path: string;
        name: string;
    };
}

interface Target {
    name: string;
    image: string;
    answers: {
        min_x: number;
        max_x: number;
        min_y: number;
        max_y: number;
    };
    found: boolean;
}

interface DecidePositions<T = boolean> {
    e: MouseEvent;
    parent: HTMLDivElement;
    actual_div: HTMLDivElement;
    offset_x?: number;
    offset_y?: number;
    when_out?: "nothing" | "change" | "stop";
    toggle_on_leave_parent?: {
        variable?: T;
        from: T;
        to: T;
        set_variable_fn?: Dispatch<SetStateAction<T>>;
    };
}

interface ResultInfo {
    fx: number;
    fy: number;
    coordinates_lens: { x: number; y: number };
}

export type { Stage, StagesInterface, DecidePositions, ResultInfo };
