import { Dispatch, SetStateAction } from "react";

interface StagesInterface {
    1: Stage;
}

interface Stage {
    name: string;
    targets: Targets[];
    bg_img: {
        path: string;
        name: string;
    };
}

interface Targets {
    name: string;
    image: string;
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

export type { Stage, StagesInterface, DecidePositions };
