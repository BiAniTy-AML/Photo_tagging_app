import { Dispatch, SetStateAction } from "react";

interface StagesInterface {
    1: Stage;
}

interface Stage {
    name: string;
    // Characters to be found
    targets: Target[];
    bg_img: {
        path: string;
        name: string;
    };
}

interface Target {
    name: string;
    image: string;
    // Where the character is in the image
    // and the acceptable range of selection
    answers: {
        min_x: number;
        max_x: number;
        min_y: number;
        max_y: number;
    };
    // If it has already been found
    found: boolean;
}

// Determines the positio of an element that follows the mouse
interface DecidePositions<T = boolean> {
    e: MouseEvent;

    // The element to be positioned and its parent
    parent: HTMLDivElement;
    actual_div: HTMLDivElement;

    // How far away from the mouse should it be
    offset_x?: number;
    offset_y?: number;

    // What to do when the mouse gets out of the parent
    when_out?: "nothing" | "change" | "stop";

    // If you want to toggle a variable when the mouse leaves the parent
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
