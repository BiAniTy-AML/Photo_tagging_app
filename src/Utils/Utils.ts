import { DecidePositions } from "../Utils/Interfaces";

const decide_position = ({
    e,
    parent,
    actual_div,
    offset_x = 0,
    offset_y = 0,
    when_out = "nothing",
    toggle_on_leave_parent,
}: DecidePositions<boolean>): { x: number; y: number } => {
    const parent_rect = parent.getBoundingClientRect();
    const div_rect = actual_div.getBoundingClientRect();

    let variable = toggle_on_leave_parent?.variable;
    const from = toggle_on_leave_parent?.from;
    const to = toggle_on_leave_parent?.to;
    const set_variable_fn = toggle_on_leave_parent?.set_variable_fn;

    let x = 0;
    let y = 0;

    const min_x: number = parent_rect.left + window.scrollX;
    const min_y: number = parent_rect.top + window.scrollY;

    let max_x: number;
    let max_y: number;

    if (when_out === "change") {
        max_x = parent_rect.right + window.scrollX;
        max_y = parent_rect.bottom + window.scrollY;

        x = e.pageX + offset_x - div_rect.width / 2;
        y = e.pageY + offset_y - div_rect.height / 2;

        // Checks if the "dropdown" will appear too close to the end of the screen

        const abs_offx = Math.abs(offset_x);
        const abs_offy = Math.abs(offset_y);

        // If it is too far left
        if (e.pageX - (div_rect.width / 2 + -offset_x) <= min_x) {
            if (abs_offx < div_rect.width / 2 && abs_offx >= 0) {
                x = e.pageX;
            } else if (abs_offx >= div_rect.width / 2) {
                x = e.pageX - (offset_x + div_rect.width / 2);
            }

            y = y;
        }

        // If it is too far right
        if (e.pageX + (div_rect.width / 2 + offset_x) >= max_x) {
            if (abs_offx < div_rect.width / 2 && abs_offx >= 0) {
                x = e.pageX - div_rect.width;
            } else if (abs_offx >= div_rect.width / 2) {
                x = e.pageX - (offset_x + div_rect.width / 2);
            }

            y = y;
        }

        if (e.pageY - (div_rect.width / 2 + -offset_y) <= min_y) {
            if (abs_offy < div_rect.width / 2 && abs_offy >= 0) {
                y = e.pageY;
            } else if (abs_offy >= div_rect.width / 2) {
                y = e.pageY - (offset_y + div_rect.width / 2);
            }

            x = x;
        }

        if (e.pageY + (div_rect.width / 2 + offset_y) >= max_y) {
            if (abs_offy < div_rect.width / 2 && abs_offy >= 0) {
                y = e.pageY - div_rect.width;
            } else if (abs_offy >= div_rect.width / 2) {
                y = e.pageY - (offset_y + div_rect.width / 2);
            }

            x = x;
        }

        // Too far up
        //   if (e.pageY - (div_rect.height / 2 + -offset_y) <= min_y) {
        //       -offset_y < div_rect.height / 2 && -offset_y >= 0
        //           ? (y = e.pageY)
        //           : (y = e.pageY - (offset_y + div_rect.height / 2));

        //       x = x;
        //   }

        //   // Or too far down
        //   if (e.pageY + (div_rect.height / 2 + offset_y) >= max_y) {
        //       offset_y < div_rect.height / 2 && offset_y >= 0
        //           ? (y = e.pageY - div_rect.height)
        //           : (y = e.pageY - (offset_y + div_rect.height / 2));

        //       x = x;
        //   }
    } else {
        max_x = parent_rect.right - div_rect.width + window.scrollX;
        max_y = parent_rect.bottom - div_rect.height + window.scrollY;

        if (set_variable_fn && from !== undefined) set_variable_fn(from);

        x = e.pageX + offset_x - div_rect.width / 2;
        y = e.pageY + offset_y - div_rect.height / 2;

        // Too far left
        if (x <= min_x) {
            x = min_x;
            y = y;
        }

        // Too far right
        if (x >= max_x) {
            x = max_x;
            y = y;
        }

        // Too high
        if (y <= min_y) {
            x = x;
            y = min_y;
        }

        // Too Low
        if (y >= max_y) {
            x = x;
            y = max_y;
        }

        if (
            e.pageY <= min_y ||
            e.pageY >= parent_rect.bottom + window.scrollY
        ) {
            if (set_variable_fn && to) set_variable_fn(to);
        }
    }

    return { x, y };
};

export { decide_position };
